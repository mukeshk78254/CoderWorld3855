import React from 'react';
import { FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';
import { initiateGoogleLogin, initiateFacebookLogin, initiateGitHubLogin } from '../utils/oauth';

const OAuthButton = ({ provider, onSuccess, onError, disabled = false, className = "" }) => {
  const handleClick = async () => {
    try {
      if (provider === 'google') {
        initiateGoogleLogin();
      } else if (provider === 'facebook') {
        initiateFacebookLogin();
      } else if (provider === 'github') {
        initiateGitHubLogin();
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      onError && onError(error);
    }
  };

  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          icon: <FaGoogle className="text-white text-xl" />,
          text: 'Continue with Google',
          bgColor: 'bg-white/10 hover:bg-white/20',
          hoverColor: 'hover:shadow-red-500/25',
          borderColor: 'border-red-500/30'
        };
      case 'facebook':
        return {
          icon: <FaFacebookF className="text-white text-xl" />,
          text: 'Continue with Facebook',
          bgColor: 'bg-white/10 hover:bg-white/20',
          hoverColor: 'hover:shadow-blue-500/25',
          borderColor: 'border-blue-500/30'
        };
      case 'github':
        return {
          icon: <FaGithub className="text-white text-xl" />,
          text: 'Continue with GitHub',
          bgColor: 'bg-white/10 hover:bg-white/20',
          hoverColor: 'hover:shadow-gray-500/25',
          borderColor: 'border-gray-500/30'
        };
      default:
        return {
          icon: <FaGoogle className="text-white text-xl" />,
          text: 'Continue with Google',
          bgColor: 'bg-white/10 hover:bg-white/20',
          hoverColor: 'hover:shadow-red-500/25',
          borderColor: 'border-red-500/30'
        };
    }
  };

  const config = getProviderConfig();

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex items-center justify-center w-12 h-12 rounded-xl 
        ${config.bgColor} 
        border border-white/20 
        transition-all duration-300 
        transform hover:scale-110 
        focus:outline-none focus:ring-2 focus:ring-white/30 
        disabled:opacity-50 disabled:cursor-not-allowed 
        shadow-md ${config.hoverColor}
        ${className}
      `}
      title={config.text}
    >
      <div className="flex items-center justify-center">
        {config.icon}
      </div>
    </button>
  );
};

export default OAuthButton;

