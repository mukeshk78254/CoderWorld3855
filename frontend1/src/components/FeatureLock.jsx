import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * FeatureLock Component
 *
 * Displays a lock overlay for features restricted to Yearly subscribers
 * Shows only for Monthly premium users, not for non-premium users
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to blur/lock
 * @param {string} props.featureName - Name of the locked feature
 * @param {string} props.description - Why this feature is locked
 * @param {boolean} props.requireYearly - If true, only yearly subscribers can access
 */
function FeatureLock({ children, featureName, description, requireYearly = false }) {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    const isPremium = !!(user && (user.isPremium || user.premium));
    const subscriptionType = user?.subscriptionType;
    
   
    if (!requireYearly) {
        return children;
    }
    
    
    if (isPremium && subscriptionType === 'yearly') {
        return children;
    }
    
    
    if (isPremium && subscriptionType === 'monthly') {
        return (
            <div className="relative">
                
                <div className="filter blur-sm pointer-events-none select-none opacity-50">
                    {children}
                </div>
                
              
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-md rounded-xl border-2 border-purple-500/50">
                    <div className="text-center max-w-md p-8">
                       
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
                                <Lock size={32} className="text-white" />
                            </div>
                        </div>
                        
                        
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {featureName}
                        </h3>
                        
                      
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            {description}
                        </p>
                        
                     
                        <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-200">
                                📋 Your Current Plan: <span className="font-semibold">Monthly Premium</span>
                            </p>
                        </div>
                        
                     
                        <div className="flex flex-col gap-3">
                          
                            <button
                                onClick={() => navigate('/premium')}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-purple-500/50"
                            >
                                <Crown size={24} />
                                Upgrade to Yearly Plan
                            </button>
                            
                            
                            <button
                                onClick={() => navigate('/premium')}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 border-2 border-purple-500/50 hover:border-purple-500 flex items-center justify-center gap-2"
                            >
                                📋 Check All Plans
                            </button>
                        </div>
                        
                      
                        <p className="text-xs text-gray-400 mt-4">
                            Unlock this feature and more with the Yearly Premium plan
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    
    return children;
}

export default FeatureLock;
