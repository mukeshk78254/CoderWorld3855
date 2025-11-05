import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AllSubmissionsHistory from '../components/AllSubmissionsHistory';

const SubmissionHistoryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
  
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16 sm:pb-20">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Submission History</h1>
          <p className="text-sm sm:text-base text-slate-400">
            Track your progress and review all your past submissions across all problems.
          </p>
        </div>
        
        <div className="bg-slate-900 rounded-lg shadow-lg p-3 sm:p-6">
          <AllSubmissionsHistory />
        </div>
        
        <div className="mt-4 sm:mt-8 text-center text-xs sm:text-sm text-slate-400">
          <p>
            Note: Your submission history is preserved permanently. You can always refer back to your previous solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistoryPage;
