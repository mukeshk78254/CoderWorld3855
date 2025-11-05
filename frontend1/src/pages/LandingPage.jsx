import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import WelcomePopup from '../components/WelcomePopup';
import { 
  Code,
  Code2, 
  Trophy, 
  Users, 
  BookOpen, 
  HelpCircle, 
  MessageCircle,
  Star,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  CheckCircle,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Award,
  Clock,
  Play,
  Shield,
  Lightbulb,
  Rocket,
  Globe,
  Heart,
  Sparkles,
  Cpu,
  Network,
  Layers,
  User,
  MessageSquare,
  Crown,
  Maximize,
  Minimize
} from 'lucide-react';


gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const particlesRef = useRef(null);
  const circuitRef = useRef(null);
  const nebulaRef = useRef(null);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        toast.success('Fullscreen mode activated', {
          icon: '🖥️',
          duration: 2000,
        });
      }).catch((err) => {
        toast.error('Could not enter fullscreen mode', {
          duration: 2000,
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          toast.success('Exited fullscreen mode', {
            icon: '↩️',
            duration: 2000,
          });
        });
      }
    }
  };

  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

 
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('welcomeShown');
    if (!hasShownWelcome && !isAuthenticated) {
      setTimeout(() => {
        toast.success('Welcome to CoderWorld! Start your coding journey with us today.', {
          duration: 5000,
          icon: '🚀',
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #3b82f6',
          },
        });
        sessionStorage.setItem('welcomeShown', 'true');
      }, 1000);
    }
  }, [isAuthenticated]);

 
  const handleLiveChat = () => {
    if (isAuthenticated) {
      navigate('/discuss');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!gsap) return;
    
    try {
     
      const tl = gsap.timeline();
      
      tl.fromTo('.hero-title', 
        { y: 100, opacity: 0, scale: 0.8, rotationX: 45 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.5, ease: 'power3.out' }
      )
      .fromTo('.hero-subtitle', 
        { y: 50, opacity: 0, rotationY: 20 },
        { y: 0, opacity: 1, rotationY: 0, duration: 1, ease: 'power3.out' }, '-=1'
      )
      .fromTo('.hero-buttons', 
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5'
      );

     
      gsap.to('.circuit-line', {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'power2.inOut',
        stagger: 0.2,
        repeat: -1,
        yoyo: true
      });

      
      gsap.to('.floating-node', {
        y: -40,
        x: 20,
        rotation: 360,
        scale: 1.2,
        duration: 6,
        ease: 'power2.inOut',
        stagger: 0.3,
        repeat: -1,
        yoyo: true
      });

     
      gsap.to('.nebula-cloud', {
        scale: 1.3,
        rotation: 180,
        duration: 15,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      });

     
      gsap.to('.data-stream', {
        y: -100,
        opacity: 0,
        duration: 2,
        ease: 'power2.in',
        stagger: 0.1,
        repeat: -1,
        repeatDelay: 0.5
      });

     
      gsap.fromTo('.feature-card',
        { y: 100, opacity: 0, scale: 0.8, rotationY: 30 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

     
      gsap.fromTo('.stat-item',
        { scale: 0, opacity: 0, rotation: 180 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.3)',
          scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

     
      gsap.to('.glow-pulse', {
        opacity: 0.3,
        scale: 1.1,
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      });
    } catch (error) {

    }
  }, []);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Interactive Problem Sets",
      description: "Sharpen your skills with a vast library of coding challenges from easy to expert level. Master algorithms and data structures.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Guided Learning Paths",
      description: "Follow structured courses on data structures, algorithms, and popular programming languages. Learn systematically.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Live Contests",
      description: "Test your skills in weekly coding competitions and see how you rank against other developers worldwide.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Community Support",
      description: "Connect with a global community of developers, ask questions, and share solutions. Get help when you need it.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Interview Preparation",
      description: "Practice with real interview questions from top tech companies and get ready for your next role.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and personalized recommendations for continuous growth.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { number: "75K+", label: "Active Coders", icon: <Users className="w-6 h-6" />, color: "text-cyan-400" },
    { number: "2.5K+", label: "Problems", icon: <Code2 className="w-6 h-6" />, color: "text-emerald-400" },
    { number: "5M+", label: "Solutions", icon: <CheckCircle className="w-6 h-6" />, color: "text-purple-400" },
    { number: "98%", label: "Success Rate", icon: <Award className="w-6 h-6" />, color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1320] via-[#0b1f3a] to-[#0e2a52] relative overflow-hidden">
     
      <WelcomePopup />
      
     
      <div className="fixed inset-0 pointer-events-none">
      
        <svg ref={circuitRef} className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          
          
          <path className="circuit-line" d="M100,100 L300,100 L300,200 L500,200 L500,100 L700,100" 
                stroke="url(#circuitGradient)" strokeWidth="2" fill="none" strokeDasharray="10,5" strokeDashoffset="15"/>
          <path className="circuit-line" d="M200,300 L400,300 L400,400 L600,400 L600,300 L800,300" 
                stroke="url(#circuitGradient)" strokeWidth="2" fill="none" strokeDasharray="10,5" strokeDashoffset="15"/>
          <path className="circuit-line" d="M50,500 L250,500 L250,600 L450,600 L450,500 L650,500" 
                stroke="url(#circuitGradient)" strokeWidth="2" fill="none" strokeDasharray="10,5" strokeDashoffset="15"/>
          
         
          <circle className="floating-node" cx="100" cy="100" r="8" fill="#06b6d4" opacity="0.8"/>
          <circle className="floating-node" cx="300" cy="200" r="6" fill="#8b5cf6" opacity="0.8"/>
          <circle className="floating-node" cx="500" cy="100" r="10" fill="#ec4899" opacity="0.8"/>
          <circle className="floating-node" cx="200" cy="300" r="7" fill="#10b981" opacity="0.8"/>
          <circle className="floating-node" cx="400" cy="400" r="9" fill="#f59e0b" opacity="0.8"/>
          <circle className="floating-node" cx="600" cy="300" r="5" fill="#ef4444" opacity="0.8"/>
        </svg>

        
        <div ref={nebulaRef} className="absolute inset-0">
          <div className="nebula-cloud absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="nebula-cloud absolute top-40 right-32 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="nebula-cloud absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
          <div className="nebula-cloud absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl"></div>
        </div>

        
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="data-stream absolute w-1 h-20 bg-gradient-to-t from-cyan-400 to-transparent opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

       
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

     
      <nav className="relative z-10 bg-black/30 backdrop-blur-md border-b border-cyan-500/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Logo showText withButtonWrapper onClick={() => navigate('/')} />
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/help" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Help Center</Link>
              <Link to="/problems" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Problems</Link>
              <button onClick={handleLiveChat} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Live Chat</button>
              <Link 
                to="/premium" 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 text-white rounded-lg hover:from-yellow-600 hover:via-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 font-bold shadow-lg shadow-purple-500/50 animate-pulse"
              >
                <Crown className="w-5 h-5" />
                <span>Go Premium</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium glow-pulse"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

    
      <section ref={heroRef} className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 glow-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-sm font-medium text-gray-300">Join 75,000+ developers worldwide</span>
          </div>
          
         
          <div className="flex items-center justify-center mb-8">
            <Logo showText={true} className="justify-center" iconSizeClass="w-12 h-12" innerImgSizeClass="w-12 h-12" textSizeClass="text-3xl md:text-4xl" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <motion.span
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0
              }}
              className="text-lg md:text-xl font-semibold text-cyan-400"
            >
              Code
            </motion.span>
            <span className="text-lg md:text-xl text-gray-400">•</span>
            <motion.span
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              className="text-lg md:text-xl font-semibold text-purple-400"
            >
              Learn
            </motion.span>
            <span className="text-lg md:text-xl text-gray-400">•</span>
            <motion.span
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="text-lg md:text-xl font-semibold text-pink-400"
            >
              Solve
            </motion.span>
          </motion.div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Master
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent"> Coding</span>
            <br />
            <span className="text-5xl md:text-6xl">Like a Pro</span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your coding skills with our AI-powered platform. Practice algorithms, 
            compete globally, and connect with the world's best developers.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/problems"
              className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-2xl text-xl font-bold hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl glow-pulse"
            >
              <Code2 className="w-7 h-7" />
              <span>Start Coding Now</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 hover:border-cyan-400 transition-all flex items-center justify-center space-x-3 shadow-xl"
            >
              <User className="w-6 h-6" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

     
      <section ref={statsRef} className="stats-section py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="features-section py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Developers Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">CodeWorld</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of coding education with cutting-edge technology and global community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card bg-white/5 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 border border-white/10 hover:border-cyan-400/50">
                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 glow-pulse`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Coding Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are already mastering algorithms, 
            winning contests, and landing dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/problems"
              className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-2xl text-xl font-bold hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl glow-pulse"
            >
              <Code2 className="w-6 h-6" />
              <span>Start Coding Now</span>
              <Rocket className="w-6 h-6" />
            </Link>
            <Link
              to="/signup"
              className="px-12 py-5 border-2 border-white/30 text-white rounded-2xl text-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-3"
            >
              <span>Create Account</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

     
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 items-start">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">CodeWorld</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The world's most advanced coding platform, helping developers 
                master algorithms and land their dream jobs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/problems" className="text-gray-400 hover:text-cyan-400 transition-colors">Problems</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Contests</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Discuss</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">Help</h3>
              <ul className="space-y-3">
                <li><Link to="/help" className="text-gray-400 hover:text-cyan-400 transition-colors">Help Center</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Report Problem</Link></li>
                <li><Link to="/discuss" className="text-gray-400 hover:text-cyan-400 transition-colors">Community</Link></li>
                <li><button onClick={handleLiveChat} className="text-gray-400 hover:text-cyan-400 transition-colors">Live Chat</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/help" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Report Problem</Link></li>
                <li><Link to="/discuss" className="text-gray-400 hover:text-cyan-400 transition-colors">Community</Link></li>
                <li><button onClick={handleLiveChat} className="text-gray-400 hover:text-cyan-400 transition-colors">Live Chat</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">Account</h3>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-cyan-400 transition-colors">Sign Up</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors">Profile</Link></li>
                <li><Link to="/settings" className="text-gray-400 hover:text-cyan-400 transition-colors">Settings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 text-lg">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund" className="text-gray-400 hover:text-cyan-400 transition-colors">Refund Policy</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
         
          <div className="mt-12 mb-8 flex justify-center">
            <motion.button
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isFullscreen ? (
                  <>
                    <Minimize size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    Exit Fullscreen Mode
                  </>
                ) : (
                  <>
                    <Maximize size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    Enter Fullscreen Mode
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} CodeWorld. All rights reserved. Built with ❤️ for developers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
