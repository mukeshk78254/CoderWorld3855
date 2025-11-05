import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { loginSuccess } from '../authSlice';
import { 
    Crown, Check, Zap, Loader2, Sparkles, Brain,
    Code, Video, BarChart3, MessageSquare, Star
} from 'lucide-react';

const PremiumPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSubscriptionStatus();
        }
    }, [isAuthenticated]);

    const fetchSubscriptionStatus = async () => {
        try {
            const response = await axiosClient.get('/payment/subscription-status');
            setSubscriptionStatus(response.data.subscription);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    };

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: 1,
            period: 'month',
            features: [
                'AI Code Assistant',
                '500+ Premium Problems',
                'Video Solutions',
                'Advanced Analytics',
                'Ad-Free Experience',
                'Priority Support'
            ],
            icon: Sparkles,
            color: 'blue'
        },
        {
            id: 'yearly',
            name: 'Yearly',
            price: 2,
            period: 'year',
            features: [
                'Everything in Monthly',
                'Interview Preparation',
                'Mock Interviews',
                'Career Mentorship',
                'Resume Review',
                'Elite Community Access'
            ],
            icon: Crown,
            color: 'purple',
            popular: true,
            badge: 'Best Value'
        }
    ];

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (plan) => {




        
        if (!isAuthenticated) {

            navigate('/login', { state: { from: '/premium' } });
            return;
        }

        setLoading(true);
        setSelectedPlan(plan.id);

        try {

            
            const res = await loadRazorpayScript();
            if (!res) {
                console.error(' Razorpay script failed to load');
                alert('Razorpay SDK failed to load. Please check your internet connection.');
                setLoading(false);
                return;
            }

            const orderResponse = await axiosClient.post('/payment/create-order', {
                amount: plan.price * 100, 
                planType: plan.id
            });



            const { order, key } = orderResponse.data;

        
            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: 'CoderWorld Premium',
                description: `${plan.name} Subscription`,
                image: '/logo.png',
                order_id: order.id,
                prefill: {
                    name: user?.firstname || '',
                    email: user?.emailId || '',
                },
                theme: {
                    color: '#6366f1'
                },
                handler: async function (response) {
                    try {

                        
                       
                        const verifyResponse = await axiosClient.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planType: plan.id
                        });

                        if (verifyResponse.data.success) {

                            
                            
                            try {
                                const userResponse = await axiosClient.get('/user/check');
                                if (userResponse.data.user) {
                                    dispatch(loginSuccess(userResponse.data.user));

                                }
                            } catch (error) {
                                console.error('Error fetching user data:', error);
                            }
                            
                           
                            alert('🎉 ' + verifyResponse.data.message);
                            
                            
                            await fetchSubscriptionStatus();
                            
                            
                            navigate('/home');
                        }
                    } catch (error) {
                        console.error(' Payment verification failed:', error);
                        alert('Payment verification failed. Please contact support.');
                    } finally {
                        setLoading(false);
                        setSelectedPlan(null);
                    }
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                        setSelectedPlan(null);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(' Error initiating payment:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack
            });
            
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
            alert(`Failed to initiate payment: ${errorMessage}\n\nPlease check console for details.`);
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-16">
        
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-6">
                        <Crown className="w-16 h-16 text-yellow-400" />
                    </div>
                    
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                            Upgrade to Premium
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Unlock AI-powered coding assistance and exclusive features
                    </p>
                    
                    {subscriptionStatus?.isPremium && (
                        <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/40 rounded-lg">
                            <Check className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-semibold">You're Premium! 🎉</span>
                        </div>
                    )}
                </div>

               
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const isPopular = plan.popular;
                        const colorClasses = {
                            blue: {
                                bg: 'bg-blue-500/10',
                                border: 'border-blue-500/30',
                                text: 'text-blue-400',
                                button: 'bg-blue-600 hover:bg-blue-700'
                            },
                            purple: {
                                bg: 'bg-purple-500/10',
                                border: 'border-purple-500/30',
                                text: 'text-purple-400',
                                button: 'bg-purple-600 hover:bg-purple-700'
                            }
                        };
                        const colors = colorClasses[plan.color];

                        return (
                            <div
                                key={plan.id}
                                className={`relative ${colors.bg} border-2 ${colors.border} rounded-2xl p-8 ${
                                    isPopular ? 'transform scale-105' : ''
                                }`}
                            >
                             
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                
                                <div className="flex justify-center mb-6">
                                    <Icon className={`w-12 h-12 ${colors.text}`} />
                                </div>

                               
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-2 mb-2">
                                        <span className={`text-4xl font-bold ${colors.text}`}>₹{plan.price}</span>
                                        <span className="text-gray-400">/ {plan.period}</span>
                                    </div>
                                </div>

                               
                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <Check className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                               
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loading || (subscriptionStatus?.isPremium && subscriptionStatus?.subscriptionType === plan.id)}
                                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                                        subscriptionStatus?.isPremium && subscriptionStatus?.subscriptionType === plan.id
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : `${colors.button}`
                                    } ${loading && selectedPlan === plan.id ? 'opacity-50' : ''}`}
                                >
                                    {loading && selectedPlan === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </span>
                                    ) : subscriptionStatus?.isPremium && subscriptionStatus?.subscriptionType === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Check className="w-5 h-5" />
                                            Current Plan
                                        </span>
                                    ) : subscriptionStatus?.isPremium && plan.id === 'yearly' && subscriptionStatus?.subscriptionType === 'monthly' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Zap className="w-5 h-5" />
                                            Upgrade to Yearly
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Zap className="w-5 h-5" />
                                            Subscribe Now
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

               
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <Brain className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">AI Assistant</h3>
                        <p className="text-gray-400 text-sm">Get instant help with code debugging and optimization</p>
                    </div>
                    
                    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <Code className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Premium Problems</h3>
                        <p className="text-gray-400 text-sm">Access 500+ exclusive coding challenges</p>
                    </div>
                    
                    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <Video className="w-10 h-10 text-pink-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Video Solutions</h3>
                        <p className="text-gray-400 text-sm">Watch detailed explanations for every problem</p>
                    </div>
                </div>

             
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                            <h3 className="text-white font-semibold mb-2">Can I cancel anytime?</h3>
                            <p className="text-gray-400 text-sm">Yes, cancel anytime. Your access continues until the billing period ends.</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                            <h3 className="text-white font-semibold mb-2">What payment methods are accepted?</h3>
                            <p className="text-gray-400 text-sm">We accept credit/debit cards, UPI, net banking, and wallets via Razorpay.</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                            <h3 className="text-white font-semibold mb-2">Do I get instant access?</h3>
                            <p className="text-gray-400 text-sm">Yes! Premium features activate immediately after successful payment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPage;
