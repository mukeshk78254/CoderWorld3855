import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, ArrowRight, Sparkles } from 'lucide-react';
import { loginSuccess } from "../authSlice"; 

function ChatAi({problem}) {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    

    const isPremium = !!(user && (user.isPremium || user.premium));
    
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi, How are you"}]},
        { role: 'user', parts:[{text: "I am Good"}]}
    ]);
    const [checkingPremium, setCheckingPremium] = useState(false);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    
    useEffect(() => {
        const checkPremiumStatus = async () => {
            if (isAuthenticated && !isPremium) {
                try {
                    setCheckingPremium(true);
                    const response = await axiosClient.get('/user/check'); 
                    if (response.data.user) {
                        
                        dispatch(loginSuccess(response.data.user));
                    }
                } catch (error) {
                    console.error("Error checking premium status:", error);
                } finally {
                    setCheckingPremium(false);
                }
            }
        };
        
        checkPremiumStatus();
    }, [isAuthenticated, isPremium, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const navigateToPremium = () => {
      
        window.location.href = '/premium';
    };

    const onSubmit = async (data) => {
        if (!isAuthenticated || !isPremium) {
            navigateToPremium();
            return;
        }
        
        setMessages(prev => [...prev, { role: 'user', parts:[{text: data.message}] }]);
        reset();

        try {
            
            const response = await axiosClient.post("/ai/chat", {
                messages:messages,
                title:problem.title,
                description:problem.description,
                testcases: problem.visibletestcases,
                startcode:problem.startcode
            });

           
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
          
            {isPremium && (
                <div className="p-3 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 border-2 border-green-500/40 rounded-xl mb-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <div className="text-white font-semibold text-sm">AI Assistant Unlocked! 🎉</div>
                            <div className="text-xs text-gray-300">You have full access to AI-powered code help</div>
                        </div>
                    </div>
                </div>
            )}

          
            {!isPremium && isAuthenticated && (
                <div className="p-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 border-2 border-purple-500/40 rounded-xl mb-3 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <ArrowRight size={20} className="text-white" />
                            </div>
                            <div>
                                <div className="text-white font-semibold">🔒 Unlock AI Assistant</div>
                                <div className="text-xs text-gray-300">Upgrade to Premium for instant code help</div>
                            </div>
                        </div>
                        <button 
                            onClick={navigateToPremium} 
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                            Explore Premium <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-bubble bg-base-200 text-base-content">
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center gap-2">
                    <input 
                        placeholder={isPremium ? "Ask me anything..." : "Upgrade to Premium to use AI Chat"} 
                        className={`input input-bordered flex-1 ${!isPremium ? 'cursor-not-allowed opacity-60' : ''}`}
                        {...register("message", { required: true, minLength: 2 })}
                        disabled={!isPremium}
                    />
                    <button 
                        type="submit" 
                        className={`btn ml-2 ${isPremium ? 'btn-primary' : 'btn-disabled'}`}
                        disabled={!isPremium || errors.message}
                    >
                        <Send size={20} />
                    </button>
                </div>
                {!isPremium && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        💎 Premium feature - Subscribe to unlock AI assistance
                    </p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;

