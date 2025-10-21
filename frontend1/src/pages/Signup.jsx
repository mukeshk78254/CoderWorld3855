import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp } from '../authSlice';
import { registerUser, clearError } from '../authSlice';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';
import OAuthButton from '../components/OAuthButton';
import SimpleCaptcha from '../components/SimpleCaptcha';


gsap.registerPlugin(ScrollTrigger, TextPlugin);

const signupSchema = z.object({
  firstname: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  emailId: z.string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(100, "Email must be less than 100 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const signupContainerRef = useRef(null);
  const contentLeftRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const mainFormRef = useRef(null);
  const socialSignupRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    trigger
  } = useForm({ resolver: zodResolver(signupSchema), mode: 'onChange' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

 
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

 
  useEffect(() => {
    if (!gsap) return;
    
    try {
      
      const masterTl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

    
    gsap.to(".star", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      rotation: "random(0, 360)",
      duration: "random(15, 25)",
      ease: "none",
      repeat: -1,
      yoyo: true
    });
    gsap.to(".nebula-orb", {
      scale: 1.2,
      opacity: 0.6,
      rotation: "+=360",
      duration: 20,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });

 
    masterTl.fromTo(contentLeftRef.current, { 
      opacity: 0, 
      x: -150, 
      rotationY: -45, 
      transformOrigin: "left center" 
    }, { 
      opacity: 1, 
      x: 0, 
      rotationY: 0, 
      duration: 1.5, 
      ease: "power3.out" 
    }, 0.2);

  
    if (titleRef.current) {
      const originalText = titleRef.current.textContent;
      titleRef.current.textContent = '';
      
      masterTl.fromTo(titleRef.current, { 
        y: -30, 
        opacity: 0, 
        scale: 0.8 
      }, { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)" 
      }, "<0.3")
      .to(titleRef.current, {
        duration: 1.5,
        text: originalText,
        ease: "none"
      }, "<0.2")
      .to(".coderworld-title-span", {
        backgroundPositionX: "100%",
        duration: 3,
        ease: "none",
        repeat: -1,
        yoyo: true
      }, "<");
    }

    
    masterTl.fromTo(taglineRef.current, { 
      opacity: 0, 
      y: 20 
    }, { 
      opacity: 1, 
      y: 0, 
      duration: 0.7 
    }, "<0.3");

    
    masterTl.fromTo(".feature-card", { 
      opacity: 0, 
      y: 50, 
      rotationX: -90, 
      transformOrigin: "top center" 
    }, { 
      opacity: 1, 
      y: 0, 
      rotationX: 0, 
      stagger: 0.15, 
      duration: 1, 
      ease: "back.out(1.2)" 
    }, "<0.4");

    masterTl.fromTo(signupContainerRef.current, { 
      opacity: 0, 
      scale: 0.8, 
      x: 100, 
      rotationY: 30, 
      transformOrigin: "right center" 
    }, { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      rotationY: 0, 
      duration: 1.5, 
      ease: "power3.out" 
    }, "<0.2");

    
    masterTl.fromTo(mainFormRef.current.children, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out"
    }, "<0.5");

    
    masterTl.fromTo(socialSignupRef.current.children, {
      opacity: 0,
      y: 20,
      scale: 0.8
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "<0.3");
    } catch (error) {
      console.log('GSAP animation error in Signup:', error);
    }
  }, []);

  const onSubmit = async (data) => {
   
    if (!captchaValid) {
      setError('captcha', { type: 'manual', message: 'Please solve the captcha correctly' });
      return;
    }
    
   
    const validation = signupSchema.safeParse(data);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setError(firstError.path[0], { type: 'manual', message: firstError.message });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
     
      localStorage.setItem('otpEmail', data.emailId);
      
      
      const resultAction = await dispatch(sendOtp(data));
      if (sendOtp.fulfilled.match(resultAction)) {
        
        navigate('/verify-otp', { state: { email: data.emailId } });
      } else {
       
        const errorMessage = resultAction.payload?.message || 'Please check your information.';
        
        if (errorMessage.includes('already exists')) {
          setError('emailId', { type: 'manual', message: 'An account with this email already exists. Please use a different email or try logging in.' });
        } else {
          alert(`Send OTP failed: ${errorMessage}`);
        }
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      alert('An unexpected error occurred while sending OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaChange = (isValid) => {
    setCaptchaValid(isValid);
    if (isValid) {
      clearErrors('captcha');
    }
  };

  return (
    <div ref={signupContainerRef} className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-950 via-green-950 to-gray-950 text-white font-sans antialiased">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
       
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/6 right-1/6 w-[450px] h-[450px] bg-lime-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb" style={{ animationDelay: '1s' }}></div>
        
       
        {[...Array(150)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`absolute bg-white rounded-full star ${
              i % 5 === 0 ? 'w-1 h-1' : i % 3 === 0 ? 'w-0.5 h-0.5' : 'w-0.5 h-0.5'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: `${0.3 + Math.random() * 0.7}`,
              filter: `blur(${Math.random() * 0.5}px)`
            }}
          />
        ))}
      </div>

    
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center justify-between overflow-hidden">

        <div ref={contentLeftRef} className="flex-1 lg:pr-12 text-center lg:text-left py-4 sm:py-6 lg:py-0 overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0 px-4 sm:px-0">
            <h1 ref={titleRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight">
              Join <span className="coderworld-title-span text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">CoderWorld</span>
            </h1>
            <p ref={taglineRef} className="text-sm sm:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed font-light">
              Start your coding journey and unlock your potential.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
             
              <div className="feature-card bg-gradient-to-br from-green-800/20 to-emerald-800/20 border border-green-700/40 rounded-xl p-3 sm:p-4 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-3 text-green-400">🎓</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Beginner Friendly</h3>
                <p className="text-gray-300 text-sm">
                  Start from zero with our comprehensive beginner courses and step-by-step guidance.
                </p>
              </div>

             
              <div className="feature-card bg-gradient-to-br from-emerald-800/20 to-teal-800/20 border border-emerald-700/40 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-3 text-emerald-400">🚀</div>
                <h3 className="text-xl font-bold mb-2">Fast Track Learning</h3>
                <p className="text-gray-300 text-sm">
                  Accelerate your learning with our proven curriculum and expert mentorship program.
                </p>
              </div>

             
              <div className="feature-card bg-gradient-to-br from-teal-800/20 to-cyan-800/20 border border-teal-700/40 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-3 text-teal-400">💼</div>
                <h3 className="text-xl font-bold mb-2">Career Ready</h3>
                <p className="text-gray-300 text-sm">
                  Build a professional portfolio with real-world projects and get job placement assistance.
                </p>
              </div>

             
              <div className="feature-card bg-gradient-to-br from-lime-800/20 to-green-800/20 border border-lime-700/40 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-3 text-lime-400">🌟</div>
                <h3 className="text-xl font-bold mb-2">Community Support</h3>
                <p className="text-gray-300 text-sm">
                  Join our vibrant community of learners and get help from mentors and peers.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-8">
              Ready to start coding? Join <span className="text-green-400 font-semibold">2.5M+ developers</span>.
            </p>
          </div>
        </div>

    
        <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 relative z-10 flex-shrink-0 mx-4 sm:mx-0 max-h-full overflow-y-auto">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4 shadow-lg transform rotate-[-10deg] animate-spin-slow">
              <span className="text-2xl sm:text-3xl">🌱</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
              Create Account
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">Start your coding journey today.</p>
          </div>

         
            <div ref={socialSignupRef} className="mb-8">
              <div className="text-center mb-4">
                <p className="text-gray-300 text-sm">Or create account with</p>
              </div>
              
            
            <div className="flex justify-center space-x-4">
              <OAuthButton 
                provider="google" 
                onSuccess={(data) => {
                  console.log('Google signup success:', data);
                  
                }}
                onError={(error) => {
                  console.error('Google signup error:', error);
                  
                }}
              />
              
              <OAuthButton 
                provider="facebook" 
                onSuccess={(data) => {
                  console.log('Facebook signup success:', data);
                  
                }}
                onError={(error) => {
                  console.error('Facebook signup error:', error);
                
                }}
              />
              
              <OAuthButton 
                provider="github" 
                onSuccess={(data) => {
                  console.log('GitHub signup success:', data);
                 
                }}
                onError={(error) => {
                  console.error('GitHub signup error:', error);
                  
                }}
              />
            </div>
            </div>

          <div className="relative flex py-5 items-center mb-8">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
          </div>

         
          <form ref={mainFormRef} onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-white/90 text-xs sm:text-sm font-semibold mb-2">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                className={`w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                  errors.firstname ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-700 focus:ring-green-500/30 focus:border-green-500'
                }`}
                {...register('firstname', {
                  onChange: () => trigger('firstname')
                })}
              />
              {errors.firstname && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span> {errors.firstname.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Your email address"
                className={`w-full px-5 py-3 rounded-xl border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.emailId ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-700 focus:ring-green-500/30 focus:border-green-500'
                }`}
                {...register('emailId', {
                  onChange: () => trigger('emailId')
                })}
              />
              {errors.emailId && (
                <div className="mt-1">
                  <p className="text-red-400 text-xs flex items-center">
                    <span className="mr-1">❗</span> {errors.emailId.message}
                  </p>
                  {errors.emailId.message.includes('already exists') && (
                    <Link 
                      to="/login" 
                      className="text-blue-400 hover:text-blue-300 text-xs mt-1 inline-block transition-colors duration-300"
                    >
                      → Login instead
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className={`w-full px-5 py-3 pr-12 rounded-xl border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-700 focus:ring-green-500/30 focus:border-green-500'
                  }`}
                  {...register('password', {
                    onChange: () => trigger('password')
                  })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white/70 hover:text-green-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span> {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <SimpleCaptcha onCaptchaChange={handleCaptchaChange} />
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-700/30 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading || isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    {isSubmitting ? 'Sending OTP...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    <span className="text-xl mr-3">🌱</span>
                    Start Your Journey
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          
          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg backdrop-blur-sm text-center">
              <p className="text-red-300 text-sm">
                <span className="font-bold mr-1">Error:</span> {error?.message || 'Failed to create account. Please try again.'}
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-3">
              Already have an account? <br className="lg:hidden"/>
              <Link 
                to="/login" 
                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:scale-105 group text-base"
              >
                <span className="mr-2 group-hover:rotate-6 transition-transform duration-300">🚀</span>
                Sign In Here
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;