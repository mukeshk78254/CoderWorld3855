
import { Routes, Route, Navigate, useLocation } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Homepage from "./pages/Homepage";
import Settings from "./pages/Settings";
import EnhancedHomepage from "./pages/EnhancedHomepage";
import ProblemListPage from "./pages/ProblemListPage";
import EnhancedContestPage from "./pages/EnhancedContestPage";
import EnhancedDiscussPage from "./pages/EnhancedDiscussPage";
import EnhancedLeaderboardPage from "./pages/EnhancedLeaderboardPage";
import EnhancedProfilePage from "./pages/EnhancedProfilePage";
import SimpleProfilePage from "./pages/SimpleProfilePage";
import LandingPage from "./pages/LandingPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import OAuthCallback from "./components/OAuthCallback";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProblemPage from './pages/ProblemPage';
import EnhancedProblemPage from './pages/EnhancedProblemPage';
import SimplifiedProblemPage from './pages/SimplifiedProblemPage';
import LeetCodeStylePage from './pages/LeetCodeStylePage';
import WriteSolutionPage from './pages/WriteSolutionPage';
import ContestPage from './pages/ContestPage';
import LeaderboardPage from './pages/LeaderboardPage'; 
import AdminPanel from "./components/AdminPanel";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard'; 
import EnhancedDashboard from './pages/EnhancedDashboard'; 
import RealTimeDashboard from './pages/RealTimeDashboard'; 
import TransactionPage from './pages/TransactionPage'; 
import DiscussPage from './pages/DiscussPage'; 
import ContestOpeningSoon from './pages/ContestOpeningSoon'; 
import ContestEnded from './pages/ContestEnded'; 
import SubmissionHistoryPage from './pages/SubmissionHistoryPage'; 
import { NotificationManager } from './components/NotificationSystem';
import { ThemeProvider } from './context/ThemeContext'; 
import { SettingsProvider } from './context/SettingsContext';
import { LogoutModalProvider } from './context/LogoutModalContext';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext'; 
import AuthModal from './components/AuthModal';
import ProtectedRouteWithModal from './components/ProtectedRouteWithModal';
import ProtectedRoute from './components/ProtectedRoute'; 
import TestLogin from './pages/TestLogin'; 
import OTPVerification from './pages/OTPVerification';
import PremiumPage from './pages/PremiumPage'; 

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { isOpen, mode, redirectPath, closeAuthModal } = useAuthModal();
  const location = useLocation();

  
  useEffect(() => {
    console.log('Current location:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'auth_failed' || urlParams.get('error') === 'no_code') {
    
      return;
    }
    
   
    if (window.location.pathname === '/' && !isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
    
  return (
    <>
      <ThemeProvider>
        <SettingsProvider>
          <LogoutModalProvider>
            <NotificationManager />
            <Routes>
        <Route path="/" element={<LandingPage />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/verify-otp" element={isAuthenticated ? <Navigate to="/home" /> : <OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/test-login" element={<Login />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/support" element={<HelpSupportPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        {/* <Route path="/problem/:problemid" element={<LeetCodeStylePage/>} /> */}
        
      
        <Route path="/home" element={<ProtectedRoute><EnhancedHomepage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/contests" element={<ProtectedRoute><EnhancedContestPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><EnhancedLeaderboardPage /></ProtectedRoute>} />
        <Route path="/discuss" element={<ProtectedRoute><EnhancedDiscussPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionPage /></ProtectedRoute>} />
        <Route path="/submissions" element={<ProtectedRoute><SubmissionHistoryPage /></ProtectedRoute>} />
        <Route path="/contest/opening-soon" element={<ProtectedRoute><ContestOpeningSoon /></ProtectedRoute>} />
        <Route path="/contest/ended" element={<ProtectedRoute><ContestEnded /></ProtectedRoute>} />
        <Route path="/problems" element={<ProblemListPage />} />
        <Route path="/problem/:problemid/write-solution" element={<ProtectedRoute><WriteSolutionPage /></ProtectedRoute>} />
        <Route path="/test-write-solution" element={<ProtectedRoute><WriteSolutionPage /></ProtectedRoute>} />
        <Route path="/problem/:problemid" element={<LeetCodeStylePage />} />
       
        <Route path="/test-problem/:problemid" element={
          <div className="p-5 bg-gray-900 text-white min-h-screen">
            <h1 className="text-xl mb-4">Test Problem Route</h1>
            <p>This is a test route to verify routing is working.</p>
            <p>Problem ID: {window.location.pathname.split('/').pop()}</p>
            <button 
              onClick={() => {
                const id = window.location.pathname.split('/').pop();
                window.location.href = `/problem/${id}`;
              }}
              className="px-4 py-2 bg-blue-600 mt-4 rounded"
            >
              Go to actual problem page
            </button>
          </div>
        } />

      
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/home" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/home" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/home" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/home" />} />
        <Route path="/admin/upload/:problemid" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/home" />} />
        
       
        <Route path="*" element={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Route Not Found</h1>
                    <p className="text-slate-400 mb-4">Current URL: {window.location.pathname}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        } />
            </Routes>
          </LogoutModalProvider>
        </SettingsProvider>
      </ThemeProvider>
      
     
      <AuthModal 
        isOpen={isOpen} 
        onClose={closeAuthModal} 
        mode={mode} 
        redirectPath={redirectPath} 
      />
    </>
  );
};


function App() {
  return (
    <AuthModalProvider>
      <AppContent />
    </AuthModalProvider>
  );
}

export default App;