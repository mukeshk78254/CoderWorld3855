
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import Editorial from "../components/Editorial";
import ChatAi from "../components/ChatAi";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript"
};

function ProblemPage() {
  const { problemid } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

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

 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/problem/problembyid/${problemid}`);
        setProblem(data);
        const starter = data.startcode.find(sc =>
          selectedLanguage === "cpp"
            ? ["cpp", "c++"].includes(sc.language)
            : sc.language === selectedLanguage
        );
        setCode(starter?.initialcode || "// No starter code available");
      } catch (err) {
        console.error("Error loading problem:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [problemid]);

 
  useEffect(() => {
    if (problem) {
      const starter = problem.startcode.find(sc =>
        selectedLanguage === "cpp"
          ? ["cpp", "c++"].includes(sc.language)
          : sc.language === selectedLanguage
      );
      setCode(starter?.initialcode || "// No starter code for this language.");
    }
  }, [selectedLanguage]);

  const handleRun = async () => {
   
    if (!code.trim()) {
      setRunResult([{ error: "❌ Please write some code before running!" }]);
      setShowModal(true);
      return;
    }

    setShowModal(true);
    setLoadingModalText("💻 Running your code...");
    setRunResult(null);
    setSubmitResult(null);
    
    try {
      const { data } = await axiosClient.post(`/submission/run/${problemid}`, {
        code,
        language: selectedLanguage === "cpp" ? "c++" : selectedLanguage
      });
      
      if (data && Array.isArray(data)) {
      const results = data.map((res, i) => ({
        input: problem.visibletestcases[i]?.input || "",
        expected: problem.visibletestcases[i]?.output || "",
        output: res.stdout || res.stderr || res.compile_output || "No output",
          passed: res.status?.id === 3,
          status: res.status?.description || "Unknown"
      }));
      setRunResult(results);
        setLoadingModalText("✅ Code executed successfully!");
      } else {
        setRunResult([{ error: "❌ Invalid response from server. Please try again." }]);
      }
    } catch (error) {
      console.error('Run error:', error);
      let errorMessage = "❌ Run failed. Please try again.";
      
      if (error.response?.status === 400) {
        errorMessage = "❌ Invalid code or missing parameters.";
      } else if (error.response?.status === 401) {
        errorMessage = "❌ Please login to run code.";
      } else if (error.response?.status === 500) {
        errorMessage = "❌ Server error. Please try again later.";
      }
      
      setRunResult([{ error: errorMessage }]);
    } finally {
      setTimeout(() => setLoadingModalText(""), 2000);
    }
  };

  const handleSubmit = async () => {
    
    if (!code.trim()) {
      setSubmitResult({ status: "error", message: "❌ Please write some code before submitting!" });
    setShowModal(true);
      return;
    }

    setShowModal(true);
    setLoadingModalText("🚀 Submitting your solution...");
    setRunResult(null);
    setSubmitResult(null);
    
    try {
      const { data } = await axiosClient.post(`/submission/submit/${problemid}`, {
        code,
        language: selectedLanguage === "cpp" ? "c++" : selectedLanguage
      });
      
      if (data) {
       
        const formattedResult = {
          status: data.status || "unknown",
          testCasesPassed: data.testCasesPassed || 0,
          testCasesTotal: data.testCasesTotal || 0,
          runtime: data.runtime || 0,
          memory: data.memory || 0,
          errorMessage: data.errorMessage || null,
          message: getSubmissionMessage(data.status, data.testCasesPassed, data.testCasesTotal)
        };
        setSubmitResult(formattedResult);
        setLoadingModalText("✅ Submission completed!");
      } else {
        setSubmitResult({ status: "error", message: "❌ Invalid response from server." });
      }
    } catch (error) {
      console.error('Submit error:', error);
      let errorMessage = "❌ Submission failed. Please try again.";
      
      if (error.response?.status === 400) {
        errorMessage = "❌ Invalid code or missing parameters.";
      } else if (error.response?.status === 401) {
        errorMessage = "❌ Please login to submit code.";
      } else if (error.response?.status === 500) {
        errorMessage = "❌ Server error. Please try again later.";
      }
      
      setSubmitResult({ status: "error", message: errorMessage });
    } finally {
      setTimeout(() => setLoadingModalText(""), 2000);
    }
  };

  
  const getSubmissionMessage = (status, passed, total) => {
    switch (status) {
      case 'accepted':
        return `🎉 Congratulations! All ${total} test cases passed!`;
      case 'wrong answer':
        return `❌ Wrong Answer. ${passed}/${total} test cases passed.`;
      case 'error':
        return `❌ Runtime Error. ${passed}/${total} test cases passed.`;
      case 'time limit exceeded':
        return `⏰ Time Limit Exceeded. ${passed}/${total} test cases passed.`;
      case 'memory limit exceeded':
        return `💾 Memory Limit Exceeded. ${passed}/${total} test cases passed.`;
      default:
        return `❓ Unknown status. ${passed}/${total} test cases passed.`;
    }
  };

  const handleResetCode = () => {
    setCode("");
  };

  const handleFormatCode = () => {
    const formatted = code.split("\n").map(line => line.trimLeft()).join("\n");
    setCode(formatted);
    alert("Formatted successfully!");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const fetchAllProblems = async () => {
    if (allProblems.length > 0) {
      setShowProblemList(!showProblemList);
      return;
    }
    try {
      const res = await axiosClient.get("/problem/getallproblem");
      setAllProblems(res.data);
      setShowProblemList(true);
    } catch (err) {
      alert("Failed to load problem list.");
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white font-mono ${isFullScreen ? "fixed inset-0 z-50" : ""}`}>
      <style>{`
        .tab-active { border-bottom: 2px solid cyan; }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from {opacity: 0; transform: translateY(10px);} to {opacity: 1; transform: translateY(0);} }
      `}</style>

     
      <div className="w-full md:w-1/2 p-4 overflow-y-auto space-y-4 relative">
        <div className="flex justify-between items-center mb-2">
          <div className="text-3xl font-bold cursor-pointer" onClick={() => navigate("/")}>🧠 CoderWorld</div>
          <div className="cursor-pointer text-sm text-cyan-400 hover:underline" onClick={fetchAllProblems}>📘 Problems</div>
        </div>

        {showProblemList && (
          <div className="bg-gray-900 border border-gray-700 p-3 rounded mb-4 max-h-52 overflow-y-auto">
            <h3 className="text-lg mb-2 font-semibold">All Problems</h3>
            <ul className="space-y-2">
              {allProblems.map((p) => (
                <li
                  key={p._id}
                  className="hover:underline text-cyan-300 cursor-pointer"
                  onClick={() => navigate(`/problem/${p._id}`)}
                >
                  ➤ {p.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-6 border-b border-gray-600 text-gray-300">
          {["description", "editorial", "submissions", "chatAi"].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 cursor-pointer transition ${activeTab === tab ? "tab-active text-cyan-400" : ""}`}
            >
              {tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="fade-in">
          {activeTab === "description" && (
            <>
              <h2 className="text-xl font-bold">{problem?.title}</h2>
              <div className="prose prose-invert mt-4" dangerouslySetInnerHTML={{ __html: problem?.description }} />
              <div className="mt-4 space-y-2">
                {(problem?.visibletestcases || []).map((ex, i) => (
                  <div key={i} className="bg-gray-800 p-3 rounded border border-gray-700">
                    <p><strong>Input:</strong> {ex.input}</p>
                    <p><strong>Output:</strong> {ex.output}</p>
                    {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === "editorial" && <Editorial secureUrl={problem?.secureUrl} />}
          {activeTab === "submissions" && <SubmissionHistory problemid={problemid} />}
          {activeTab === "chatAi" && <ChatAi problem={problem} />}
        </div>
      </div>

    
      <div className="w-full md:w-1/2 p-4 flex flex-col gap-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded"
          >
            {Object.entries(langMap).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            <button onClick={handleRun} className="btn btn-info btn-sm">Run</button>
            <button onClick={handleSubmit} className="btn btn-success btn-sm">Submit</button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Code copied to clipboard!");
              }}
              className="btn btn-primary btn-sm"
            >Copy</button>
            <button onClick={handleResetCode} className="btn btn-warning btn-sm">Reset</button>
            <button onClick={handleFormatCode} className="btn btn-secondary btn-sm">Format</button>
            <button onClick={toggleFullScreen} className="btn btn-outline btn-sm">{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</button>
          </div>
        </div>

        <div className="flex-grow border border-gray-700 rounded overflow-hidden">
          <Editor
            language={selectedLanguage}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            onMount={(editor) => (editorRef.current = editor)}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>

     
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-xl w-full border border-gray-700 fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">🎯 Result</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-error btn-sm">Close</button>
            </div>
            {loadingModalText && <div className="text-center text-cyan-300 mb-4">{loadingModalText}</div>}
            {runResult && runResult.map((r, i) => (
              <div key={i} className="bg-gray-800 p-3 mb-2 rounded">
                {r.error ? <p className="text-red-400">{r.error}</p> : (
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemPage;
