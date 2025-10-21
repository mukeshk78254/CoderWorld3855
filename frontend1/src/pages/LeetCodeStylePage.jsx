import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import Editorial from "../components/Editorial";
import ChatAi from "../components/ChatAi";
import ProblemDiscussion from "../components/ProblemDiscussion";
import { gsap } from "gsap";

const langMap = { cpp: "C++", java: "Java", javascript: "JavaScript" };

function LeetCodeStylePage() {
    console.log("=== LeetCodeStylePage COMPONENT INITIALIZED ===");
    console.log("Current URL:", window.location.href);
    
    const { problemid } = useParams();
    console.log("Problem ID from useParams:", problemid);
    
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    console.log("Authentication status:", isAuthenticated);
    
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [loading, setLoading] = useState(true);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeTab, setActiveTab] = useState("description");
    const [showModal, setShowModal] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [allProblems, setAllProblems] = useState([]);
    const [showProblemList, setShowProblemList] = useState(false);
    const [loadingModalText, setLoadingModalText] = useState("");
    const [editorZoom, setEditorZoom] = useState(14);
    const [submissionKnowledge, setSubmissionKnowledge] = useState("");
    const [submissionTags, setSubmissionTags] = useState("");
    const [hasSubmittedSolution, setHasSubmittedSolution] = useState(false);
    const [sharedSolutions, setSharedSolutions] = useState([]);
    
    
    const [selectedVisibleCase, setSelectedVisibleCase] = useState(0);
    const [customInput, setCustomInput] = useState("");
    const [customExpected, setCustomExpected] = useState("");
    const [customResult, setCustomResult] = useState(null);
    const [isRunningCustom, setIsRunningCustom] = useState(false);
    const [referenceUnavailable, setReferenceUnavailable] = useState(false);

    
    useEffect(() => {
        if (containerRef.current) {
            
            gsap.fromTo(containerRef.current.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, []);

    
    useEffect(() => {
        const savedSolutions = JSON.parse(localStorage.getItem('sharedSolutions') || '[]');
        const problemSolutions = savedSolutions.filter(sol => sol.problemId === problemid);
        setSharedSolutions(problemSolutions);
    }, [problemid]);

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log("LeetCodeStylePage mounted - Fetching problem data for ID:", problemid);
            console.log("URL Path:", window.location.pathname);
            console.log("URL Search:", window.location.search);
            try {
                const url = `/problem/public/problembyid/${problemid}`;
                console.log("Making API request to:", url);
                const response = await axiosClient.get(url);
                console.log("Problem data received:", response.data);
                
                setProblem(response.data);
                
                const starter = response.data.startcode?.find(sc => 
                    selectedLanguage === "cpp" ? ["cpp", "c++"].includes(sc.language) : sc.language === selectedLanguage
                );
                setCode(starter?.initialcode || "// No starter code available");
                console.log("Starter code set for language:", selectedLanguage);
            } catch (err) {
                console.error("Error loading problem:", err);
               
                setProblem({
                    _id: problemid,
                    title: "Add Two Numbers",
                    description: "<p>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>",
                    visibletestcases: [
                        { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807" },
                        { input: "l1 = [0], l2 = [0]", output: "[0]", explanation: "0 + 0 = 0" }
                    ],
                    startcode: [
                        { language: "javascript", initialcode: "function addTwoNumbers(l1, l2) {\n    // Your code here\n    return null;\n};" }
                    ]
                });
                setCode("function addTwoNumbers(l1, l2) {\n    // Your code here\n    return null;\n};");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [problemid, selectedLanguage]);

   
    useEffect(() => {
        if (problem) {
            const starter = problem.startcode?.find(sc => 
                selectedLanguage === "cpp" ? ["cpp", "c++"].includes(sc.language) : sc.language === selectedLanguage
            );
            const newCode = starter?.initialcode || "// No starter code for this language.";
            
            if (newCode !== code) {
                gsap.to(editorRef.current, { 
                    opacity: 0.5, 
                    duration: 0.3,
                    onComplete: () => {
                        setCode(newCode);
                        gsap.to(editorRef.current, { 
                            opacity: 1, 
                            duration: 0.3 
                        });
                    }
                });
            }
        }
    }, [selectedLanguage, problem]);

   
    const handleRun = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setShowModal(true);
        setLoadingModalText("💻 Running your code...");
        setRunResult(null);
        setSubmitResult(null);
        
       
        gsap.fromTo('.modal-content', 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        try {
            const { data } = await axiosClient.post(`/submission/run/${problemid}`, {
                code,
                language: selectedLanguage === "cpp" ? "c++" : selectedLanguage
            });
            
            const decodeMaybeBase64 = (s) => {
                if (!s || typeof s !== 'string') return s || '';
                try {
                    const b64 = s.replace(/\s/g, '');
                    const isB64 = /^[A-Za-z0-9+/=]+$/.test(b64) && b64.length % 4 === 0;
                    if (!isB64) return s;
                    return atob(b64);
                } catch { return s; }
            };

            const results = data.map((res, i) => ({
                input: problem.visibletestcases[i]?.input || "",
                expected: problem.visibletestcases[i]?.output || "",
                output: decodeMaybeBase64(res.stdout) || decodeMaybeBase64(res.stderr) || decodeMaybeBase64(res.compile_output) || "No output",
                passed: res.status.id === 3
            }));
            
            setRunResult(results);
            
           
            gsap.fromTo('.result-item',
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        } catch {
            setRunResult([{ error: "Run failed. Please try again." }]);
        } finally {
            setLoadingModalText("");
        }
    };

    const extractErrorLine = (message) => {
        if (!message) return null;
        const patterns = [
            /on line (\d+)/i,
            /:(\d+):\d*:/,          
            /line (\d+)\b/,
            /\((\d+),\d+\)/
        ];
        for (const re of patterns) {
            const m = message.match(re);
            if (m && m[1]) return parseInt(m[1], 10);
        }
        return null;
    };

    const normalize = (s) => (s ?? "").toString().trim().replace(/\r\n/g, "\n").replace(/\t/g, '  ');

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setShowModal(true);
        setLoadingModalText("🚀 Submitting...");
        setRunResult(null);
        setSubmitResult(null);
        
        try {
            const { data } = await axiosClient.post(`/submission/submit/${problemid}`, {
                code,
                language: selectedLanguage === "cpp" ? "c++" : selectedLanguage
            });
            setSubmitResult(data);
            console.log("Submit result data:", data);
            console.log("Submit result status:", data.status);
            
           
            if (data.status === "accepted" || data.status === "Accepted") {
                setHasSubmittedSolution(true);
               
                localStorage.setItem('lastSubmittedCode', code);
                localStorage.setItem('lastSubmittedLanguage', selectedLanguage);
            }
        } catch {
            setSubmitResult({ status: "error", message: "Submission failed." });
        } finally {
            setLoadingModalText("");
        }
    };
    
    
    const handleRunCustom = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setIsRunningCustom(true);
        setCustomResult(null);
        setReferenceUnavailable(false); 
        
        try {
            const { data } = await axiosClient.post(`/submission/run-custom/${problemid}`, {
                code,
                language: selectedLanguage === "cpp" ? "c++" : selectedLanguage,
                input: customInput
            });
            
            const decodeMaybeBase64 = (s) => {
                if (!s || typeof s !== 'string') return s || '';
                try {
                    const b64 = s.replace(/\s/g, '');
                    const isB64 = /^[A-Za-z0-9+/=]+$/.test(b64) && b64.length % 4 === 0;
                    if (!isB64) return s;
                    return atob(b64);
                } catch { return s; }
            };

           
            const userOutput = decodeMaybeBase64(data.stdout) || 
                              decodeMaybeBase64(data.stderr) || 
                              decodeMaybeBase64(data.compile_output) || 
                              "No output";
            
           
            if (data.reference_unavailable || !data.reference_output) {
                setReferenceUnavailable(true);
            }
            
            let passed = undefined;
            if (customExpected.trim()) {
                
                const normalizedOutput = normalize(userOutput);
                const normalizedExpected = normalize(customExpected);
                passed = normalizedOutput === normalizedExpected;
            }
            
            setCustomResult({
                userOutput,
                expected: customExpected.trim() || null,
                error: data.stderr ? decodeMaybeBase64(data.stderr) : null,
                passed
            });
            
          
            gsap.fromTo('.custom-result-item',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        } catch (error) {
            console.error("Custom test error:", error);
            setReferenceUnavailable(true);
            setCustomResult({ 
                error: "Custom test run failed. Please try again.",
                userOutput: null,
                expected: null,
                passed: false
            });
        } finally {
            setIsRunningCustom(false);
        }
    };

    const handleZoomIn = () => {
        setEditorZoom(prev => Math.min(prev + 2, 24));
    };

    const handleZoomOut = () => {
        setEditorZoom(prev => Math.max(prev - 2, 8));
    };

    const handleResetZoom = () => {
        setEditorZoom(14);
    };

    const handleShareSolution = async () => {
        if (!submissionKnowledge.trim() || !submissionTags.trim()) {
            alert("Please provide knowledge description and tags before sharing.");
            return;
        }

        try {
            
            const solutionData = {
                id: Date.now(), 
                problemId: problemid,
                code,
                language: selectedLanguage,
                knowledge: submissionKnowledge,
                tags: submissionTags.split(',').map(tag => tag.trim()),
                timestamp: new Date().toISOString(),
                author: "You" 
            };
            
           
            setSharedSolutions(prev => [solutionData, ...prev]);
            
           
            setSubmissionKnowledge("");
            setSubmissionTags("");
            
            alert("Solution shared successfully! Thank you for contributing to the community.");
        } catch (error) {
            alert("Failed to share solution. Please try again.");
        }
    };


    const handleResetCode = () => {
        gsap.to(editorRef.current, { 
            scale: 0.95, 
            duration: 0.2,
            onComplete: () => {
                setCode("");
                gsap.to(editorRef.current, { 
                    scale: 1, 
                    duration: 0.2 
                });
            }
        });
    };

    const handleFormatCode = () => {
        if (editorRef.current) {
            editorRef.current.getAction('editor.action.formatDocument').run();
            gsap.to(editorRef.current, { 
                scale: 1.02, 
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
        if (!isFullScreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleBack = () => {
        gsap.to(containerRef.current, { 
            x: -window.innerWidth, 
            duration: 0.5, 
            ease: "power2.in",
            onComplete: () => navigate("/home")
        });
    };

    const fetchAllProblems = async () => {
        
        if (allProblems.length > 0) {
            setShowProblemList(!showProblemList);
            return;
        }
        
        try {
            console.log("Fetching all problems...");
            const url = "/problem/public/getallproblem";
            console.log("API request to:", url);
            
            const res = await axiosClient.get(url);
            console.log("Problems received:", res.data);
            
            if (Array.isArray(res.data) && res.data.length > 0) {
                setAllProblems(res.data);
                setShowProblemList(true);
                
              
                gsap.fromTo('.problem-list-item',
                    { x: -20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }
                );
            } else {
                console.error("No problems returned or invalid data format:", res.data);
                alert("No problems available at this time.");
            }
        } catch (err) {
            console.error("Error fetching problem list:", err);
            alert("Failed to load problem list.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white text-xl font-mono">Loading...</div>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-600 text-xl">Problem not found</div>
                </div>
            </div>
        );
    }

  
    console.log("=== LeetCodeStylePage RENDERING ===");
    console.log("Problem data:", problem);
    console.log("Problem ID:", problemid);
    console.log("Custom test variables added: selectedVisibleCase, customInput, customExpected");
    console.log("Fixed referenceUnavailable:", referenceUnavailable);
    
    return (
        <div className={`min-h-screen flex bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white font-mono ${isFullScreen ? "fixed inset-0 z-50" : ""}`}>
            <style>{`
                .tab-active { border-bottom: 2px solid cyan; }
                .fade-in { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn { from {opacity: 0; transform: translateY(10px);} to {opacity: 1; transform: translateY(0);} }
            `}</style>
            
            
           
            <div ref={containerRef} className="relative z-10 flex w-full">
            
                <div className="w-1/2 p-4 space-y-3 overflow-y-auto relative">
                    <div className="flex justify-between items-center">
                       
                        <Logo 
                          className="group"
                          onClick={handleBack}
                          iconSizeClass="w-14 h-14"
                          innerImgSizeClass="w-12 h-12"
                          textSizeClass="text-3xl"
                        />
                        
                 
                        <motion.div 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchAllProblems} 
                            className="cursor-pointer text-cyan-300 hover:text-cyan-200 hover:underline transition-all duration-300 px-4 py-3 rounded-lg hover:bg-slate-800/50 flex items-center gap-2"
                            style={{ fontFamily: "'Source Code Pro', monospace" }}
                        >
                              <img src="/src/pages/3240846.png" alt="Problems" className="w-10 h-10 justify-align-start padding-10" /> 
                              <span className="text-xl font-bold w-20 justify-align-start padding-10">Problems</span>
                        </motion.div>
                    </div>

                    {showProblemList && (
                        <div className="bg-gray-900 border border-gray-700 p-3 rounded max-h-60 overflow-y-auto">
                            <h3 className="text-xl font-bold mb-2">All Problems</h3>
                            {allProblems.length > 0 ? (
                                <ul className="space-y-1">
                                    {allProblems.map((p, index) => (
                                        <motion.li 
                                            key={p._id || index} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                console.log("Problem clicked:", p);
                                                console.log("Problem ID:", p._id);
                                                
                                              
                                                const a = document.createElement('a');
                                                a.href = `/problem/${p._id}`;
                                                a.target = '_self';
                                                a.click();
                                            }} 
                                            className="problem-list-item text-cyan-300 cursor-pointer hover:text-cyan-200 hover:underline transition-all duration-300 py-1 px-2 rounded hover:bg-gray-800/50 text-base font-medium"
                                        >
                                            ➤ {p.title || `Problem #${index + 1}`}
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-gray-400">Loading problems...</p>
                                    <div className="mt-2 loading loading-spinner loading-md"></div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex space-x-6 border-b border-gray-600 text-gray-300 mt-2">
                        {["description", "editorial", "solution", "discuss", "submissions", "chatAi"].map(tab => (
                            <motion.div 
                                key={tab} 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab)} 
                                className={`py-2 cursor-pointer transition-all duration-300 text-base font-medium ${
                                    activeTab === tab 
                                        ? "text-cyan-400 border-b-2 border-cyan-400" 
                                        : "hover:text-white hover:border-b-2 hover:border-gray-400"
                                }`}
                                style={{ fontFamily: "'Source Code Pro', monospace" }}
                            >
                                {tab.toUpperCase()}
                            </motion.div>
                        ))}
                    </div>

                    <div className="fade-in">
                        {activeTab === "description" && (
                            <>
                                <motion.h2 
                                    whileHover={{ scale: 1.02 }}
                                    className="text-2xl font-bold mt-3 text-white"
                                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                                >
                                    {problem?.title}
                                </motion.h2>
                                <div className="prose prose-invert mt-4" dangerouslySetInnerHTML={{ __html: problem?.description }} />
                                <div className="mt-4 space-y-2">
                                    {problem?.visibletestcases?.map((ex, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className="bg-gray-800 p-3 rounded border border-gray-700 hover:border-gray-600 transition-all duration-300"
                                        >
                                            <p><strong>Input:</strong> {ex.input}</p>
                                            <p><strong>Output:</strong> {ex.output}</p>
                                            {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                        
                        {activeTab === "editorial" && (
                            <div>
                                <h3 className="text-lg font-bold mb-4">📚 Editorial Solution</h3>
                                {problem?.secureUrl ? (
                                    <Editorial secureUrl={problem.secureUrl} />
                                ) : (
                                    <div className="bg-gray-800 p-6 rounded border border-gray-700 text-center">
                                        <div className="text-gray-400 text-lg mb-2">📝</div>
                                        <p className="text-gray-400">No editorial solution available for this problem yet.</p>
                                        <p className="text-sm text-gray-500 mt-2">Check back later or contribute by sharing your solution!</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === "solution" && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">💡 Solutions</h3>
                                    {hasSubmittedSolution && (
                                        <button 
                                            onClick={() => {
                                                const encodedCode = encodeURIComponent(code);
                                                const encodedLanguage = encodeURIComponent(selectedLanguage);
                                                navigate(`/problem/${problemid}/write-solution?code=${encodedCode}&language=${encodedLanguage}`);
                                            }}
                                            className="btn btn-success btn-sm"
                                        >
                                            + Write Solution
                                        </button>
                                    )}
                                </div>
                                
                                {sharedSolutions.length > 0 ? (
                                    <div className="space-y-4">
                                        {sharedSolutions.map((solution) => (
                                            <div key={solution.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium text-cyan-400">{solution.author}</span>
                                                            <span className="text-xs text-gray-500">•</span>
                                                            <span className="text-xs text-gray-500">{solution.language}</span>
                                                            <span className="text-xs text-gray-500">•</span>
                                                            <span className="text-xs text-gray-500">{new Date(solution.timestamp).toLocaleDateString()}</span>
                                                            {solution.isPermanent && (
                                                                <>
                                                                    <span className="text-xs text-gray-500">•</span>
                                                                    <span className="text-xs text-green-400">🔒 Permanent</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {solution.tags.map((tag, index) => (
                                                                <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-300">{solution.description}</p>
                                                </div>
                                                
                                                <div className="bg-gray-700 border border-gray-600 rounded p-3">
                                                    <div className="text-xs text-gray-400 mb-2">Code:</div>
                                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">{solution.code}</pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 p-6 rounded border border-gray-700 text-center">
                                        <div className="text-gray-400 text-4xl mb-4">📝</div>
                                        <h4 className="text-lg font-semibold text-gray-300 mb-3">No solutions shared yet</h4>
                                        <p className="text-gray-400 mb-4">
                                            {hasSubmittedSolution 
                                                ? "Be the first to share your solution with the community!"
                                                : "Solve this problem first, then share your solution!"
                                            }
                                        </p>
                                        {hasSubmittedSolution && (
                                            <button 
                                                onClick={() => {
                                                    const encodedCode = encodeURIComponent(code);
                                                    const encodedLanguage = encodeURIComponent(selectedLanguage);
                                                    navigate(`/problem/${problemid}/write-solution?code=${encodedCode}&language=${encodedLanguage}`);
                                                }}
                                                className="btn btn-success btn-sm"
                                            >
                                                Write First Solution
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === "discuss" && (
                            <ProblemDiscussion 
                                problemId={problemid} 
                                problemTitle={problem?.title || "Problem"} 
                            />
                        )}
                        
                        {activeTab === "submissions" && (
                          <>
                            <SubmissionHistory problemid={problemid} />
                          </>
                        )}
                        {activeTab === "chatAi" && <ChatAi problem={problem} />}
                    </div>
                </div>

         
                <div className="w-1/2 p-4 flex flex-col gap-3">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-3">
                            <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} className="bg-gray-800 border border-gray-600 p-2 rounded text-white">
                                {Object.entries(langMap).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                           
                            <div className="flex items-center gap-1 bg-gray-800 border border-gray-600 rounded">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleZoomOut} 
                                    className="px-2 py-1 text-white hover:bg-gray-700 rounded-l transition-colors duration-200" 
                                    title="Zoom Out"
                                >
                                    -
                                </motion.button>
                                <span className="px-2 py-1 text-white text-sm border-x border-gray-600">{editorZoom}px</span>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleZoomIn} 
                                    className="px-2 py-1 text-white hover:bg-gray-700 rounded-r transition-colors duration-200" 
                                    title="Zoom In"
                                >
                                    +
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleResetZoom} 
                                    className="px-2 py-1 text-white hover:bg-gray-700 ml-1 rounded transition-colors duration-200" 
                                    title="Reset Zoom"
                                >
                                    ⌂
                                </motion.button>
                            </div>
                        </div>

                        {!isAuthenticated && (
                            <div className="alert alert-info mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Please <button className="link link-primary" onClick={() => navigate('/login')}>login</button> to run and submit your code.</span>
                            </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRun} 
                                className="btn btn-info btn-sm transition-all duration-200 font-bold"
                            >
                                Run
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit} 
                                className="btn btn-success btn-sm transition-all duration-200 font-bold"
                            >
                                Submit
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    console.log("Test navigation to write solution page");
                                    const encodedCode = encodeURIComponent(code);
                                    const encodedLanguage = encodeURIComponent(selectedLanguage);
                                    const url = `/problem/${problemid}/write-solution?code=${encodedCode}&language=${encodedLanguage}`;
                                    console.log("Test URL:", url);
                                    navigate(url);
                                }}
                                className="btn btn-warning btn-sm transition-all duration-200 font-bold"
                            >
                                Test Write Solution
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    navigator.clipboard.writeText(code);
                                    alert("Code copied to clipboard!");
                                }}
                                className="btn btn-primary btn-sm transition-all duration-200 font-bold"
                            >
                                Copy
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleResetCode} 
                                className="btn btn-warning btn-sm transition-all duration-200 font-bold"
                            >
                                Reset
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFormatCode} 
                                className="btn btn-secondary btn-sm transition-all duration-200 font-bold"
                            >
                                Format
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleFullScreen} 
                                className="btn btn-outline btn-sm transition-all duration-200 font-bold"
                            >
                                {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                            </motion.button>
                        </div>
                    </div>

                    <div className="flex-grow border border-gray-700 rounded overflow-hidden">
                        <Editor
                            language={selectedLanguage}
                            value={code}
                            onChange={(v) => setCode(v || "")}
                            theme="vs-dark"
                            onMount={(editor) => (editorRef.current = editor)}
                            options={{ 
                                minimap: { enabled: false }, 
                                fontSize: editorZoom,
                                automaticLayout: true,
                                wordWrap: "on",
                                lineNumbers: "on",
                                renderLineHighlight: "line",
                                cursorStyle: "line",
                                fontLigatures: true,
                                bracketPairColorization: { enabled: true },
                                guides: { bracketPairs: true }
                            }}
                        />
                    </div>

                
                    <div className="mt-2 bg-gray-900 border border-gray-700 rounded p-3">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-200">Custom Test</h4>
                            <div className="flex items-center gap-2">
                                {problem?.visibletestcases?.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded px-2 py-1"
                                            value={selectedVisibleCase}
                                            onChange={(e) => setSelectedVisibleCase(Number(e.target.value))}
                                        >
                                            {problem.visibletestcases.map((_, idx) => (
                                                <option key={idx} value={idx}>Test #{idx + 1}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-outline btn-xs"
                                            onClick={() => {
                                                const t = problem.visibletestcases[selectedVisibleCase];
                                                setCustomInput(t?.input || "");
                                                setCustomExpected(t?.output || "");
                                            }}
                                        >Use Test</button>
                                    </div>
                                )}
                                <button onClick={handleRunCustom} disabled={isRunningCustom} className={`btn btn-info btn-xs ${isRunningCustom ? 'opacity-70 brightness-90 cursor-not-allowed bg-cyan-600/70 border-cyan-500/40' : ''}`}>{isRunningCustom ? 'Running...' : 'Run Custom Test'}</button>
                            </div>
                        </div>
                        {referenceUnavailable && (
                            <div className="text-xs text-amber-300 mb-2">Reference runner unavailable. Comparing your code against selected test’s expected output instead.</div>
                        )}
                        <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Enter stdin for your program..."
                            className="w-full h-24 p-2 rounded bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <div className="mt-2">
                            <label className="block text-xs text-gray-400 mb-1">Expected Output (optional)</label>
                            <textarea
                                value={customExpected}
                                onChange={(e) => setCustomExpected(e.target.value)}
                                placeholder="Enter expected output to compare (optional)"
                                className="w-full h-16 p-2 rounded bg-gray-800 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                        </div>
                        {customResult && (
                            <div className="custom-result-item mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
                                <div className={`bg-gray-800 border ${customResult.passed === false ? 'border-red-500/40' : customResult.passed === true ? 'border-green-500/40' : 'border-gray-700'} rounded p-3`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs text-gray-400">Your Code Output</div>
                                        {customResult.passed !== undefined && (
                                            <div className={`text-xs ${customResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                {customResult.passed ? 'PASSED' : 'FAILED'}
                                            </div>
                                        )}
                                    </div>
                                    <pre className="text-sm whitespace-pre-wrap text-gray-100">{customResult.userOutput || '—'}</pre>
                                </div>
                                
                                <div className={`bg-gray-800 border ${customResult.expected ? 'border-gray-700' : 'border-gray-900'} rounded p-3`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs text-gray-400">Expected Output</div>
                                        {!customResult.expected && (
                                            <div className="text-xs text-amber-400">Not Provided</div>
                                        )}
                                    </div>
                                    <pre className="text-sm whitespace-pre-wrap text-gray-100">{customResult.expected || 'No expected output provided for comparison'}</pre>
                                </div>
                                
                                <div className={`bg-gray-900 border ${customResult.error ? 'border-red-500/40' : 'border-gray-700'} rounded p-3`}>
                                    <div className="text-xs text-red-300 font-semibold mb-1">Errors</div>
                                    {customResult.error ? (
                                        <>
                                            <pre className="text-sm whitespace-pre-wrap text-red-400">{customResult.error}</pre>
                                            {customResult.line && (
                                                <div className="text-xs text-amber-300 mt-1">Possible error near line {customResult.line}</div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-400">No errors detected</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="modal-content bg-gray-900 p-6 rounded-lg border border-gray-700 w-[90%] max-w-2xl fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">🎯 Result</h3>
                            <button onClick={() => setShowModal(false)} className="btn btn-error btn-sm">Close</button>
                        </div>
                        
                        {loadingModalText && <div className="text-center text-cyan-300 mb-4">{loadingModalText}</div>}
                        
                        {runResult && runResult.map((r, i) => (
                            <div key={i} className="result-item bg-gray-800 p-3 mb-2 rounded">
                                {r.error ? (
                                    <p className="text-red-400">{r.error}</p>
                                ) : (
                                    <>
                                        <p><strong>Input:</strong> {r.input}</p>
                                        <p><strong>Expected:</strong> {r.expected}</p>
                                        <p><strong>Output:</strong> {r.output}</p>
                                        <p className={r.passed ? "text-green-400" : "text-red-400"}>
                                            {r.passed ? "✓ Passed" : "✗ Failed"}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                        
                        {submitResult && (
                            <div className="text-center mt-4">
                                <h2 className="text-2xl text-green-400">🎉 {submitResult.status?.toUpperCase()}</h2>
                                {submitResult.runtime && <p>Runtime: {submitResult.runtime} ms</p>}
                                {submitResult.memory && <p>Memory: {submitResult.memory} KB</p>}
                                {submitResult.message && <p className="text-red-400">{submitResult.message}</p>}
                                
                                {(submitResult.status === "accepted" || submitResult.status === "Accepted") && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-green-400 mb-2">🎉 Congratulations! Your solution was accepted!</p>
                                        <p className="text-sm text-gray-300 mb-3">Would you like to share your solution with the community?</p>
                                        <button 
                                            onClick={() => {
                                                console.log("Write Solution button clicked");
                                                console.log("Current code:", code);
                                                console.log("Current language:", selectedLanguage);
                                                const encodedCode = encodeURIComponent(code);
                                                const encodedLanguage = encodeURIComponent(selectedLanguage);
                                                const url = `/problem/${problemid}/write-solution?code=${encodedCode}&language=${encodedLanguage}`;
                                                console.log("Navigating to:", url);
                                                navigate(url);
                                            }}
                                            className="btn btn-success btn-sm"
                                        >
                                            Write Solution
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default LeetCodeStylePage;