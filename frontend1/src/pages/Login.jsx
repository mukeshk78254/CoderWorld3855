
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from "../authSlice"; 
import { useEffect, useState, useRef } from 'react';
import SimpleCaptcha from '../components/SimpleCaptcha'; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin'; 
import { FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';
import OAuthButton from '../components/OAuthButton';
import { Eye, EyeOff } from 'lucide-react';


gsap.registerPlugin(ScrollTrigger, TextPlugin);

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth); // user is not used directly here
  const [captchaValid, setCaptchaValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const loginContainerRef = useRef(null);
  const contentLeftRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const mainFormRef = useRef(null);
  const socialLoginRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(loginSchema) });

  
  useEffect(() => {
    if (isAuthenticated) {
     
      const from = location.state?.from || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  
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

    
    masterTl.fromTo(loginContainerRef.current, { 
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

   
    masterTl.fromTo(socialLoginRef.current.children, {
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

   
    gsap.to(".feature-card, button, input", {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
      duration: 0.3,
      ease: "power1.inOut",
      paused: true, 
      reversed: true, 
      onHover: true 
    });

      document.querySelectorAll(".feature-card, button, input").forEach(el => {
        el.addEventListener('mouseenter', () => gsap.getTweensOf(el).find(t => t.vars.onHover).reverse());
        el.addEventListener('mouseleave', () => gsap.getTweensOf(el).find(t => t.vars.onHover).play());
      });
    } catch (error) {
      console.log('GSAP animation error in Login:', error);
    }
  }, []); 

  const onSubmit = async (data) => {
    if (!captchaValid) {
      alert('Please solve the captcha correctly to log in.');
      return;
    }
    
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
       
      } else {
        alert(`Login failed: ${resultAction.payload?.message || 'Please check your credentials.'}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An unexpected error occurred during login. Please try again.');
    }
  };

  const handleCaptchaChange = (isValid) => {
    setCaptchaValid(isValid);
  };

  return (
    <div ref={loginContainerRef} className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white font-sans antialiased">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
      
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/6 right-1/6 w-[450px] h-[450px] bg-pink-600/15 rounded-full mix-blend-screen blur-3xl nebula-orb" style={{ animationDelay: '1s' }}></div>
        
        
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

      
        <div ref={contentLeftRef} className="flex-1 lg:pr-8 text-center lg:text-left py-2 sm:py-4 lg:py-0 overflow-y-auto">
          <div className="max-w-xl mx-auto lg:mx-0 px-4 sm:px-0">
            <h1 ref={titleRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 sm:mb-3 leading-tight">
              Unleash Your Potential at <span className="coderworld-title-span text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">CoderWorld</span>
            </h1>
            <p ref={taglineRef} className="text-xs sm:text-sm lg:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed font-light">
              Beyond tutorials. Build, innovate, and dominate the digital frontier.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              
              <div className="feature-card bg-gradient-to-br from-indigo-800/20 to-purple-800/20 border border-indigo-700/40 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl mb-2 text-purple-400">💡</div>
                <h3 className="text-base sm:text-lg font-bold mb-1">AI-Driven Project Journeys</h3>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Seamlessly progress through real-world projects, guided by intelligent feedback and adaptive challenges that mimic industry demands.
                </p>
              </div>

              
              <div className="feature-card bg-gradient-to-br from-teal-800/20 to-blue-800/20 border border-teal-700/40 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-3 text-blue-400">🌐</div>
                <h3 className="text-xl font-bold mb-2">Global Dev-Connect & Mentorship</h3>
                <p className="text-gray-300 text-sm">
                  Connect with a vibrant global community, find expert mentors, and collaborate on cutting-edge open-source initiatives.
                </p>
              </div>

             
              <div className="feature-card bg-gradient-to-br from-orange-800/20 to-red-800/20 border border-orange-700/40 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-3 text-orange-400">⚡</div>
                <h3 className="text-xl font-bold mb-2">Dynamic Code Ecosystem</h3>
                <p className="text-gray-300 text-sm">
                  Access live dev environments, instant code reviews, and integrated deployment tools – all in your browser.
                </p>
              </div>

             
              <div className="feature-card bg-gradient-to-br from-pink-800/20 to-fuchsia-800/20 border border-pink-700/40 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-3 text-pink-400">🏆</div>
                <h3 className="text-xl font-bold mb-2">Career Launchpad</h3>
                <p className="text-gray-300 text-sm">
                  Showcase your verifiable portfolio, get matched with top tech companies, and accelerate your career trajectory.
                </p>
              </div>
            </div>

           
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-3 border border-purple-400/20">
                <div className="text-2xl font-bold text-purple-400 mb-1">2.5M+</div>
                <div className="text-gray-400 text-xs">Active Developers</div>
              </div>
              <div className="text-center bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-lg p-3 border border-cyan-400/20">
                <div className="text-2xl font-bold text-cyan-400 mb-1">50K+</div>
                <div className="text-gray-400 text-xs">Projects Built</div>
              </div>
              <div className="text-center bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg p-3 border border-pink-400/20">
                <div className="text-2xl font-bold text-pink-400 mb-1">95%</div>
                <div className="text-gray-400 text-xs">Success Rate</div>
              </div>
            </div>

           
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4 group hover:border-purple-400/40 transition-all duration-500 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <span className="text-xl mr-2">💻</span> 
                  Live Code Preview
                </h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-gray-900/80 rounded-lg p-3 overflow-x-auto border border-gray-700/50">
                <div className="flex items-center mb-2">
                  <span className="text-gray-400 text-xs font-mono">JavaScript</span>
                  <div className="ml-auto flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs ml-1">Running</span>
                  </div>
                </div>
                <pre className="text-green-400 text-xs font-mono leading-relaxed">
{`// Real-time collaboration
function solveProblem() {
  const solution = "Hello CoderWorld!";
  console.log(solution);
  return "Success!";
}

// Start coding now
solveProblem();`}
                </pre>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <p className="text-gray-300 text-xs">
                  Join <span className="text-purple-400 font-semibold">live coding sessions</span> with experts
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1"></div>
                    Live
                  </span>
                  <span className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1"></div>
                    Real-time
                  </span>
                </div>
              </div>
            </div>

           
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm italic mb-2">
                    "CoderWorld transformed my career. From zero to senior developer in 8 months!"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 text-xs font-semibold">Sarah Chen</span>
                    <div className="flex text-yellow-400 text-xs">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Ready to redefine your coding journey? Join <span className="text-cyan-400 font-semibold">2.5M+ visionary developers</span>.
            </p>
          </div>
        </div>

       
        <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 relative z-10 flex-shrink-0 mx-4 sm:mx-0">
          <div className="text-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full mx-auto flex items-center justify-center mb-2 sm:mb-3 shadow-lg transform rotate-[-10deg] animate-spin-slow">
              <span className="text-xl sm:text-2xl">🔑</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-1">
              Access Your World
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">Continue your adventure in CoderWorld.</p>
          </div>

          
            <div ref={socialLoginRef} className="mb-4">
              <div className="text-center mb-3">
                <p className="text-gray-300 text-xs sm:text-sm">Or continue with</p>
              </div>
              
            
             <div className="flex justify-center space-x-4">
               <OAuthButton 
                 provider="google" 
                 onSuccess={(data) => {
                   console.log('Google login success:', data);
                   
                 }}
                 onError={(error) => {
                   console.error('Google login error:', error);
                   
                 }}
               />
               
               <OAuthButton 
                 provider="facebook" 
                 onSuccess={(data) => {
                   console.log('Facebook login success:', data);
                   
                 }}
                 onError={(error) => {
                   console.error('Facebook login error:', error);
                  
                 }}
               />
               
               <OAuthButton 
                 provider="github" 
                 onSuccess={(data) => {
                   console.log('GitHub login success:', data);
                   
                 }}
                 onError={(error) => {
                   console.error('GitHub login error:', error);
                   
                 }}
               />
             </div>
          </div>

          <div className="relative flex py-3 sm:py-4 items-center mb-4 sm:mb-5">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-3 sm:mx-4 text-gray-500 text-xs sm:text-sm">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
          </div>

       
          <form ref={mainFormRef} onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-white/90 text-xs sm:text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Your secure email"
                className={`w-full px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                  errors.emailId ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-700 focus:ring-purple-500/30 focus:border-purple-500'
                }`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <span className="mr-1">❗</span> {errors.emailId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white/90 text-xs sm:text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-3 sm:px-5 py-2 sm:py-3 pr-12 rounded-lg sm:rounded-xl border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                    errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-700 focus:ring-purple-500/30 focus:border-purple-500'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

            
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-700/30 relative overflow-hidden group text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span className="text-xl mr-3">🚀</span>
                    Login to CoderWorld
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

         
          {error && (
            <div className="mt-3 p-2 sm:p-3 bg-red-900/30 border border-red-700/50 rounded-lg backdrop-blur-sm">
              <p className="text-red-300 text-xs sm:text-sm flex items-center justify-center">
                <span className="font-bold mr-1 flex-shrink-0">⚠️ Error:</span> 
                <span className="truncate">{error?.message || 'Failed to log in. Please try again.'}</span>
              </p>
            </div>
          )}

         
          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              Don't have an account? <br className="lg:hidden"/>
              <Link 
                to="/signup" 
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold transition-all duration-300 hover:scale-105 group text-sm"
              >
                <span className="mr-2 group-hover:rotate-6 transition-transform duration-300">✨</span>
                Join CoderWorld Today!
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;