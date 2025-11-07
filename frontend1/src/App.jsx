
import { Routes, Route, Navigate, useLocation } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NotificationManager } from './components/NotificationSystem';
import { ThemeProvider } from './context/ThemeContext'; 
import { SettingsProvider } from './context/SettingsContext';
import { LogoutModalProvider } from './context/LogoutModalContext';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext'; 
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Homepage = lazy(() => import("./pages/Homepage"));
const Settings = lazy(() => import("./pages/Settings"));
const EnhancedHomepage = lazy(() => import("./pages/EnhancedHomepage"));
const ProblemListPage = lazy(() => import("./pages/ProblemListPage"));
const EnhancedContestPage = lazy(() => import("./pages/EnhancedContestPage"));
const EnhancedDiscussPage = lazy(() => import("./pages/EnhancedDiscussPage"));
const EnhancedLeaderboardPage = lazy(() => import("./pages/EnhancedLeaderboardPage"));
const EnhancedProfilePage = lazy(() => import("./pages/EnhancedProfilePage"));
const SimpleProfilePage = lazy(() => import("./pages/SimpleProfilePage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const HelpSupportPage = lazy(() => import("./pages/HelpSupportPage"));
const OAuthCallback = lazy(() => import("./components/OAuthCallback"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const EnhancedProblemPage = lazy(() => import('./pages/EnhancedProblemPage'));
const SimplifiedProblemPage = lazy(() => import('./pages/SimplifiedProblemPage'));
const LeetCodeStylePage = lazy(() => import('./pages/LeetCodeStylePage'));
const WriteSolutionPage = lazy(() => import('./pages/WriteSolutionPage'));
const ContestPage = lazy(() => import('./pages/ContestPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminVideo = lazy(() => import("./components/AdminVideo"));
const AdminDelete = lazy(() => import("./components/AdminDelete"));
const AdminUpload = lazy(() => import("./components/AdminUpload"));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EnhancedDashboard = lazy(() => import('./pages/EnhancedDashboard'));
const RealTimeDashboard = lazy(() => import('./pages/RealTimeDashboard'));
const TransactionPage = lazy(() => import('./pages/TransactionPage'));
const DiscussPage = lazy(() => import('./pages/DiscussPage'));
const ContestOpeningSoon = lazy(() => import('./pages/ContestOpeningSoon'));
const ContestEnded = lazy(() => import('./pages/ContestEnded'));
const SubmissionHistoryPage = lazy(() => import('./pages/SubmissionHistoryPage'));
const ProtectedRouteWithModal = lazy(() => import('./components/ProtectedRouteWithModal'));
const TestLogin = lazy(() => import('./pages/TestLogin'));
const OTPVerification = lazy(() => import('./pages/OTPVerification'));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    color: '#06b6d4'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(6, 182, 212, 0.1)',
        borderTop: '3px solid #06b6d4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Loading...</div>
    </div>
  </div>
);

const PremiumPage = lazy(() => import('./pages/PremiumPage'));

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { isOpen, mode, redirectPath, closeAuthModal } = useAuthModal();
  const location = useLocation();

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
            <Suspense fallback={<PageLoader />}>
              <Routes>
        <Route path="/" element={<LandingPage />} />
       
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/verify-otp" element={isAuthenticated ? <Navigate to="/home" /> : <OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/test-login" element={<Login />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/support" element={<HelpSupportPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        
        {/* Policy Pages for Razorpay Compliance */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
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
            </Suspense>
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
