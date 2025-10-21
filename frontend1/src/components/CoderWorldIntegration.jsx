import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Globe, 
  Users, 
  Trophy, 
  BookOpen, 
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Star,
  TrendingUp
} from 'lucide-react';

const CoderWorldIntegration = () => {
  const [isHovered, setIsHovered] = useState(false);

  const coderWorldFeatures = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Community",
      description: "Connect with developers worldwide",
      stats: "50K+ Active Users"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Competitions",
      description: "Join international coding contests",
      stats: "100+ Contests Monthly"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Learning Paths",
      description: "Structured courses and tutorials",
      stats: "500+ Learning Modules"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Mentorship",
      description: "Get guidance from industry experts",
      stats: "1000+ Mentors"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
      
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Code2 className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">CoderWorld</h2>
              <p className="text-blue-300">Global Coding Platform</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join the world's largest coding community. Practice, compete, and grow with developers from around the globe.
          </p>
        </div>

       
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {coderWorldFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-blue-400 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
              <div className="text-blue-400 text-sm font-semibold">{feature.stats}</div>
            </div>
          ))}
        </div>

       
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">1M+</div>
              <div className="text-gray-300 text-sm">Problems Solved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-300 text-sm">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-gray-300 text-sm">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-300 text-sm">Support</div>
            </div>
          </div>
        </div>

      
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span>Join CoderWorld</span>
              <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </Link>
            <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl text-lg font-semibold hover:bg-white/10 transition-all flex items-center space-x-2">
              <ExternalLink className="w-5 h-5" />
              <span>Learn More</span>
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Growing Community</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Trusted by Developers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoderWorldIntegration;











