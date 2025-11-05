
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import {
    User, Edit3, Save, X, Star, Trophy, Award, Target,
    Zap, Flame, Code, Calendar, MapPin, Globe, Github,
    Linkedin, Twitter, Briefcase, GraduationCap, Settings,
    Bell, CreditCard, FileText, DollarSign, HelpCircle, Flag,
    CheckCircle, MessageSquare, Shield, Lock, Unlock, TrendingUp,
    Users, Eye, Palette, Languages, Sun, Moon, Monitor, Heart,
    BookOpen, Download, Sparkles, Crown, Rocket, Brain, Cpu,
    Database, Layers, GitBranch, Terminal, Wrench, Key, Mail,
    Phone, Camera, Image, Music, Video, Gamepad2, Coffee,
    Pizza, Car, Home, Building, TreePine, LogOut, Trash2
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Header from '../components/dashboard/Header';
import { useSettings } from '../context/SettingsContext';


gsap.registerPlugin(ScrollTrigger, TextPlugin);


const capitalizeWords = (str) => {
    if (typeof str !== 'string' || !str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const DEFAULT_NOTIFICATION_SETTINGS_FRONTEND = {
    importantAnnouncements: { email: true, site: false },
    featureAnnouncements: { email: true, site: false },
    awardNotification: { email: true, site: true },
    globalRanking: { email: false, site: true },
    contestBadge: { email: false, site: true },
    contestAnnouncements: { email: true, site: true },
    newComment: { email: false, site: true },
    otherNotifications: { email: true, site: false },
    promotions: { email: true, site: false },
    weeklyRecommendations: { email: true, site: false },
};

const DEFAULT_PRIVACY_SETTINGS_FRONTEND = {
    contactByCompanies: true,
    joinStudyPlanLeaderboard: true,
    displaySubmissionHistory: true,
};



const AnimatedProfileBackground = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let floatingIcons = [];
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const iconList = [
            Code, Trophy, Star, Award, Target, Zap, Flame, Brain, Cpu, Database,
            Layers, GitBranch, Terminal, Wrench, Key, Mail, Phone, Camera, Image,
            Music, Video, Gamepad2, Coffee, Pizza, Car, Home, Building, TreePine,
            Sparkles, Crown, Rocket, Heart, BookOpen, Download, Settings, Shield
        ];

        const createFloatingIcons = () => {
            floatingIcons = [];
            for (let i = 0; i < 25; i++) {
                const IconComponent = iconList[Math.floor(Math.random() * iconList.length)];
                floatingIcons.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 20 + 15,
                    opacity: Math.random() * 0.6 + 0.2,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`, // Cyan to blue range
                    icon: IconComponent,
                    pulse: Math.random() * 0.02 + 0.01
                });
            }
        };

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.8 + 0.2,
                    color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
                    twinkle: Math.random() * 0.02 + 0.01
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)');
            gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.6)');
            gradient.addColorStop(1, 'rgba(51, 65, 85, 0.4)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.opacity += particle.twinkle * (Math.random() > 0.5 ? 1 : -1);
                particle.opacity = Math.max(0.1, Math.min(0.9, particle.opacity));

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
                ctx.fill();
            });

            floatingIcons.forEach((icon, index) => {
                icon.x += icon.vx;
                icon.y += icon.vy;
                icon.rotation += icon.rotationSpeed;
                icon.opacity += icon.pulse * (Math.random() > 0.5 ? 1 : -1);
                icon.opacity = Math.max(0.1, Math.min(0.7, icon.opacity));

                if (icon.x < -50 || icon.x > canvas.width + 50) icon.vx *= -1;
                if (icon.y < -50 || icon.y > canvas.height + 50) icon.vy *= -1;

                ctx.save();
                ctx.globalAlpha = icon.opacity;
                ctx.translate(icon.x, icon.y);
                ctx.rotate(icon.rotation);
                ctx.fillStyle = icon.color;
                ctx.font = `${icon.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('●', 0, 0);
                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        createFloatingIcons();
        createParticles();
        animate();

        const handleResize = () => {
            resizeCanvas();
            createFloatingIcons();
            createParticles();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};



const EditableField = ({ label, value, onSave, onCancel, isEditing, onEdit, type = 'text', placeholder, points = 0, icon: Icon, options }) => {
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = () => {
        onSave(tempValue);
    };

    const handleCancel = () => {
        setTempValue(value);
        onCancel();
    };

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full mt-1 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400"
                    placeholder={placeholder}
                    rows="3"
                />
            );
        }
        if (type === 'select' && options) {
            return (
                <select
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full mt-1 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }
        return (
            <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full mt-1 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400"
                placeholder={placeholder}
            />
        );
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-800/50 rounded-lg transition-colors border border-gray-700/50 hover:bg-slate-800/70">
            <div className="flex-1 flex items-center gap-3 mb-2 md:mb-0">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Icon size={18} className="text-cyan-400" />
                </div>
                <div>
                    <div className="text-white font-medium">{label}</div>
                    {isEditing ? (
                        renderInput()
                    ) : (
                        <div className="text-slate-400 text-sm">{value || <span className="italic">{placeholder || 'Not provided'}</span>}</div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {points > 0 && !isEditing && (
                    <span className="text-cyan-400 text-sm font-medium">+{points}</span>
                )}
                {isEditing ? (
                    <div className="flex gap-1">
                        <button
                            onClick={handleSave}
                            className="p-1 bg-green-500 hover:bg-green-600 rounded text-white transition-colors"
                        >
                            <Save size={16} />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="p-1 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onEdit()}
                        className="p-1 bg-cyan-500 hover:bg-cyan-600 rounded text-white transition-colors"
                    >
                        <Edit3 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};


function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
    const { settings } = useSettings();

    const [profileData, setProfileData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [activeTab, setActiveTab] = useState('basic-info');

    const [editingField, setEditingField] = useState(null);
    const [editingPrivacyField, setEditingPrivacyField] = useState(null);
    const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
    const [privacySettings, setPrivacySettings] = useState(DEFAULT_PRIVACY_SETTINGS_FRONTEND);
    const [reportText, setReportText] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordStep, setPasswordStep] = useState(1);
    const [passwordEmail, setPasswordEmail] = useState('');
    const [passwordOtp, setPasswordOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const chatbotResponses = {
        'getting started': "Welcome! To get started, you can explore the 'Problems' section to solve your first challenge, or check out a 'Study Plan' to guide your learning.",
        'problem solving': "Having trouble with a problem? Try breaking it down into smaller steps, drawing out the data flow, or searching for similar problems in the 'Discuss' section.",
        'contests': "To join a contest, simply go to the 'Contests' tab and register for an upcoming event. Make sure you're on time to compete for a prize!",
        'account issues': "For account issues, you can try resetting your password from the login page or send a detailed report from the 'Reports' tab. Our support team will help you out.",
        'hello': "Hi there! I'm here to help. What can I assist you with today?",
        'default': "I'm sorry, I don't have information on that topic yet. Please select from the options provided or try asking a different question."
    };

    const handleChatbotSubmit = (e) => {
        e.preventDefault();
        if (chatInput.trim() === '') return;

        const userMessage = chatInput;
        setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setChatInput('');

        setTimeout(() => {
            const normalizedInput = userMessage.toLowerCase().trim();
            let botResponse = chatbotResponses.default;

            if (normalizedInput.includes('getting started')) {
                botResponse = chatbotResponses['getting started'];
            } else if (normalizedInput.includes('problem solving')) {
                botResponse = chatbotResponses['problem solving'];
            } else if (normalizedInput.includes('contests')) {
                botResponse = chatbotResponses['contests'];
            } else if (normalizedInput.includes('account issues')) {
                botResponse = chatbotResponses['account issues'];
            } else if (normalizedInput.includes('hello')) {
                botResponse = chatbotResponses['hello'];
            }

            setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        }, 1000);
    };

    const achievements = profileData?.achievements || [
        { id: 1, name: 'First Problem Solved', description: 'Solve your first coding problem', unlocked: false, icon: Trophy },
        { id: 2, name: 'Streak Master', description: 'Maintain a 7-day solving streak', unlocked: false, icon: Trophy },
        { id: 3, name: 'Algorithm Expert', description: 'Solve 50 algorithm problems', unlocked: false, icon: Target },
        { id: 4, name: 'Data Structure Pro', description: 'Master all data structures', unlocked: false, icon: Code },
    ];

    const badges = profileData?.badges || [
        { id: 1, name: 'Problem Solver', description: 'Solved 10 problems', unlocked: false, color: 'green' },
        { id: 2, name: 'Quick Learner', description: 'Solved 5 problems in one day', unlocked: false, color: 'blue' },
        { id: 3, name: 'Consistent Coder', description: '7-day streak', unlocked: false, color: 'purple' },
        { id: 4, name: 'Algorithm Master', description: 'Solved 25 algorithm problems', unlocked: false, color: 'orange' }
    ];

    const stats = {
        problemsSolved: profileData?.stats?.solvedCount || 0,
        totalProblems: profileData?.stats?.totalStats?.total || 1500,
        easySolved: profileData?.stats?.easyCount || 0,
        easyTotal: profileData?.stats?.totalStats?.Easy || 500,
        mediumSolved: profileData?.stats?.mediumCount || 0,
        mediumTotal: profileData?.stats?.totalStats?.Medium || 700,
        hardSolved: profileData?.stats?.hardCount || 0,
        hardTotal: profileData?.stats?.totalStats?.Hard || 300,
        currentStreak: profileData?.stats?.currentStreak || 0,
        maxStreak: profileData?.stats?.longestStreak || 0,
        rank: profileData?.stats?.rank || 0,
        reputation: profileData?.stats?.reputation || 0,
        views: profileData?.stats?.views || 0,
        solutions: profileData?.stats?.solutions || 0,
        discussions: profileData?.stats?.discussions || 0,
        points: profileData?.stats?.totalPoints || profileData?.stats?.points || 0
    };

    const fetchProfileData = async () => {
        if (!isAuthenticated) {
            setPageLoading(false);
            return;
        }
        try {
            setPageLoading(true);
            setFetchError(null);
            
           
            const [profileRes, dashboardRes] = await Promise.all([
                axiosClient.get('/profile'),
                axiosClient.get(`/user/${user.id}/dashboard-pro`).catch(() => null) // Don't fail if dashboard data unavailable
            ]);
            

            
            
            const combinedData = {
                ...profileRes.data,
                stats: {
                    ...profileRes.data.stats,
                    ...dashboardRes?.data
                },
                badges: profileRes.data.badges || [],
                achievements: profileRes.data.achievements || []
            };
            

            
            setProfileData(combinedData);
            setNotificationSettings(profileRes.data.settings?.notifications || DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
            setPrivacySettings(profileRes.data.settings?.privacy || DEFAULT_PRIVACY_SETTINGS_FRONTEND);
        } catch (err) {
            console.error('Error fetching profile data:', err);
            setFetchError('Failed to load profile data. Please try again.');
            if (err.response?.status === 401) {
                dispatch(logoutUser());
            }
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            fetchProfileData();
        } else if (!isAuthenticated && !authLoading) {
            setPageLoading(false);
        }
    }, [isAuthenticated, authLoading, dispatch]);

    const handleSaveBasicInfo = async (fieldPath, value) => {
        try {
            setFetchError(null);
            let valueToSave = value;
            if (fieldPath === 'profile.gender') {
                valueToSave = value === 'Not provided' ? '' : value;
            } else if (fieldPath === 'profile.birthday') {
                valueToSave = value ? new Date(value).toISOString() : null;
            }

            const res = await axiosClient.put('/profile/field', { field: fieldPath, value: valueToSave });
            setProfileData(res.data.user);
            setEditingField(null);
        } catch (err) {
            console.error('Error updating field:', fieldPath, err);
            setFetchError(`Failed to update ${capitalizeWords(fieldPath.split('.').pop())}: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleNotificationChange = async (setting, type, checked) => {
        try {
            setFetchError(null);
            setNotificationSettings(prev => ({ ...prev, [setting]: { ...prev[setting], [type]: checked } }));
            await axiosClient.put('/profile/settings/notifications', { setting, type, value: checked });
        } catch (err) {
            console.error('Error updating notification setting:', err);
            setNotificationSettings(profileData.settings?.notifications || DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
            setFetchError('Failed to update notification setting. Please retry.');
        }
    };

    const handlePrivacyChange = async (field, value) => {
        try {
            setFetchError(null);
            const booleanValue = value === 'Yes';
            setPrivacySettings(prev => ({ ...prev, [field]: booleanValue }));
            await axiosClient.put('/profile/settings/privacy', { field, value: booleanValue });
            setEditingPrivacyField(null);
        } catch (err) {
            console.error('Error updating privacy setting:', err);
            setPrivacySettings(profileData.settings?.privacy || DEFAULT_PRIVACY_SETTINGS_FRONTEND);
            setFetchError('Failed to update privacy setting. Please retry.');
        }
    };

    const handleSubmitReport = () => {
        if (reportText.trim() === '') {
            setFetchError('Please enter a report description.');
            return;
        }

      
        setShowSuccessMessage(true);
        setReportText('');
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };


    const handleSendPasswordOtp = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');
        try {
          
            await axiosClient.post('/user/send-reset-otp', { emailId: passwordEmail });
            setPasswordStep(2);
            setPasswordSuccess('OTP sent to your email. Check your spam folder if you don\'t see it.');
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setPasswordLoading(false);
        }
    };

   
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            setPasswordLoading(false);
            return;
        }
        if (newPassword.length < 6) {
             setPasswordError('New password must be at least 6 characters long.');
            setPasswordLoading(false);
            return;
        }
        try {
            
            await axiosClient.post('/user/reset-password', { 
                emailId: passwordEmail, 
                otp: passwordOtp, 
                newPassword: newPassword 
            });
            
            
            setPasswordSuccess('Password changed successfully! Logging out for security...');
            
            dispatch(logoutUser()); 
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000); 

        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password. Check your OTP and try again.');
        } finally {
            setPasswordLoading(false);
        }
    };
    
    
    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
            return;
        }
        try {
            setPageLoading(true);
            setFetchError(null);
            
            
            await axiosClient.delete('/user/profile'); 
            
            
            dispatch(logoutUser());
            window.location.href = '/login';
        } catch (err) {
            console.error('Error deleting account:', err);
            setFetchError(err.response?.data?.message || 'Failed to delete account. Please try again.');
            setPageLoading(false);
        }
    };

    const resetPasswordForm = () => {
        setShowChangePassword(false);
        setPasswordStep(1);
        setPasswordEmail(profileData?.emailId || '');
        setPasswordOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordSuccess('');
    };

   
    
    const renderBasicInfo = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Basic Info</h3>
            <div className="space-y-6">
                <EditableField
                    label="Name"
                    value={profileData.firstname || ''}
                    onSave={(value) => handleSaveBasicInfo('firstname', value)}
                    isEditing={editingField === 'firstname'}
                    onEdit={() => setEditingField('firstname')}
                    onCancel={() => setEditingField(null)}
                    icon={User}
                    points={2}
                    placeholder="Enter your full name"
                />
                <EditableField
                    label="Gender"
                    value={profileData.profile?.gender || 'Not provided'}
                    onSave={(value) => handleSaveBasicInfo('profile.gender', value)}
                    isEditing={editingField === 'profile.gender'}
                    onEdit={() => setEditingField('profile.gender')}
                    onCancel={() => setEditingField(null)}
                    icon={User}
                    type="select"
                    options={['Not provided', 'Male', 'Female', 'Other']}
                    points={2}
                />
                <EditableField
                    label="Location"
                    value={profileData.profile?.location || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.location', value)}
                    isEditing={editingField === 'profile.location'}
                    onEdit={() => setEditingField('profile.location')}
                    onCancel={() => setEditingField(null)}
                    icon={MapPin}
                    points={2}
                    placeholder="City, Country"
                />
                <EditableField
                    label="Birthday"
                    value={profileData.profile?.birthday ? new Date(profileData.profile.birthday).toISOString().split('T')[0] : ''}
                    onSave={(value) => handleSaveBasicInfo('profile.birthday', value)}
                    isEditing={editingField === 'profile.birthday'}
                    onEdit={() => setEditingField('profile.birthday')}
                    onCancel={() => setEditingField(null)}
                    icon={Calendar}
                    type="date"
                    points={2}
                />
                <EditableField
                    label="Summary"
                    value={profileData.profile?.summary || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.summary', value)}
                    isEditing={editingField === 'profile.summary'}
                    onEdit={() => setEditingField('profile.summary')}
                    onCancel={() => setEditingField(null)}
                    icon={FileText}
                    type="textarea"
                    points={2}
                    placeholder="Tell us about yourself..."
                />
                <EditableField
                    label="Website"
                    value={profileData.profile?.website || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.website', value)}
                    isEditing={editingField === 'profile.website'}
                    onEdit={() => setEditingField('profile.website')}
                    onCancel={() => setEditingField(null)}
                    icon={Globe}
                    points={2}
                    placeholder="https://your-website.com"
                />
                <EditableField
                    label="Github"
                    value={profileData.profile?.github || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.github', value)}
                    isEditing={editingField === 'profile.github'}
                    onEdit={() => setEditingField('profile.github')}
                    onCancel={() => setEditingField(null)}
                    icon={Github}
                    points={2}
                    placeholder="https://github.com/yourusername"
                />
                <EditableField
                    label="LinkedIn"
                    value={profileData.profile?.linkedin || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.linkedin', value)}
                    isEditing={editingField === 'profile.linkedin'}
                    onEdit={() => setEditingField('profile.linkedin')}
                    onCancel={() => setEditingField(null)}
                    icon={Linkedin}
                    points={2}
                    placeholder="https://linkedin.com/in/yourprofile"
                />
                <EditableField
                    label="X (formerly Twitter)"
                    value={profileData.profile?.twitter || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.twitter', value)}
                    isEditing={editingField === 'profile.twitter'}
                    onEdit={() => setEditingField('profile.twitter')}
                    onCancel={() => setEditingField(null)}
                    icon={Twitter}
                    points={2}
                    placeholder="https://x.com/yourusername"
                />
                <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Experience</h4>
                <EditableField
                    label="Work"
                    value={profileData.profile?.work || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.work', value)}
                    isEditing={editingField === 'profile.work'}
                    onEdit={() => setEditingField('profile.work')}
                    onCancel={() => setEditingField(null)}
                    icon={Briefcase}
                    points={2}
                    placeholder="Your current job title and company"
                />
                <EditableField
                    label="Education"
                    value={profileData.profile?.education || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.education', value)}
                    isEditing={editingField === 'profile.education'}
                    onEdit={() => setEditingField('profile.education')}
                    onCancel={() => setEditingField(null)}
                    icon={GraduationCap}
                    points={2}
                    placeholder="Your educational background"
                />
                <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Skills</h4>
                <EditableField
                    label="Technical Skills"
                    value={profileData.profile?.skills || ''}
                    onSave={(value) => handleSaveBasicInfo('profile.skills', value)}
                    isEditing={editingField === 'profile.skills'}
                    onEdit={() => setEditingField('profile.skills')}
                    onCancel={() => setEditingField(null)}
                    icon={Code}
                    points={2}
                    placeholder="List your programming languages and technologies"
                />
            </div>
        </motion.div>
    );
    
    const renderAccountInfo = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Account Information</h3>
            <div className="space-y-6">
               
                <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
                    <div className="flex-1">
                        <p className="text-gray-400 text-sm mb-1">ID</p>
                        <p className="text-white text-lg">{profileData.firstname?.toLowerCase() || ''}{profileData._id?.slice(0, 5) || ''}</p>
                    </div>
                    <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700 mt-2 md:mt-0" disabled>View</button>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
                    <div className="flex-1">
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <p className="text-white text-lg">
                            {settings.showEmail ? (profileData.emailId || 'N/A') : profileData.emailId}
                        </p>
                    </div>
                    <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700 mt-2 md:mt-0" disabled>Verified</button>
                </div>
                
                
                <div className="border-b border-gray-700/50 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 mb-4">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm mb-1">Password</p>
                            <button 
                                className="text-indigo-400 text-lg hover:underline cursor-pointer flex items-center gap-2"
                                onClick={() => {
                                    if (!showChangePassword) {
                                        
                                        setPasswordEmail(profileData.emailId || '');
                                    }
                                    setShowChangePassword(!showChangePassword);
                                }}
                            >
                                {showChangePassword ? <Unlock size={18} /> : <Lock size={18} />}
                                {showChangePassword ? 'Hide Password Form' : 'Change Password'}
                            </button>
                        </div>
                    </div>
                    
                  
                    <AnimatePresence mode="wait">
                        {showChangePassword && (
                            <motion.div 
                                key="password-form"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gray-800/50 p-6 rounded-lg overflow-hidden"
                            >
                                <motion.div 
                                    key={`step-${passwordStep}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {passwordError && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400">{passwordError}</div>}
                                    {passwordSuccess && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded text-green-400">{passwordSuccess}</div>}
                                
                                  
                                    {passwordStep === 1 && (
                                        <form onSubmit={handleSendPasswordOtp}>
                                            <label className="block text-gray-300 mb-2 font-medium">Registered Email</label>
                                            <input
                                                type="email"
                                                className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
                                                value={passwordEmail}
                                                onChange={e => setPasswordEmail(e.target.value)}
                                                placeholder={profileData.emailId || "Enter your registered email"}
                                                required
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    type="submit"
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
                                                    disabled={passwordLoading || !passwordEmail}
                                                >
                                                    {passwordLoading ? 'Sending OTP...' : 'Send OTP'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={resetPasswordForm}
                                                    className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                    
                                    
                                  {passwordStep === 2 && (
    <form onSubmit={handleChangePassword}>
       
        <p className="text-sm text-slate-400 mb-4">OTP sent to **{passwordEmail}**</p>
        
        
        <label className="block text-gray-300 mb-2 font-medium">OTP</label>
        <input
            type="text"
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            value={passwordOtp}
            onChange={e => setPasswordOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
        />
        
      
        <label className="block text-gray-300 mb-2 font-medium">New Password</label>
        <input
            type="password"
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
        />
        
      
        <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
        <input
            type="password"
            className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
        />
        
      
        <div className="flex gap-3">
        
        </div>
    </form>
)}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Social Accounts Section (omitted for brevity, remains unchanged) */}
                <h3 className="text-2xl font-bold text-white mt-8 mb-6 border-b border-gray-700 pb-4">Social Accounts</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
                        <div className="flex items-center">
                            <span className="mr-3 text-2xl font-bold text-blue-500">in</span>
                            <p className="text-white text-lg">LinkedIn</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">Not Connected</span>
                            <span className="text-green-400">+10</span>
                            <button className="btn btn-sm btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">Connect</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
                        <div className="flex items-center">
                            <span className="mr-3 text-2xl font-bold text-gray-400">Gh</span>
                            <p className="text-white text-lg">Github</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">Not Connected</span>
                            <span className="text-green-400">+10</span>
                            <button className="btn btn-sm btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">Connect</button>
                        </div>
                    </div>
                </div>
                
               
                <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 btn btn-error bg-red-600 hover:bg-red-700 border-red-600 text-white mt-10 px-8 py-3 rounded-xl shadow-lg"
                    disabled={pageLoading || authLoading}
                >
                    <Trash2 size={20} />
                    Delete Account
                </button>
            </div>
        </motion.div>
    );

    const renderPrivacySettings = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Privacy</h3>
            <div className="space-y-8">
                {[
                    { field: 'contactByCompanies', label: 'Can companies contact you?', description: 'We will only send your contact info to interested partners.' },
                    { field: 'joinStudyPlanLeaderboard', label: 'Join study plan leaderboard', description: 'Changes apply at the start of each week.' },
                    { field: 'displaySubmissionHistory', label: 'Display my submission history', description: 'History will not be visible to others on your profile.' }
                ].map(({ field, label, description }) => (
                    <div key={field} className="flex flex-col lg:flex-row lg:items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
                        <div className="flex-1 pr-4 mb-4 lg:mb-0">
                            <p className="text-white text-lg font-medium">{label}</p>
                            <p className="text-gray-400 text-sm mt-1">{description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {editingPrivacyField === field ? (
                                <>
                                    <select
                                        className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 w-24"
                                        value={privacySettings[field] ? 'Yes' : 'No'}
                                        onChange={(e) => setPrivacySettings(prev => ({ ...prev, [field]: e.target.value === 'Yes' }))}
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    <button className="btn btn-sm btn-primary" onClick={() => handlePrivacyChange(field, privacySettings[field] ? 'Yes' : 'No')}>Save</button>
                                    <button className="btn btn-sm btn-ghost" onClick={() => setEditingPrivacyField(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-300 font-semibold">{privacySettings[field] ? 'Yes' : 'No'}</span>
                                    <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700" onClick={() => setEditingPrivacyField(field)}>Edit</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderNotificationSettings = () => {
        const notificationCategories = {
            Announcements: ['importantAnnouncements', 'featureAnnouncements'],
            Contest: ['globalRanking', 'contestBadge', 'contestAnnouncements'],
            Other: ['otherNotifications', 'promotions', 'weeklyRecommendations'],
        };

        const renderCheckboxRow = (settingKey, label) => (
            <tr key={settingKey} className="border-b border-gray-700/50 last:border-none">
                <td className="py-3 px-4 text-white text-md font-medium">{label}</td>
                <td className="py-3 px-4 text-center">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500"
                        checked={notificationSettings[settingKey]?.email || false}
                        onChange={(e) => handleNotificationChange(settingKey, 'email', e.target.checked)}
                    />
                </td>
                <td className="py-3 px-4 text-center">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500"
                        checked={notificationSettings[settingKey]?.site || false}
                        onChange={(e) => handleNotificationChange(settingKey, 'site', e.target.checked)}
                    />
                </td>
            </tr>
        );

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Notifications</h3>
                <div className="overflow-x-auto">
                    <table className="table w-full text-slate-200">
                        <thead>
                            <tr className="border-b border-gray-700 bg-gray-700/50">
                                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300"></th>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Email</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Site</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(notificationCategories).map(([category, settings]) => (
                                <React.Fragment key={category}>
                                    <tr>
                                        <td colSpan="3" className="py-4 px-4 text-gray-400 font-bold uppercase text-sm border-b border-gray-700/50 bg-gray-800/60">{category}</td>
                                    </tr>
                                    {settings.map(settingKey => renderCheckboxRow(settingKey, capitalizeWords(settingKey.replace(/([A-Z])/g, ' $1').trim())))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        );
    };

    const renderAchievements = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className="text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${achievement.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-slate-700'} shadow-lg`}>
                            {<achievement.icon size={32} className="text-white" />}
                        </div>
                        <div className="text-white text-sm font-medium">{achievement.name}</div>
                        <div className="text-slate-400 text-xs">{achievement.description}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderBadges = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Badges & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {badges.map((badge) => (
                    <motion.div 
                        key={badge.id} 
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${badge.unlocked ? 'bg-slate-800/50 border-cyan-400/50 hover:border-cyan-400/70' : 'bg-slate-800/30 border-slate-600'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.unlocked ? `bg-${badge.color}-500` : 'bg-slate-600'}`}>
                                <Award size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-semibold">{badge.name}</h4>
                                <p className="text-slate-400 text-sm">{badge.description}</p>
                                <div className={`text-xs mt-1 flex items-center gap-1 ${badge.unlocked ? 'text-green-400' : 'text-slate-500'}`}>
                                    {badge.unlocked ? (
                                        <>
                                            <CheckCircle size={12} />
                                            <span>Earned</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={12} />
                                            <span>Locked</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
           
            <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-semibold text-lg">Badge Progress</h4>
                        <p className="text-slate-400 text-sm">Track your achievement progress</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">
                            {badges.filter(b => b.unlocked).length}/{badges.length}
                        </div>
                        <div className="text-slate-400 text-sm">Badges Earned</div>
                    </div>
                </div>
                <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(badges.filter(b => b.unlocked).length / badges.length) * 100}%` }}
                    ></div>
                </div>
            </div>
        </motion.div>
    );

    const renderPoints = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Points & Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Points', value: stats.points || 0, icon: Trophy, color: 'bg-yellow-500' },
                    { label: 'Problems Solved', value: stats.problemsSolved || 0, total: stats.totalProblems || 0, icon: Code, color: 'bg-cyan-500' },
                    { label: 'Current Streak', value: stats.currentStreak || 0, icon: Star, color: 'bg-orange-500' },
                    { label: 'Max Streak', value: stats.maxStreak || 0, icon: Flame, color: 'bg-red-500' },
                    { label: 'Easy Solved', value: stats.easySolved || 0, total: stats.easyTotal || 0, icon: CheckCircle, color: 'bg-green-500' },
                    { label: 'Medium Solved', value: stats.mediumSolved || 0, total: stats.mediumTotal || 0, icon: Target, color: 'bg-yellow-500' },
                    { label: 'Hard Solved', value: stats.hardSolved || 0, total: stats.hardTotal || 0, icon: Award, color: 'bg-red-500' },
                    { label: 'Global Rank', value: stats.rank ? `#${stats.rank.toLocaleString()}` : 'Unranked', icon: Globe, color: 'bg-purple-500' }
                ].map((stat) => (
                    <div key={stat.label} className="p-6 bg-slate-800/50 rounded-xl text-center hover:bg-slate-800/70 transition-colors">
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                            <stat.icon size={24} className="text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-400">{stat.label}</div>
                        {stat.total && <div className="text-slate-500 text-xs mt-1">of {stat.total}</div>}
                    </div>
                ))}
            </div>
        </motion.div>
    );

    // Enhanced Transaction History with Real Data
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoadingTransactions(true);
            // For now, using profileData. Later you can create a dedicated API endpoint
            const paymentHistory = [];
            
            if (profileData?.paymentId && profileData?.orderId) {
                paymentHistory.push({
                    id: profileData.paymentId,
                    type: `${profileData.subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Premium Subscription`,
                    amount: profileData.subscriptionType === 'monthly' ? '₹1' : '₹2',
                    date: profileData.subscriptionStartDate ? new Date(profileData.subscriptionStartDate).toLocaleDateString() : 'N/A',
                    status: 'Completed',
                    orderId: profileData.orderId,
                    planType: profileData.subscriptionType
                });
            }
            
            setTransactions(paymentHistory);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    useEffect(() => {
        if (profileData && activeTab === 'transactions') {
            fetchTransactions();
        }
    }, [profileData, activeTab]);

    // Premium Subscription Details Section
    const renderPremium = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4 flex items-center gap-2">
                <Crown className="text-yellow-400" size={28} />
                Premium Membership
            </h3>

            {/* Premium Status Card */}
            <div className="p-6 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-pink-500/10 rounded-xl border border-yellow-500/30 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <Crown size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white">Premium Member</h4>
                            <p className="text-slate-300 text-sm">
                                {profileData.subscriptionType === 'yearly' 
                                    ? 'You have full access to all premium features'
                                    : 'Enjoying Monthly Premium benefits'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                            <div className="text-sm text-slate-400">Status</div>
                            <div className="flex items-center gap-1 text-green-400">
                                <CheckCircle size={16} />
                                <span className="font-semibold">Active</span>
                            </div>
                        </div>
                        {/* Check Plans Button for Premium Users */}
                        <button
                            onClick={() => navigate('/premium')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                            <Crown size={16} />
                            Check Plans
                        </button>
                    </div>
                </div>

                {/* Subscription Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-slate-400 text-sm mb-1">Plan Type</div>
                        <div className="text-white font-semibold capitalize">{profileData.subscriptionType || 'N/A'}</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-slate-400 text-sm mb-1">Started On</div>
                        <div className="text-white font-semibold">
                            {profileData.subscriptionStartDate 
                                ? new Date(profileData.subscriptionStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'N/A'}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-slate-400 text-sm mb-1">Expires On</div>
                        <div className="text-white font-semibold">
                            {profileData.subscriptionEndDate 
                                ? new Date(profileData.subscriptionEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Days Remaining Progress */}
                {profileData.subscriptionEndDate && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-300">Time Remaining</span>
                            <span className="text-cyan-400 font-semibold">
                                {Math.max(0, Math.ceil((new Date(profileData.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24)))} days
                            </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.max(0, Math.min(100, 
                                        ((new Date(profileData.subscriptionEndDate) - new Date()) / 
                                        (new Date(profileData.subscriptionEndDate) - new Date(profileData.subscriptionStartDate))) * 100
                                    ))}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Features List */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="text-cyan-400" size={20} />
                    Your Premium Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: Brain, title: 'AI-Powered Assistant', description: 'Unlimited access to AI code help' },
                        { icon: Code, title: '500+ Premium Problems', description: 'Exclusive FAANG-level challenges' },
                        { icon: Video, title: 'HD Video Solutions', description: 'Learn from expert explanations' },
                        { icon: Shield, title: 'Ad-Free Experience', description: 'Uninterrupted coding sessions' },
                        { icon: Target, title: 'Advanced Analytics', description: 'Detailed progress tracking' },
                        { icon: MessageSquare, title: 'Priority Support', description: '24/7 dedicated assistance' }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <feature.icon size={18} className="text-cyan-400" />
                            </div>
                            <div>
                                <h5 className="text-white font-medium text-sm">{feature.title}</h5>
                                <p className="text-slate-400 text-xs mt-1">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

         
            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-400" size={20} />
                    Payment Information
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                        <span className="text-slate-400">Order ID</span>
                        <span className="text-white font-mono text-sm">{profileData.orderId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                        <span className="text-slate-400">Payment ID</span>
                        <span className="text-white font-mono text-sm">{profileData.paymentId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-slate-400">Amount Paid</span>
                        <span className="text-green-400 font-semibold">
                            {profileData.subscriptionType === 'monthly' ? '₹1' : '₹2'}
                        </span>
                    </div>
                </div>
            </div>

           
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Brain size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-semibold">AI Chat Unlocked!</h4>
                        <p className="text-slate-300 text-sm">You can now use AI-powered code assistance for problem solving</p>
                    </div>
                    <a 
                        href="/problems" 
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Try Now
                    </a>
                </div>
            </div>
        </motion.div>
    );

    const renderTransactions = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Transaction History</h3>
            <p className="text-slate-400 text-sm mb-4">View your payment and subscription history.</p>
            
            {loadingTransactions ? (
                <div className="text-center py-8">
                    <div className="loading loading-spinner loading-lg text-cyan-500"></div>
                    <p className="text-slate-400 mt-4">Loading transactions...</p>
                </div>
            ) : transactions.length > 0 ? (
                <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                        <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <DollarSign size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{transaction.type}</div>
                                        <div className="text-slate-400 text-sm">{transaction.date}</div>
                                        {transaction.orderId && (
                                            <div className="text-slate-500 text-xs font-mono mt-1">Order: {transaction.orderId}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-green-400 font-semibold">{transaction.amount}</div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <CheckCircle size={14} className="text-green-400" />
                                        <span className="text-slate-400">{transaction.status}</span>
                                    </div>
                                    {transaction.planType && (
                                        <div className="text-slate-500 text-xs mt-1 capitalize">{transaction.planType} Plan</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
                    <DollarSign size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">No transactions yet</p>
                    <p className="text-slate-500 text-sm mt-2">Your payment history will appear here</p>
                </div>
            )}
        </motion.div>
    );

    const renderHelp = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Help & Support</h3>
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <p className="text-slate-400">Get quick answers from our automated assistant.</p>
                </div>

                
                <div className="flex flex-col h-[500px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleChatbotSubmit} className="p-4 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
                        />
                        <button type="submit" className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white">
                            <MessageSquare size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );

    const renderReports = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Reports</h3>
            <div className="space-y-4">
                {showSuccessMessage && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-green-200 font-medium">Report Submitted Successfully!</p>
                                <p className="text-green-300/80 text-sm">Thank you for your feedback.</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-6 bg-slate-800/50 rounded-xl">
                    <h4 className="text-white font-semibold mb-4">Report a Problem</h4>
                    <textarea
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        placeholder="Describe the issue you encountered..."
                        className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 resize-none"
                        rows={4}
                    />
                    <button
                        onClick={handleSubmitReport}
                        className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderComingSoon = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center py-16 bg-slate-800/50 rounded-xl border border-gray-700">
            <div className="flex flex-col items-center justify-center">
                <Settings size={64} className="mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                <p className="text-slate-400">This section is under development.</p>
            </div>
        </motion.div>
    );

    const renderContent = () => {
        if (!profileData) return null;
        switch (activeTab) {
            case 'basic-info': return renderBasicInfo();
            case 'account': return renderAccountInfo();
            case 'premium': return renderPremium();
            case 'privacy': return renderPrivacySettings();
            case 'notifications': return renderNotificationSettings();
            case 'achievements': return renderAchievements();
            case 'badges': return renderBadges();
            case 'points': return renderPoints();
            case 'transactions': return renderTransactions();
            case 'reports': return renderReports();
            case 'help': return renderHelp();
            case 'billing':
            case 'orders':
                return renderComingSoon();
            default:
                return null;
        }
    };

    const sidebarItems = [
        { id: 'basic-info', label: 'Basic Info', icon: User },
        { id: 'account', label: 'Account', icon: Settings },
        ...(profileData?.isPremium ? [{ id: 'premium', label: 'Premium', icon: Crown }] : []),
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'badges', label: 'Badges', icon: Award },
        { id: 'points', label: 'Points', icon: Star },
        { id: 'transactions', label: 'Transactions', icon: DollarSign },
        { id: 'reports', label: 'Reports', icon: Flag },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'orders', label: 'Orders', icon: FileText }
    ];

    if (authLoading || pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                <p className="ml-3 text-lg">Loading profile...</p>
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (fetchError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-red-500">
                <p className="text-xl mb-4 text-center">Error: {fetchError}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry Loading Profile</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
            <AnimatedProfileBackground />
            <Header />
            <main className="container mx-auto px-4 py-8 relative z-20">
                <motion.div
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center relative">
                            <User size={40} className="text-slate-400" />
                           
                            {profileData.isPremium && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    <Crown size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-white mb-1">{profileData.firstname}</h1>
                              
                                {profileData.isPremium && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full">
                                        <Crown size={14} className="text-yellow-400" />
                                        <span className="text-xs font-semibold text-yellow-400 uppercase">Premium</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-400">ID: {profileData._id}</p>
                          
                            {profileData.isPremium && profileData.subscriptionType && (
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <Sparkles size={14} className="text-cyan-400" />
                                    <span className="text-slate-300">
                                        {profileData.subscriptionType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
                                    </span>
                                    {profileData.subscriptionEndDate && (
                                        <span className="text-slate-500">
                                            • Expires {new Date(profileData.subscriptionEndDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sticky top-8 backdrop-blur-sm">
                            <nav className="space-y-2">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                            activeTab === item.id
                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-3">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;
