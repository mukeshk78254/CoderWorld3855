import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtpAndRegister, resendOtp } from '../authSlice';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { FaEnvelope, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';


gsap.registerPlugin(TextPlugin);

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
 
  const email = location.state?.email || localStorage.getItem('otpEmail') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [canResend, setCanResend] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const otpContainerRef = useRef(null);
  const emailDisplayRef = useRef(null);
  const timerRef = useRef(null);
  const resendRef = useRef(null);
  const backgroundRef = useRef(null);
  const otpPageContentRef = useRef(null);
  
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
 
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);
  
 
  useEffect(() => {
    const storedDevOtp = localStorage.getItem('devOtp');
    if (storedDevOtp) {
      setDevOtp(storedDevOtp);
     
      const otpArray = storedDevOtp.split('');
      setOtp(otpArray);
    }
  }, []);
  

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);
  
  
  useEffect(() => {
    createBackgroundCircles();
  }, []);
  
  const createBackgroundCircles = () => {
    const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
    
   
    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      element.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 3}px;
        height: ${Math.random() * 6 + 3}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.6 + 0.3};
        pointer-events: none;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
      `;
      
      backgroundRef.current.appendChild(element);
      
  
      gsap.set(element, { scale: 0, rotation: 0 });
      gsap.to(element, {
        scale: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: Math.random() * 3
      });
      
      gsap.to(element, {
        y: Math.random() * 100 - 50,
        x: Math.random() * 100 - 50,
        rotation: 360,
        duration: Math.random() * 15 + 15,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 2
      });
    }
    
    
    for (let i = 0; i < 8; i++) {
      const line = document.createElement('div');
      line.className = 'animated-line';
      line.style.cssText = `
        position: absolute;
        width: ${Math.random() * 200 + 100}px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0.3;
        pointer-events: none;
        transform: rotate(${Math.random() * 360}deg);
      `;
      
      backgroundRef.current.appendChild(line);
      
      gsap.to(line, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        rotation: Math.random() * 360,
        duration: Math.random() * 20 + 20,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 3
      });
    }
    
   
    for (let i = 0; i < 5; i++) {
      const circle = document.createElement('div');
      circle.className = 'pulsing-circle';
      circle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 100 + 50}px;
        height: ${Math.random() * 100 + 50}px;
        border: 2px solid #3b82f6;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0.1;
        pointer-events: none;
      `;
      
      backgroundRef.current.appendChild(circle);
      
      gsap.to(circle, {
        scale: 1.5,
        opacity: 0.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: Math.random() * 2
      });
    }
  };
  
  
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; 
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
 
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
 
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  const handleVerifyOtp = async (otpCode) => {
    if (!otpCode || otpCode.length !== 6) return;
    
    setIsVerifying(true);
    
    try {
      await dispatch(verifyOtpAndRegister({ emailId: email, otp: otpCode }));
      
      
      localStorage.removeItem('devOtp');
      setTimeout(() => {
        const from = location.state?.from || '/home';

        navigate(from, { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      
      gsap.to(otpContainerRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendOtp = async () => {
    setCanResend(false);
    setTimeLeft(600); 
    setOtp(['', '', '', '', '', '']);
    setDevOtp(null); 
    
    try {
      const resultAction = await dispatch(resendOtp({ emailId: email }));
      
      if (resendOtp.fulfilled.match(resultAction)) {
       
        gsap.fromTo(resendRef.current, 
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        
    
        if (resultAction.payload.developmentMode && resultAction.payload.otp) {
          setDevOtp(resultAction.payload.otp);
          
          const otpArray = resultAction.payload.otp.split('');
          setOtp(otpArray);
        }
      } else {
        console.error('Resend OTP failed:', resultAction.payload);
      }
      
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
    
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none" />
      
     
      <div ref={containerRef} className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative z-10">
        <div ref={otpPageContentRef} className="bg-white border-2 sm:border-4 border-blue-500 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md text-gray-900 mx-2">
        
          <button
            onClick={() => navigate('/signup')}
            className="absolute top-3 left-3 sm:top-6 sm:left-6 text-gray-700 hover:text-gray-900 flex items-center space-x-1 sm:space-x-2 font-bold text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          
          
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full mb-3 sm:mb-4">
              <FaShieldAlt className="text-xl sm:text-2xl text-white" />
            </div>
            
            <h1 ref={titleRef} className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              Verify Your Email
            </h1>
            
            <p ref={subtitleRef} className="text-gray-800 text-sm sm:text-base lg:text-lg font-bold px-2">
              We've sent a 6-digit code to your email address
            </p>
          </div>
          
        
          <div ref={emailDisplayRef} className="bg-blue-100 border-2 sm:border-4 border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <FaEnvelope className="text-blue-700 text-lg sm:text-xl" />
              <span className="text-gray-900 font-black text-sm sm:text-lg lg:text-xl break-all">{email}</span>
            </div>
          </div>
          
        
          {devOtp && (
            <div className="bg-yellow-100 border-2 sm:border-4 border-yellow-400 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-2xl">
              <div className="text-center">
                <p className="text-yellow-800 font-bold text-xs sm:text-sm mb-2">Development Mode</p>
                <p className="text-yellow-900 font-black text-sm sm:text-base lg:text-lg">Your OTP: <span className="text-lg sm:text-xl lg:text-2xl">{devOtp}</span></p>
                <p className="text-yellow-700 text-xs mt-1">This OTP is auto-filled for testing</p>
              </div>
            </div>
          )}
          
         
          <div ref={otpContainerRef} className="bg-blue-100 border-2 sm:border-4 border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 shadow-2xl">
            <div className="flex justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-center text-xl sm:text-2xl lg:text-3xl font-black rounded-lg border-2 sm:border-4 focus:outline-none ${
                    digit
                      ? 'border-green-600 bg-green-500 text-white'
                      : 'border-blue-400 bg-white text-gray-900 focus:border-blue-600 focus:bg-blue-50'
                  }`}
                  disabled={isVerifying}
                />
              ))}
            </div>
            
           
            {isVerifying && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm font-bold">Verifying...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-red-600">
                  <FaTimesCircle />
                  <span className="text-sm font-bold">{error}</span>
                </div>
                {error.includes('expired') && (
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 hover:text-blue-700 text-xs mt-2 inline-block transition-colors duration-300 font-bold"
                  >
                    → Try signing up again
                  </button>
                )}
              </div>
            )}
          </div>
          
          
          <div ref={timerRef} className="text-center mb-3 sm:mb-4">
            <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-black">
              Code expires in{' '}
              <span className="text-blue-600 font-mono font-black text-base sm:text-lg lg:text-xl">
                {formatTime(timeLeft)}
              </span>
            </p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              (Valid for 10 minutes)
            </p>
          </div>
          
         
          <div ref={resendRef} className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl w-full sm:w-auto"
              >
                🔄 Resend New Code
              </button>
            ) : (
              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-gray-900 text-sm sm:text-base lg:text-lg font-black">
                  Resend code in{' '}
                  <span className="text-blue-600 font-mono text-base sm:text-lg lg:text-xl">
                    {formatTime(timeLeft)}
                  </span>
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Previous OTP will be invalidated
                </p>
              </div>
            )}
          </div>
          
         
          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center space-x-1 sm:space-x-2 text-gray-900 hover:text-blue-600 font-black text-sm sm:text-base lg:text-lg"
            >
              <FaArrowLeft />
              <span>Back to Signup</span>
            </button>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default OTPVerification;
