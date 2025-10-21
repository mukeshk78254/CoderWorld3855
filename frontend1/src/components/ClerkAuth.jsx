import React from 'react';
import { 
  SignIn, 
  SignUp, 
  useUser, 
  useAuth,
  UserButton 
} from '@clerk/clerk-react';
import { FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';

export const ClerkSignIn = () => {
  return (
    <div className="w-full max-w-md bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 flex-shrink-0">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg transform rotate-[-10deg] animate-spin-slow">
          <span className="text-3xl">🔑</span>
        </div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
          Access Your World
        </h2>
        <p className="text-gray-300 text-base">Continue your adventure in CoderWorld.</p>
      </div>

      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg hover:shadow-purple-700/30",
            card: "bg-transparent shadow-none border-none",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-gray-300",
            socialButtonsBlockButton: 
              "bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-md",
            socialButtonsBlockButtonText: "text-white font-medium",
            formFieldInput: 
              "bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30 rounded-xl",
            formFieldLabel: "text-white/90 font-semibold",
            footerActionLink: "text-purple-400 hover:text-purple-300",
            identityPreviewText: "text-gray-300",
            formResendCodeLink: "text-purple-400 hover:text-purple-300"
          }
        }}
        redirectUrl="/"
        signUpUrl="/signup"
      />
    </div>
  );
};

export const ClerkSignUp = () => {
  return (
    <div className="w-full max-w-md bg-gradient-to-br from-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 flex-shrink-0">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg transform rotate-[-10deg] animate-spin-slow">
          <span className="text-3xl">🌱</span>
        </div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
          Create Account
        </h2>
        <p className="text-gray-300 text-base">Start your coding journey today.</p>
      </div>

      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-lg hover:shadow-green-700/30",
            card: "bg-transparent shadow-none border-none",
            headerTitle: "text-white text-2xl font-bold",
            headerSubtitle: "text-gray-300",
            socialButtonsBlockButton: 
              "bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-md",
            socialButtonsBlockButtonText: "text-white font-medium",
            formFieldInput: 
              "bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/30 rounded-xl",
            formFieldLabel: "text-white/90 font-semibold",
            footerActionLink: "text-green-400 hover:text-green-300",
            identityPreviewText: "text-gray-300",
            formResendCodeLink: "text-green-400 hover:text-green-300"
          }
        }}
        redirectUrl="/"
        signInUrl="/login"
      />
    </div>
  );
};


export const UserProfile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
        <p className="text-gray-400 text-sm">{user.primaryEmailAddress?.emailAddress}</p>
      </div>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
            userButtonPopoverCard: "bg-gray-800 border border-gray-700",
            userButtonPopoverActionButton: "text-white hover:bg-gray-700",
            userButtonPopoverActionButtonText: "text-white",
            userButtonPopoverFooter: "hidden"
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
};


export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <ClerkSignIn />;
  }

  return children;
};

export default { ClerkSignIn, ClerkSignUp, UserProfile, ProtectedRoute };


















