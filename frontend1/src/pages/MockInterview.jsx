import React from 'react';
import { Video, CheckCircle, Clock, Trophy } from 'lucide-react';
import FeatureLock from '../components/FeatureLock';


const MockInterview = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
            <div className="max-w-6xl mx-auto">
               
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        AI Mock Interviews
                    </h1>
                    <p className="text-xl text-gray-300">
                        Practice with AI-powered interview simulations
                    </p>
                    <div className="inline-block mt-4 px-6 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                        <span className="text-yellow-400 font-semibold">👑 Yearly Premium Exclusive</span>
                    </div>
                </div>

                
                <FeatureLock
                    featureName="AI Mock Interviews"
                    description="This feature is exclusively available for Yearly Premium members. Upgrade to unlock unlimited mock interviews, detailed feedback, and interview preparation resources."
                    requireYearly={true}
                >
                  
                    <div className="space-y-8">
                      
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                                <Video className="w-12 h-12 text-purple-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Live Video Sessions</h3>
                                <p className="text-gray-400">Real-time AI interviewer with video responses</p>
                            </div>
                            
                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                                <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Instant Feedback</h3>
                                <p className="text-gray-400">Get detailed analysis of your performance</p>
                            </div>
                            
                            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
                                <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Performance Tracking</h3>
                                <p className="text-gray-400">Track your progress over time</p>
                            </div>
                        </div>

                       
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 p-8 rounded-xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white">Technical Interview</h3>
                                    <Clock className="w-6 h-6 text-purple-400" />
                                </div>
                                <p className="text-gray-300 mb-6">
                                    Practice coding problems and system design questions with real-time feedback
                                </p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span> Data Structures & Algorithms
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span> System Design Questions
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span> Code Review & Optimization
                                    </li>
                                </ul>
                                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
                                    Start Technical Interview
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 p-8 rounded-xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white">Behavioral Interview</h3>
                                    <Clock className="w-6 h-6 text-blue-400" />
                                </div>
                                <p className="text-gray-300 mb-6">
                                    Master behavioral questions and improve your communication skills
                                </p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span> Leadership & Teamwork
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span> Problem-Solving Scenarios
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span> Communication Assessment
                                    </li>
                                </ul>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
                                    Start Behavioral Interview
                                </button>
                            </div>
                        </div>

                       
                        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
                            <h3 className="text-2xl font-bold text-white mb-6">Recent Interviews</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <Video className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold">Technical Interview #{item}</h4>
                                                <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-green-400 font-semibold">85%</p>
                                                <p className="text-gray-400 text-sm">Score</p>
                                            </div>
                                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all">
                                                View Feedback
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FeatureLock>
            </div>
        </div>
    );
};

export default MockInterview;
