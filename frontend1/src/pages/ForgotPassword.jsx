import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosClient from '../utils/axiosClient';
import { Mail, Lock, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const containerRef = useRef(null);
    
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    
    
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
           
            gsap.to('.floating-orb-1', {
                y: 30,
                x: 20,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to('.floating-orb-2', {
                y: -40,
                x: -30,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to('.floating-orb-3', {
                y: 25,
                x: -15,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

           
            gsap.from('.forgot-card', {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });

            gsap.from('.forgot-title', {
                opacity: 0,
                y: -30,
                duration: 0.8,
                delay: 0.3,
                ease: 'back.out(1.7)'
            });

        }, containerRef);

        return () => ctx.revert();
    }, [step]);

   
    const onSendOTP = async (data) => {
        setLoading(true);
        setMessage('');
        
        try {
            const response = await axiosClient.post('/user/send-reset-otp', {
                emailId: data.email
            });
            
            setEmail(data.email);
            setMessage(response.data.message || 'OTP sent to your email!');
            
           
            gsap.to('.forgot-card', {
                opacity: 0,
                x: -50,
                duration: 0.3,
                onComplete: () => {
                    setStep(2);
                    gsap.fromTo('.forgot-card', 
                        { opacity: 0, x: 50 },
                        { opacity: 1, x: 0, duration: 0.3 }
                    );
                }
            });
            
            reset();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    
    const onResetPassword = async (data) => {
        setLoading(true);
        setMessage('');
        
        if (data.newPassword !== data.confirmPassword) {
            setMessage('Passwords do not match!');
            setLoading(false);
            return;
        }
        
        try {
            
            const response = await axiosClient.post('/user/reset-password', {
                emailId: email,
                otp: data.otp,
                newPassword: data.newPassword
            });
            
            setMessage(response.data.message || 'Password reset successful!');
            
           
            gsap.to('.forgot-card', {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    setStep(3);
                    setTimeout(() => navigate('/login'), 2000);
                }
            });
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
     
        <div ref={containerRef} className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
            
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-orb-1 absolute top-20 left-20 w-96 h-96 bg-purple-600 opacity-20 rounded-full blur-3xl"></div>
                <div className="floating-orb-2 absolute bottom-20 right-20 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl"></div>
                <div className="floating-orb-3 absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600 opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="forgot-card relative z-10 w-full max-w-md">
              
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    
               
                    <div className="text-center mb-8">
                        <div className="forgot-title inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="forgot-title text-3xl font-bold text-white mb-2">
                            {step === 1 && 'Forgot Password?'}
                            {step === 2 && 'Reset Password'}
                            {step === 3 && 'Success!'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {step === 1 && 'Enter your email to receive a secure code'}
                            {step === 2 && 'Enter the code and your new password'}
                            {step === 3 && 'Your password has been reset successfully'}
                        </p>
                    </div>

                
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg border ${
                            message.includes('success') || message.includes('sent') 
                                ? 'bg-green-700 border-green-600 text-green-200' 
                                : 'bg-red-700 border-red-600 text-red-200'    
                        }`}>
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                   
                    {step === 1 && (
                        <form onSubmit={handleSubmit(onSendOTP)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        {...register('email', { 
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                       
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                              
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Code
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                   
                    {step === 2 && (
                        <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    OTP Code
                                </label>
                                <input
                                    type="text"
                                    {...register('otp', { 
                                        required: 'OTP is required',
                                        minLength: { value: 6, message: 'Code must be 6 digits' },
                                        maxLength: { value: 6, message: 'Code must be 6 digits' }
                                    })}
                                   
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                                {errors.otp && (
                                    <p className="mt-2 text-sm text-red-400">{errors.otp.message}</p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">Code sent to: {email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        {...register('newPassword', { 
                                            required: 'Password is required',
                                            minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                        })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="mt-2 text-sm text-red-400">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        {...register('confirmPassword', { 
                                            required: 'Please confirm your password',
                                            validate: value => value === watch('newPassword') || 'Passwords do not match'
                                        })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <CheckCircle className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}


                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">All Set!</h2>
                            <p className="text-gray-400 mb-6">Your password has been reset successfully.</p>
                            <p className="text-sm text-gray-500">Redirecting to login page...</p>
                        </div>
                    )}

                   
                    {step !== 3 && (
                        <div className="mt-6 text-center">
                            <Link 
                                to="/login" 
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
