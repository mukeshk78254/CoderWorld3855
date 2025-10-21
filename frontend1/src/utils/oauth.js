
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5000/user/auth/google/callback';


const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id';
const FACEBOOK_REDIRECT_URI = import.meta.env.VITE_FACEBOOK_REDIRECT_URI || 'http://localhost:5000/user/auth/facebook/callback';


const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your-github-client-id';
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || 'http://localhost:5000/user/auth/github/callback';


export const initiateGoogleLogin = () => {

  window.location.href = 'http://localhost:5000/user/auth/google';
};

export const handleGoogleCallback = async (code) => {
  try {
    const response = await fetch('http://localhost:5000/user/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};


export const initiateFacebookLogin = () => {
 
  window.location.href = 'http://localhost:5000/user/auth/facebook';
};

export const handleFacebookCallback = async (code) => {
  try {
    const response = await fetch('http://localhost:5000/user/auth/facebook/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    throw error;
  }
};


export const initiateGitHubLogin = () => {
  
  window.location.href = 'http://localhost:5000/user/auth/github';
};

export const handleGitHubCallback = async (code) => {
  try {
    const response = await fetch('http://localhost:5000/user/auth/github/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    throw error;
  }
};


export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};


export const clearUrlParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};
