import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Search,
  ChevronDown,
  ChevronRight,
  Code2,
  BookOpen,
  Users,
  Settings,
  Bug,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  
  const [email, setEmail] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      setEmailSubmitted(true);
      setTimeout(() => setEmailSubmitted(false), 3000);
      setEmail('');
    }
  };


  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber && phoneMessage) {
      setMessageSubmitted(true);
      setTimeout(() => setMessageSubmitted(false), 3000);
      setPhoneNumber('');
      setPhoneMessage('');
    }
  };

 
  const handleLiveChat = () => {
    if (isAuthenticated) {
      navigate('/discuss');
    } else {
      navigate('/login');
    }
  };

  const faqs = [
    {
      id: 1,
      question: "How do I get started with coding problems?",
      answer: "Simply sign up for an account, browse our problem list, and start solving! Each problem comes with detailed descriptions, examples, and test cases to help you understand what's expected."
    },
    {
      id: 2,
      question: "How do contests work?",
      answer: "Contests are timed coding competitions where you solve problems within a specific timeframe. Your solutions are automatically judged, and you can see your ranking on the leaderboard in real-time."
    },
    {
      id: 3,
      question: "Can I discuss problems with other users?",
      answer: "Yes! Our discussion forum allows you to ask questions, share solutions, and learn from the community. You can access it from the Discuss section in the navigation."
    },
    {
      id: 4,
      question: "How is my progress tracked?",
      answer: "We track your solved problems, contest performance, and provide detailed analytics in your profile dashboard. You can see your coding activity, skill growth, and achievements."
    },
    {
      id: 5,
      question: "What programming languages are supported?",
      answer: "We support multiple programming languages including Python, Java, C++, JavaScript, and more. You can choose your preferred language for each problem."
    },
    {
      id: 6,
      question: "How do I report a bug or issue?",
      answer: "You can report bugs through our support system. Click on 'Contact Support' below or use the bug report feature in your profile settings."
    }
  ];

  const supportCategories = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Coding Problems",
      description: "Get help with problem solving, test cases, and submissions",
      link: "/problems"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Learning Resources",
      description: "Access tutorials, editorials, and learning materials",
      link: "/discuss"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Connect with other developers and get peer support",
      link: "/discuss"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Account & Settings",
      description: "Manage your account, profile, and preferences",
      link: "/settings"
    }
  ];

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 24/7",
      action: "Start Chat",
      type: "chat"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24 hours",
      action: "Send Email",
      type: "email"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri, 9 AM - 6 PM EST",
      action: "Call Now",
      type: "phone"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
     
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Help & Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
     
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            How can we <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">help you</span>?
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Find answers to common questions, get support, and connect with our community.
          </p>
          
         
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
            />
          </div>
        </div>

       
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Get Help By Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                <p className="text-gray-300">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>

        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <span className="text-white font-semibold">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

    
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-blue-400 mb-4 flex justify-center">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">{method.title}</h3>
                <p className="text-gray-300 mb-3 text-center">{method.description}</p>
                <p className="text-sm text-gray-400 mb-4 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {method.availability}
                </p>
                
                {method.type === 'chat' && (
                  <button 
                    onClick={handleLiveChat}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    {method.action}
                  </button>
                )}
                
                {method.type === 'email' && (
                  <div>
                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                      >
                        {method.action}
                      </button>
                    </form>
                    {emailSubmitted && (
                      <p className="text-green-400 text-sm mt-2 text-center">Email submitted successfully!</p>
                    )}
                  </div>
                )}
                
                {method.type === 'phone' && (
                  <div>
                    <form onSubmit={handleMessageSubmit} className="space-y-3">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                        required
                      />
                      <textarea
                        value={phoneMessage}
                        onChange={(e) => setPhoneMessage(e.target.value)}
                        placeholder="Your message..."
                        rows="3"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none resize-none"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                      >
                        Submit Message
                      </button>
                    </form>
                    {messageSubmitted && (
                      <p className="text-green-400 text-sm mt-2 text-center">Message submitted successfully!</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

       
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our community and support team are here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/discuss"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Join Community</span>
              </Link>
              <button className="px-6 py-3 border-2 border-white/20 text-white rounded-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                <Bug className="w-5 h-5" />
                <span>Report Bug</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
