import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkAuth } from '../authSlice';

const OAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying login...');

  useEffect(() => {
    const error = searchParams.get('error');
    const token = searchParams.get('token');
    
    if (error) {
      setStatus(`Authentication error: ${error}`);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // If token is in URL, store it and verify
    if (token) {
      localStorage.setItem('token', token);
      setStatus('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

   
    const verifyAuth = async () => {
      try {
    
        const resultAction = await dispatch(checkAuth()).unwrap();
        if (resultAction) {
         
          navigate('/');
        } else {
          
          setStatus('Authentication failed');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('OAuth verification error:', error);
        setStatus('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    verifyAuth();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="mb-4">
          <div className="loading loading-spinner loading-lg text-indigo-500"></div>
        </div>
        <h2 className="text-xl font-medium text-white">{status}</h2>
        <p className="text-slate-400 mt-2">Please wait while we log you in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;