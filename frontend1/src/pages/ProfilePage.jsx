// import React, { useState, useEffect } from 'react';
// import { NavLink, Navigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axiosClient from '../utils/axiosClient'; // Assuming this is your configured Axios instance
// import { logoutUser } from '../authSlice'; // To handle logout from navbar

// // Helper function to capitalize first letter of each word
// const capitalizeWords = (str) => {
//     if (typeof str !== 'string' || !str) return '';
//     return str
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
// };

// function ProfilePage() {
//     const dispatch = useDispatch();
//     const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

//     const [profileData, setProfileData] = useState(null);
//     const [pageLoading, setPageLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('basicInfo'); // 'basicInfo', 'account', 'privacy', 'notifications'
    
//     // State for managing editable fields:
//     // `editingField` holds the path to the field being edited (e.g., 'firstname', 'profile.location')
//     const [editingField, setEditingField] = useState(null); 
//     // `tempValue` holds the current value in the input field during editing
//     const [tempValue, setTempValue] = useState(''); 

//     // Handler for editing any field
//     const handleEditClick = (fieldPath, currentValue) => {
//         setEditingField(fieldPath);
//         // Ensure tempValue is a string, handle null/undefined
//         setTempValue(currentValue === null || currentValue === undefined ? '' : currentValue); 
//     };

//     const handleSaveClick = async (fieldPath) => {
//         try {
//             // Special handling for Gender: Map 'Not provided' back to empty string for backend enum
//             let valueToSave = tempValue;
//             if (fieldPath === 'profile.gender') {
//                 valueToSave = tempValue === 'Not provided' ? '' : tempValue;
//             } else if (fieldPath === 'profile.birthday') {
//                 // Ensure birthday is saved as a Date object if the backend expects it
//                 valueToSave = tempValue ? new Date(tempValue) : null;
//             }

//             const res = await axiosClient.put('/api/profile/field', {
//                 field: fieldPath,
//                 value: valueToSave
//             });
//             // Update local state with the new user data from response
//             setProfileData(res.data.user); 
//             setEditingField(null); // Exit editing mode
//             setTempValue('');
//         } catch (err) {
//             console.error('Error updating field:', fieldPath, err);
//             alert(`Failed to update ${fieldPath.split('.').pop()}: ${err.response?.data?.message || err.message}`);
//         }
//     };

//     const handleCancelClick = () => {
//         setEditingField(null);
//         setTempValue('');
//     };

//     // Helper to render an editable input or text for basic info fields
//     const renderEditableField = (fieldPath, displayValue, inputType = 'text', options = []) => {
//         const isEditing = editingField === fieldPath;

//         return (
//             <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
//                 <span className="text-gray-400 text-md min-w-[120px]">{capitalizeWords(fieldPath.split('.').pop().replace(/([A-Z])/g, ' $1').trim())}</span>
//                 <div className="flex-1 w-full max-w-lg flex flex-col items-start md:items-center md:flex-row gap-2">
//                     {isEditing ? (
//                         inputType === 'textarea' ? (
//                             <textarea
//                                 className="textarea textarea-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow"
//                                 value={tempValue}
//                                 onChange={(e) => setTempValue(e.target.value)}
//                                 rows="3"
//                                 placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
//                             ></textarea>
//                         ) : inputType === 'select' ? (
//                             <select
//                                 className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full max-w-[200px]"
//                                 value={tempValue}
//                                 onChange={(e) => setTempValue(e.target.value)}
//                             >
//                                 {options.map((opt) => (
//                                     <option key={opt} value={opt}>{opt}</option>
//                                 ))}
//                             </select>
//                         ) : (
//                             <input
//                                 type={inputType}
//                                 className="input input-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow"
//                                 value={tempValue}
//                                 onChange={(e) => setTempValue(e.target.value)}
//                                 placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
//                             />
//                         )
//                     ) : (
//                         <span className="text-gray-300 flex-grow py-2">{displayValue || 'Not provided'}</span>
//                     )}
//                     <div className="flex gap-2 mt-2 md:mt-0">
//                         {isEditing ? (
//                             <>
//                                 <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handleSaveClick(fieldPath)}>Save</button>
//                                 <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={handleCancelClick}>Cancel</button>
//                             </>
//                         ) : (
//                             <button
//                                 className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700"
//                                 onClick={() => handleEditClick(fieldPath, displayValue === 'Not provided' ? '' : displayValue)}
//                             >
//                                 Edit
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         );
//     };


//     // Fetch user profile data on component mount
//     useEffect(() => {
//         const fetchProfileData = async () => {
//             try {
//                 setPageLoading(true);
//                 const res = await axiosClient.get('/api/profile');
//                 setProfileData(res.data);
//                 // Initialize notification and privacy settings for their respective tabs
//                 // Ensure default structure if settings or sub-objects are missing
//                 setNotificationSettings(res.data.settings?.notifications || {
//                     importantAnnouncements: { email: true, site: false },
//                     featureAnnouncements: { email: true, site: false },
//                     awardNotification: { email: true, site: true },
//                     globalRanking: { email: false, site: true },
//                     contestBadge: { email: false, site: true },
//                     contestAnnouncements: { email: true, site: true },
//                     newComment: { email: false, site: true },
//                     otherNotifications: { email: true, site: false },
//                     promotions: { email: true, site: false },
//                     weeklyRecommendations: { email: true, site: false },
//                 });
//                 setPrivacySettings(res.data.settings?.privacy || {
//                     contactByCompanies: true,
//                     joinStudyPlanLeaderboard: true,
//                     displaySubmissionHistory: true,
//                 });
//             } catch (err) {
//                 console.error('Error fetching profile data:', err);
//                 alert('Failed to load profile data. Please try again.');
//             } finally {
//                 setPageLoading(false);
//             }
//         };

//         if (isAuthenticated && !authLoading) {
//             fetchProfileData();
//         }

//     }, [isAuthenticated, authLoading]);

//     // Notification settings state and handler
//     const [notificationSettings, setNotificationSettings] = useState({});
//     const handleNotificationChange = async (setting, type, checked) => {
//         try {
//             const res = await axiosClient.put('/api/profile/settings/notifications', {
//                 setting,
//                 type,
//                 value: checked
//             });
//             // Update the specific setting in the state based on backend response
//             setNotificationSettings(prev => ({
//                 ...prev,
//                 [setting]: {
//                     ...prev[setting],
//                     [type]: checked
//                 }
//             }));
//         } catch (err) {
//             console.error('Error updating notification setting:', err);
//             alert('Failed to update notification setting.');
//         }
//     };

//     // Privacy settings state and handler
//     const [privacySettings, setPrivacySettings] = useState({});
//     const [editingPrivacyField, setEditingPrivacyField] = useState(null); // Tracks which privacy field is being edited
//     const handlePrivacyChange = async (field, value) => {
//         try {
//             const booleanValue = value === 'Yes'; // Convert 'Yes'/'No' to boolean
//             const res = await axiosClient.put('/api/profile/settings/privacy', {
//                 field,
//                 value: booleanValue
//             });
//             setPrivacySettings(prev => ({
//                 ...prev,
//                 [field]: booleanValue
//             }));
//             setEditingPrivacyField(null); // Exit editing mode for this field
//             setTempValue(''); // Clear temp value
//         } catch (err) {
//             console.error('Error updating privacy setting:', err);
//             alert('Failed to update privacy setting.');
//         }
//     };

//     // Render functions for different tabs
//     const renderAccountInfo = () => {
//         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

//         return (
//             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
//                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Account Information</h3>
//                 <div className="space-y-6">
//                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
//                         <div className="flex-1">
//                             <p className="text-gray-400 text-sm mb-1"> ID</p>
//                             {/* Derive a LeetCode-like ID from user data */}
//                             <p className="text-white text-lg">{profileData.firstname.toLowerCase() + profileData._id.slice(0, 5)}</p>
//                         </div>
//                         {/* Edit button for LeetCode ID is static as it's often not truly editable username */}
//                         <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700 mt-2 md:mt-0" disabled>Edit</button>
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
//                         <div className="flex-1">
//                             <p className="text-gray-400 text-sm mb-1">Email</p>
//                             <p className="text-white text-lg">{profileData.emailId} <span className="badge badge-success bg-emerald-500 text-white border-transparent ml-2">Primary</span></p>
//                         </div>
//                         <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700 mt-2 md:mt-0" disabled>Edit</button> {/* Email typically not editable this way */}
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
//                         <div className="flex-1">
//                             <p className="text-gray-400 text-sm mb-1">Password</p>
//                             <p className="text-indigo-400 text-lg hover:underline cursor-pointer">Change Password</p>
//                         </div>
//                     </div>
//                 </div>

//                 <h3 className="text-2xl font-bold text-white mt-8 mb-6 border-b border-gray-700 pb-4">Social Account</h3>
//                 <div className="space-y-4">
//                     {/* These are static as per the requirement; full OAuth integration is outside scope */}
//                     {['LinkedIn', 'Google', 'Github', 'Facebook'].map(platform => (
//                         <div key={platform} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
//                             <div className="flex items-center">
//                                 {/* Simple text as placeholder for icons */}
//                                 <span className={`mr-3 text-2xl font-bold ${platform === 'LinkedIn' ? 'text-blue-500' : platform === 'Google' ? 'text-red-500' : platform === 'Github' ? 'text-gray-400' : 'text-blue-600'}`}>
//                                     {platform === 'LinkedIn' && 'in'}
//                                     {platform === 'Google' && 'G'}
//                                     {platform === 'Github' && 'Gh'}
//                                     {platform === 'Facebook' && 'f'}
//                                 </span>
//                                 <p className="text-white text-lg">{platform}</p>
//                             </div>
//                             <div className="flex items-center gap-4">
//                                 <span className="text-gray-400">Not Connected</span>
//                                 <span className="text-green-400">+10</span> {/* Static points display */}
//                                 <button className="btn btn-sm btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">Connect</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <button className="btn btn-error bg-red-600 hover:bg-red-700 border-red-600 text-white mt-10 px-8 py-3 rounded-xl shadow-lg">
//                     Delete Account
//                 </button>
//             </div>
//         );
//     };

//     const renderPrivacySettings = () => {
//         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

//         const privacyFields = [
//             {
//                 field: 'contactByCompanies',
//                 label: 'Can companies contact you with job opportunities?',
//                 description: 'We will only send your contact information to interested partner companies to connect you with job opportunities. We respect your privacy and will never give or sell your personal information to third parties without your explicit consent.',
//                 currentValue: privacySettings.contactByCompanies
//             },
//             {
//                 field: 'joinStudyPlanLeaderboard',
//                 label: 'Join study plan leaderboard',
//                 description: 'Will no longer join the leaderboard after turning off, the changes will be applied at the start of each week.',
//                 currentValue: privacySettings.joinStudyPlanLeaderboard
//             },
//             {
//                 field: 'displaySubmissionHistory',
//                 label: 'Display my submission history',
//                 description: 'After closing, your submission history data and information will not be displayed on your profile page to others.',
//                 currentValue: privacySettings.displaySubmissionHistory
//             }
//         ];

//         return (
//             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
//                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Privacy</h3>
//                 <div className="space-y-8">
//                     {privacyFields.map(({ field, label, description, currentValue }) => (
//                         <div key={field} className="flex flex-col lg:flex-row lg:items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
//                             <div className="flex-1 pr-4 mb-4 lg:mb-0">
//                                 <p className="text-white text-lg font-medium">{label}</p>
//                                 <p className="text-gray-400 text-sm mt-1">{description}</p>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 {editingPrivacyField === field ? (
//                                     <>
//                                         <select
//                                             className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 w-24"
//                                             value={tempValue}
//                                             onChange={(e) => setTempValue(e.target.value)}
//                                         >
//                                             <option value="Yes">Yes</option>
//                                             <option value="No">No</option>
//                                         </select>
//                                         <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handlePrivacyChange(field, tempValue)}>Save</button>
//                                         <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(null); setTempValue(''); }}>Cancel</button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <span className="text-gray-300 font-semibold">{currentValue ? 'Yes' : 'No'}</span>
//                                         <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(field); setTempValue(currentValue ? 'Yes' : 'No'); }}>Edit</button>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     const renderNotificationSettings = () => {
//         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

//         const notificationCategories = {
//             Announcements: ['importantAnnouncements', 'featureAnnouncements'],
//             Award: ['awardNotification'],
//             Contest: ['globalRanking', 'contestBadge', 'contestAnnouncements'],
//             Discuss: ['newComment'],
//             Other: ['otherNotifications'],
//             Promotions: ['promotions'],
//             'Weekly Email': ['weeklyRecommendations']
//         };

//         const renderCheckboxRow = (settingKey, label) => (
//             <tr key={settingKey} className="border-b border-gray-700/50 last:border-none">
//                 <td className="py-3 px-4 text-white text-md font-medium">{label}</td>
//                 <td className="py-3 px-4 text-center">
//                     <input
//                         type="checkbox"
//                         className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
//                         checked={notificationSettings[settingKey]?.email || false}
//                         onChange={(e) => handleNotificationChange(settingKey, 'email', e.target.checked)}
//                     />
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                     <input
//                         type="checkbox"
//                         className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
//                         checked={notificationSettings[settingKey]?.site || false}
//                         onChange={(e) => handleNotificationChange(settingKey, 'site', e.target.checked)}
//                     />
//                 </td>
//             </tr>
//         );

//         return (
//             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
//                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Notifications</h3>
//                 <div className="overflow-x-auto">
//                     <table className="table w-full text-slate-200">
//                         <thead>
//                             <tr className="border-b border-gray-700 bg-gray-700/50">
//                                 <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300"></th>
//                                 <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Email</th>
//                                 <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Site</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Object.entries(notificationCategories).map(([category, settings]) => (
//                                 <React.Fragment key={category}>
//                                     <tr>
//                                         <td colSpan="3" className="py-4 px-4 text-gray-400 font-bold uppercase text-sm border-b border-gray-700/50 bg-gray-800/60">{category}</td>
//                                     </tr>
//                                     {settings.map(settingKey => renderCheckboxRow(settingKey, capitalizeWords(settingKey.replace(/([A-Z])/g, ' $1').trim())))}
//                                 </React.Fragment>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     };


//     if (authLoading || pageLoading || !profileData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
//                 <span className="loading loading-spinner loading-lg text-indigo-500"></span>
//                 <p className="ml-3 text-lg">Loading profile...</p>
//             </div>
//         );
//     }

//     if (!isAuthenticated) {
//         // This should primarily be handled by App.js's route protection
//         return <Navigate to="/login" />;
//     }

//     // Determine the user's display name for the header (e.g., LeetCode ID style)
//     const displayLeetcodeId = user?.firstname ? user.firstname.toLowerCase() + user.id.slice(0, 5) : 'unknownid12345';


//     return (
//         <div className="min-h-screen bg-slate-950 text-slate-200 font-sans"
//             style={{
//                 backgroundImage: `
//                     radial-gradient(circle at 1% 90%, rgba(99, 102, 241, 0.08), transparent 50%),
//                     radial-gradient(circle at 99% 10%, rgba(139, 92, 246, 0.07), transparent 45%),
//                     radial-gradient(circle at 40% 100%, rgba(236, 72, 153, 0.04), transparent 60%),
//                     radial-gradient(circle at 60% 0%, rgba(59, 130, 246, 0.03), transparent 70%)
//                 `,
//                 backgroundAttachment: 'fixed',
//             }}>
//             {/* Inline styles for custom animations */}
//             <style>
//                 {`
//                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//                 .animate-fade-in { animation: fadeIn 0.5s ease-in forwards; }
//                 @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//                 .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
//                 @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
//                 .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
//                 .loading-spinner { animation: spin 0.8s linear infinite; }
//                 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//                 `}
//             </style>

//             {/* Navbar (reusing from Homepage for consistency, simplified) */}
//             <nav className="navbar sticky top-0 z-50 backdrop-blur-lg bg-gray-900/70 px-6 border-b border-gray-700 shadow-md">
//                 <div className="flex-1">
//                     <NavLink to="/" className="btn btn-ghost normal-case text-3xl font-bold text-transparent bg-clip-text"
//                         style={{ backgroundImage: 'linear-gradient(to right, #6366F1, #EC4899)', textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
//                         CoderWorld<span className="text-xl opacity-70">.dev</span>
//                     </NavLink>
//                 </div>
//                 <div className="flex-none">
//                     <div className="dropdown dropdown-end ml-4">
//                         <div tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-indigo-500 ring-offset-gray-900 ring-offset-2 hover:scale-105 transition-transform duration-200 shadow-lg">
//                             <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
//                                 style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}>
//                                 <span className="text-lg font-bold">{user?.firstname?.charAt(0).toUpperCase() || '?'}</span>
//                             </div>
//                         </div>
//                         <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow-xl menu bg-gray-800 rounded-box w-52 z-[60] border border-gray-700 backdrop-blur-md">
//                             <li><NavLink to="/profile" className="hover:bg-indigo-500/20 py-2">Profile</NavLink></li>
//                             {user?.role === 'admin' && <li><NavLink to="/admin" className="hover:bg-indigo-500/20 py-2">Admin Panel</NavLink></li>}
//                             <div className="divider my-1 h-px bg-gray-700" />
//                             <li><button onClick={() => dispatch(logoutUser())} className="text-red-400 hover:bg-red-400/20 py-2">Logout</button></li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>

//             {/* Main Profile Content Area */}
//             <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
//                 {/* Left Sidebar */}
//                 <div className="w-full lg:w-1/4 bg-gray-900/50 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center sticky top-28 h-fit animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
//                     <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl text-gray-400 border-4 border-indigo-500 mb-4">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
//                             <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
//                         </svg>
//                     </div>
//                     <h2 className="text-2xl font-bold text-white mb-1">{profileData?.firstname || 'Guest User'}</h2>
//                     <p className="text-gray-400 text-sm mb-6"> ID: <span className="text-indigo-400">{displayLeetcodeId}</span></p>

//                     {/* Navigation Links */}
//                     <ul className="menu w-full space-y-2">
//                         <li>
//                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'basicInfo' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
//                                 onClick={() => setActiveTab('basicInfo')}>
//                                 Basic Info
//                             </button>
//                         </li>
//                         <li>
//                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
//                                 onClick={() => setActiveTab('account')}>
//                                 Account
//                             </button>
//                         </li>
//                         <li>
//                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
//                                 onClick={() => setActiveTab('privacy')}>
//                                 Privacy
//                             </button>
//                         </li>
//                         <li>
//                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
//                                 onClick={() => setActiveTab('notifications')}>
//                                 Notifications
//                             </button>
//                         </li>
//                         {/* Other static menu items as per screenshot */}
//                         <li>
//                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
//                                 Points
//                             </a>
//                         </li>
//                         <li>
//                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
//                                 Lab
//                             </a>
//                         </li>
//                         <li>
//                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
//                                 Billing <span className="badge badge-sm badge-info text-blue-200 bg-blue-700/50 border-blue-600/50 ml-auto">New</span>
//                             </a>
//                         </li>
//                         <li>
//                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
//                                 Orders <span className="badge badge-sm badge-warning text-yellow-200 bg-yellow-700/50 border-yellow-600/50 ml-auto">Beta</span>
//                             </a>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Right Content Area (Dynamically rendered based on activeTab) */}
//                 <div className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
//                     {activeTab === 'basicInfo' && (
//                         <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
//                             <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Basic Info</h3>
//                             <div className="space-y-6">
//                                 {/* Name */}
//                                 {renderEditableField('firstname', profileData.firstname)}

//                                 {/* Gender */}
//                                 {renderEditableField('profile.gender', profileData.profile?.gender || 'Not provided', 'select', ['Not provided', 'Male', 'Female', 'Other'])}

//                                 {/* Location */}
//                                 {renderEditableField('profile.location', profileData.profile?.location)}

//                                 {/* Birthday */}
//                                 {renderEditableField('profile.birthday', profileData.profile?.birthday ? new Date(profileData.profile.birthday).toISOString().split('T')[0] : '', 'date')}

//                                 {/* Summary */}
//                                 {renderEditableField('profile.summary', profileData.profile?.summary, 'textarea')}

//                                 {/* Website */}
//                                 {renderEditableField('profile.website', profileData.profile?.website)}

//                                 {/* Github */}
//                                 {renderEditableField('profile.github', profileData.profile?.github)}

//                                 {/* LinkedIn */}
//                                 {renderEditableField('profile.linkedin', profileData.profile?.linkedin)}

//                                 {/* X (formerly Twitter) */}
//                                 {renderEditableField('profile.twitter', profileData.profile?.twitter)}

//                                 {/* Experience */}
//                                 <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Experience</h4>
//                                 {renderEditableField('profile.work', profileData.profile?.work)}
//                                 {renderEditableField('profile.education', profileData.profile?.education)}

//                                 {/* Skills */}
//                                 <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Skills</h4>
//                                 {renderEditableField('profile.skills', profileData.profile?.skills)}
//                             </div>
//                         </div>
//                     )}

//                     {activeTab === 'account' && renderAccountInfo()}
//                     {activeTab === 'privacy' && renderPrivacySettings()}
//                     {activeTab === 'notifications' && renderNotificationSettings()}

//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProfilePage;

// // import React, { useState, useEffect, useCallback } from 'react';
// // import { NavLink, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import axiosClient from '../utils/axiosClient';
// // import { logoutUser } from '../authSlice';
// // import toast from 'react-hot-toast'; // For notifications
// // import ChangePasswordModal from '../components/ChangePasswordModal'; // NEW: Import the modal


// // // Helper function to capitalize first letter of each word (and handle camelCase)
// // const capitalizeWords = (str) => {
// //     if (typeof str !== 'string' || !str) return '';
// //     return str
// //         .replace(/([A-Z])/g, ' $1') // Add space before capital letters
// //         .split(' ')
// //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //         .join(' ');
// // };

// // function ProfilePage() {
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();
// //     const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

// //     const [profileData, setProfileData] = useState(null);
// //     const [pageLoading, setPageLoading] = useState(true);
// //     const [activeTab, setActiveTab] = useState('basicInfo'); // 'basicInfo', 'account', 'privacy', 'notifications'

// //     // State for managing editable fields (Basic Info, Experience, Skills)
// //     const [editingField, setEditingField] = useState(null);
// //     const [tempValue, setTempValue] = useState('');

// //     // State for managing settings (Privacy, Notifications)
// //     const [notificationSettings, setNotificationSettings] = useState({});
// //     const [privacySettings, setPrivacySettings] = useState({});
// //     const [editingPrivacyField, setEditingPrivacyField] = useState(null);

// //     // Modals state
// //     const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
// //     const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] = useState(false);

// //     // Fetch user profile data on component mount
// //     const fetchProfileData = useCallback(async () => {
// //         try {
// //             setPageLoading(true);
// //             const res = await axiosClient.get('/api/profile');
// //             setProfileData(res.data);
            
// //             // Initialize notification and privacy settings with fetched data or sensible defaults
// //             setNotificationSettings(res.data.settings?.notifications || {
// //                 importantAnnouncements: { email: true, site: false },
// //                 featureAnnouncements: { email: true, site: false },
// //                 awardNotification: { email: true, site: true },
// //                 globalRanking: { email: false, site: true },
// //                 contestBadge: { email: false, site: true },
// //                 contestAnnouncements: { email: true, site: true },
// //                 newComment: { email: false, site: true },
// //                 otherNotifications: { email: true, site: false },
// //                 promotions: { email: true, site: false },
// //                 weeklyRecommendations: { email: true, site: false },
// //             });
// //             setPrivacySettings(res.data.settings?.privacy || {
// //                 contactByCompanies: true,
// //                 joinStudyPlanLeaderboard: true,
// //                 displaySubmissionHistory: true,
// //             });
// //             toast.success('Profile data loaded.');
// //         } catch (err) {
// //             console.error('Error fetching profile data:', err);
// //             toast.error(`Failed to load profile: ${err.response?.data?.message || err.message}`);
// //             // If fetching fails, especially due to auth, redirect to login
// //             if (err.response?.status === 401 || err.response?.status === 403) {
// //                 dispatch(logoutUser());
// //                 navigate('/login');
// //             }
// //         } finally {
// //             setPageLoading(false);
// //         }
// //     }, [dispatch, navigate]);

// //     useEffect(() => {
// //         if (isAuthenticated && !authLoading) {
// //             fetchProfileData();
// //         }
// //     }, [isAuthenticated, authLoading, fetchProfileData]);

// //     // Handle editing any profile field (Basic Info, Experience, Skills)
// //     const handleEditClick = (fieldPath, currentValue) => {
// //         setEditingField(fieldPath);
// //         // Ensure tempValue is a string, handle null/undefined/Date objects for input fields
// //         if (fieldPath === 'profile.birthday' && currentValue) {
// //             setTempValue(new Date(currentValue).toISOString().split('T')[0]);
// //         } else {
// //             setTempValue(currentValue === null || currentValue === undefined ? '' : String(currentValue));
// //         }
// //     };

// //     const handleSaveClick = async (fieldPath) => {
// //         try {
// //             let valueToSave = tempValue;
// //             // Special handling for Gender: Map 'Not provided' back to empty string for backend enum
// //             if (fieldPath === 'profile.gender') {
// //                 valueToSave = tempValue === 'Not provided' ? '' : tempValue;
// //             } else if (fieldPath === 'profile.birthday') {
// //                 // Ensure birthday is saved as a Date object or null if empty
// //                 valueToSave = tempValue ? new Date(tempValue) : null;
// //             } else if (fieldPath === 'profile.skills') {
// //                 // Assuming skills is a comma-separated string that should be stored as such
// //                 // If it needs to be an array on backend, you'd convert here: valueToSave = tempValue.split(',').map(s => s.trim());
// //             }

// //             const res = await axiosClient.put('/api/profile/field', {
// //                 field: fieldPath,
// //                 value: valueToSave
// //             });
// //             // Update local state with the new user data from response
// //             setProfileData(res.data.user);
// //             setEditingField(null); // Exit editing mode
// //             setTempValue('');
// //             toast.success(`Updated ${capitalizeWords(fieldPath.split('.').pop())}!`);
// //         } catch (err) {
// //             console.error('Error updating field:', fieldPath, err);
// //             toast.error(`Failed to update ${capitalizeWords(fieldPath.split('.').pop())}: ${err.response?.data?.message || err.message}`);
// //         }
// //     };

// //     const handleCancelClick = () => {
// //         setEditingField(null);
// //         setTempValue('');
// //     };

// //     // Helper to render an editable input or text for basic info fields
// //     const renderEditableField = (fieldPath, displayValue, inputType = 'text', options = []) => {
// //         const isEditing = editingField === fieldPath;
// //         const actualDisplayValue = (displayValue === null || displayValue === undefined || String(displayValue).trim() === '') 
// //             ? 'Not provided' 
// //             : String(displayValue);

// //         return (
// //             <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-700/50">
// //                 <span className="text-gray-400 text-sm font-semibold min-w-[120px] mb-2 md:mb-0">
// //                     {capitalizeWords(fieldPath.split('.').pop().replace(/([A-Z])/g, ' $1').trim())}
// //                 </span>
// //                 <div className="flex-1 w-full max-w-lg flex items-center gap-2">
// //                     {isEditing ? (
// //                         inputType === 'textarea' ? (
// //                             <textarea
// //                                 className="textarea textarea-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow text-sm min-h-[60px]"
// //                                 value={tempValue}
// //                                 onChange={(e) => setTempValue(e.target.value)}
// //                                 rows="2"
// //                                 placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
// //                             ></textarea>
// //                         ) : inputType === 'select' ? (
// //                             <select
// //                                 className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full max-w-[200px] text-sm"
// //                                 value={tempValue}
// //                                 onChange={(e) => setTempValue(e.target.value)}
// //                             >
// //                                 {options.map((opt) => (
// //                                     <option key={opt} value={opt}>{opt}</option>
// //                                 ))}
// //                             </select>
// //                         ) : (
// //                             <input
// //                                 type={inputType}
// //                                 className="input input-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow text-sm"
// //                                 value={tempValue}
// //                                 onChange={(e) => setTempValue(e.target.value)}
// //                                 placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
// //                             />
// //                         )
// //                     ) : (
// //                         <span className="text-gray-300 flex-grow py-2 text-sm">{actualDisplayValue}</span>
// //                     )}
// //                     <div className="flex gap-2 min-w-[140px] justify-end">
// //                         {isEditing ? (
// //                             <>
// //                                 <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handleSaveClick(fieldPath)}>Save</button>
// //                                 <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={handleCancelClick}>Cancel</button>
// //                             </>
// //                         ) : (
// //                             <button
// //                                 className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700"
// //                                 onClick={() => handleEditClick(fieldPath, displayValue)}
// //                             >
// //                                 Edit
// //                             </button>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     };

// //     // Notification settings handler
// //     const handleNotificationChange = async (setting, type, checked) => {
// //         try {
// //             const res = await axiosClient.put('/api/profile/settings/notifications', {
// //                 setting,
// //                 type,
// //                 value: checked
// //             });
// //             setNotificationSettings(prev => ({
// //                 ...prev,
// //                 [setting]: {
// //                     ...prev[setting],
// //                     [type]: checked
// //                 }
// //             }));
// //             toast.success('Notification settings updated!');
// //         } catch (err) {
// //             console.error('Error updating notification setting:', err);
// //             toast.error(`Failed to update notification setting: ${err.response?.data?.message || err.message}`);
// //         }
// //     };

// //     // Privacy settings handler
// //     const handlePrivacyChange = async (field, value) => {
// //         try {
// //             const booleanValue = value === 'Yes'; // Convert 'Yes'/'No' to boolean
// //             const res = await axiosClient.put('/api/profile/settings/privacy', {
// //                 field,
// //                 value: booleanValue
// //             });
// //             setPrivacySettings(prev => ({
// //                 ...prev,
// //                 [field]: booleanValue
// //             }));
// //             setEditingPrivacyField(null); // Exit editing mode for this field
// //             setTempValue(''); // Clear temp value
// //             toast.success('Privacy settings updated!');
// //         } catch (err) {
// //             console.error('Error updating privacy setting:', err);
// //             toast.error(`Failed to update privacy setting: ${err.response?.data?.message || err.message}`);
// //         }
// //     };

// //     const handleDeleteAccount = async () => {
// //         try {
// //             const res = await axiosClient.delete('/auth/profile'); // Using the /auth/profile route for self-delete
// //             dispatch(logoutUser()); // Log out user after deletion
// //             toast.success(res.data.message || 'Your account has been deleted successfully.');
// //             navigate('/signup'); // Redirect to signup/login page
// //         } catch (err) {
// //             console.error('Error deleting account:', err);
// //             toast.error(`Failed to delete account: ${err.response?.data?.message || err.message}`);
// //         } finally {
// //             setShowDeleteAccountConfirmation(false); // Close confirmation modal
// //         }
// //     };

// //     // Render functions for different tabs
// //     const renderAccountInfo = () => {
// //         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

// //         return (
// //             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
// //                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Account Information</h3>
// //                 <div className="space-y-6">
// //                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
// //                         <div className="flex-1">
// //                             <p className="text-gray-400 text-sm mb-1">LeetCode ID</p>
// //                             <p className="text-white text-lg">{user?.firstname?.toLowerCase() + user?.id?.slice(0, 5) || 'N/A'}</p>
// //                         </div>
// //                         <button className="btn btn-ghost btn-sm text-gray-500 mt-2 md:mt-0" disabled>Edit</button>
// //                     </div>

// //                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
// //                         <div className="flex-1">
// //                             <p className="text-gray-400 text-sm mb-1">Email</p>
// //                             <p className="text-white text-lg">{profileData.emailId} <span className="badge badge-success bg-emerald-500 text-white border-transparent ml-2">Primary</span></p>
// //                         </div>
// //                         <button className="btn btn-ghost btn-sm text-gray-500 mt-2 md:mt-0" disabled>Edit</button>
// //                     </div>

// //                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
// //                         <div className="flex-1">
// //                             <p className="text-gray-400 text-sm mb-1">Password</p>
// //                             <button 
// //                                 className="text-indigo-400 text-lg hover:underline cursor-pointer btn btn-ghost btn-sm p-0 h-auto min-h-0"
// //                                 onClick={() => setShowChangePasswordModal(true)}
// //                             >
// //                                 Change Password
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <h3 className="text-2xl font-bold text-white mt-8 mb-6 border-b border-gray-700 pb-4">Social Account</h3>
// //                 <div className="space-y-4">
// //                     {['LinkedIn', 'Google', 'Github', 'Facebook'].map(platform => (
// //                         <div key={platform} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
// //                             <div className="flex items-center">
// //                                 <span className={`mr-3 text-2xl font-bold
// //                                     ${platform === 'LinkedIn' ? 'text-blue-500' :
// //                                       platform === 'Google' ? 'text-red-500' :
// //                                       platform === 'Github' ? 'text-gray-400' : 'text-blue-600'}`}
// //                                 >
// //                                     {platform === 'LinkedIn' && <i className="fab fa-linkedin"></i>} {/* Placeholder for icons */}
// //                                     {platform === 'Google' && <i className="fab fa-google"></i>}
// //                                     {platform === 'Github' && <i className="fab fa-github"></i>}
// //                                     {platform === 'Facebook' && <i className="fab fa-facebook"></i>}
// //                                 </span>
// //                                 <p className="text-white text-lg">{platform}</p>
// //                             </div>
// //                             <div className="flex items-center gap-4">
// //                                 <span className="text-gray-400">Not Connected</span>
// //                                 <span className="text-green-400 font-bold">+10</span>
// //                                 <button className="btn btn-sm btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">Connect</button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 <button
// //                     className="btn btn-error bg-red-600 hover:bg-red-700 border-red-600 text-white mt-10 px-8 py-3 rounded-xl shadow-lg"
// //                     onClick={() => setShowDeleteAccountConfirmation(true)}
// //                 >
// //                     Delete Account
// //                 </button>
// //             </div>
// //         );
// //     };

// //     const renderPrivacySettings = () => {
// //         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

// //         const privacyFields = [
// //             {
// //                 field: 'contactByCompanies',
// //                 label: 'Can companies contact you with job opportunities?',
// //                 description: 'We will only send your contact information to interested partner companies to connect you with job opportunities. We respect your privacy and will never give or sell your personal information to third parties without your explicit consent.',
// //                 currentValue: privacySettings.contactByCompanies
// //             },
// //             {
// //                 field: 'joinStudyPlanLeaderboard',
// //                 label: 'Join study plan leaderboard',
// //                 description: 'Will no longer join the leaderboard after turning off, the changes will be applied at the start of each week.',
// //                 currentValue: privacySettings.joinStudyPlanLeaderboard
// //             },
// //             {
// //                 field: 'displaySubmissionHistory',
// //                 label: 'Display my submission history',
// //                 description: 'After closing, your submission history data and information will not be displayed on your profile page to others.',
// //                 currentValue: privacySettings.displaySubmissionHistory
// //             }
// //         ];

// //         return (
// //             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
// //                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Privacy</h3>
// //                 <div className="space-y-8">
// //                     {privacyFields.map(({ field, label, description, currentValue }) => (
// //                         <div key={field} className="flex flex-col lg:flex-row lg:items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
// //                             <div className="flex-1 pr-4 mb-4 lg:mb-0">
// //                                 <p className="text-white text-lg font-medium">{label}</p>
// //                                 <p className="text-gray-400 text-sm mt-1">{description}</p>
// //                             </div>
// //                             <div className="flex items-center gap-2 min-w-[140px] justify-end">
// //                                 {editingPrivacyField === field ? (
// //                                     <>
// //                                         <select
// //                                             className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 w-24 text-sm"
// //                                             value={tempValue}
// //                                             onChange={(e) => setTempValue(e.target.value)}
// //                                         >
// //                                             <option value="Yes">Yes</option>
// //                                             <option value="No">No</option>
// //                                         </select>
// //                                         <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handlePrivacyChange(field, tempValue)}>Save</button>
// //                                         <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(null); setTempValue(''); }}>Cancel</button>
// //                                     </>
// //                                 ) : (
// //                                     <>
// //                                         <span className="text-gray-300 font-semibold text-sm">{currentValue ? 'Yes' : 'No'}</span>
// //                                         <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(field); setTempValue(currentValue ? 'Yes' : 'No'); }}>Edit</button>
// //                                     </>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const renderNotificationSettings = () => {
// //         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

// //         const notificationCategories = {
// //             Announcements: ['importantAnnouncements', 'featureAnnouncements'],
// //             Award: ['awardNotification'],
// //             Contest: ['globalRanking', 'contestBadge', 'contestAnnouncements'],
// //             Discuss: ['newComment'],
// //             Other: ['otherNotifications'],
// //             Promotions: ['promotions'],
// //             'Weekly Email': ['weeklyRecommendations']
// //         };

// //         const renderCheckboxRow = (settingKey, label) => (
// //             <tr key={settingKey} className="border-b border-gray-700/50 last:border-none">
// //                 <td className="py-3 px-4 text-white text-sm font-medium">{label}</td>
// //                 <td className="py-3 px-4 text-center">
// //                     <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
// //                         checked={notificationSettings[settingKey]?.email || false}
// //                         onChange={(e) => handleNotificationChange(settingKey, 'email', e.target.checked)}
// //                     />
// //                 </td>
// //                 <td className="py-3 px-4 text-center">
// //                     <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
// //                         checked={notificationSettings[settingKey]?.site || false}
// //                         onChange={(e) => handleNotificationChange(settingKey, 'site', e.target.checked)}
// //                     />
// //                 </td>
// //             </tr>
// //         );

// //         return (
// //             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
// //                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Notifications</h3>
// //                 <div className="overflow-x-auto">
// //                     <table className="table w-full text-slate-200">
// //                         <thead>
// //                             <tr className="border-b border-gray-700 bg-gray-700/50">
// //                                 <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 rounded-tl-xl"></th>
// //                                 <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Email</th>
// //                                 <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300 rounded-tr-xl">Site</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {Object.entries(notificationCategories).map(([category, settings]) => (
// //                                 <React.Fragment key={category}>
// //                                     <tr>
// //                                         <td colSpan="3" className="py-4 px-4 text-gray-400 font-bold uppercase text-xs border-b border-gray-700/50 bg-gray-800/60">{category}</td>
// //                                     </tr>
// //                                     {settings.map(settingKey => renderCheckboxRow(settingKey, capitalizeWords(settingKey.replace(/([A-Z])/g, ' $1').replace('Id', ' ID').trim())))}
// //                                 </React.Fragment>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         );
// //     };


// //     if (authLoading || pageLoading || !profileData) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
// //                 <span className="loading loading-spinner loading-lg text-indigo-500"></span>
// //                 <p className="ml-3 text-lg">Loading profile...</p>
// //             </div>
// //         );
// //     }

// //     // Determine the user's display name for the header (e.g., LeetCode ID style)
// //     const displayLeetcodeId = user?.firstname ? user.firstname.toLowerCase() + user.id.slice(0, 5) : 'unknownid12345';

// //     return (
// //         <div className="min-h-screen bg-slate-950 text-slate-200 font-sans"
// //             style={{
// //                 backgroundImage: `
// //                     radial-gradient(circle at 1% 90%, rgba(99, 102, 241, 0.08), transparent 50%),
// //                     radial-gradient(circle at 99% 10%, rgba(139, 92, 246, 0.07), transparent 45%),
// //                     radial-gradient(circle at 40% 100%, rgba(236, 72, 153, 0.04), transparent 60%),
// //                     radial-gradient(circle at 60% 0%, rgba(59, 130, 246, 0.03), transparent 70%)
// //                 `,
// //                 backgroundAttachment: 'fixed',
// //             }}>
// //             {/* Inline styles for custom animations */}
// //             <style>
// //                 {`
// //                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// //                 .animate-fade-in { animation: fadeIn 0.5s ease-in forwards; }
// //                 @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// //                 .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
// //                 @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
// //                 .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
// //                 .loading-spinner { animation: spin 0.8s linear infinite; }
// //                 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// //                 `}
// //             </style>

// //             {/* Navbar (reusing from Homepage for consistency, simplified) */}
// //             <nav className="navbar sticky top-0 z-50 backdrop-blur-lg bg-gray-900/70 px-6 border-b border-gray-700 shadow-md">
// //                 <div className="flex-1">
// //                     <NavLink to="/" className="btn btn-ghost normal-case text-3xl font-bold text-transparent bg-clip-text"
// //                         style={{ backgroundImage: 'linear-gradient(to right, #6366F1, #EC4899)', textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
// //                         CoderWorld<span className="text-xl opacity-70">.dev</span>
// //                     </NavLink>
// //                 </div>
// //                 <div className="flex-none">
// //                     <div className="dropdown dropdown-end ml-4">
// //                         <div tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-indigo-500 ring-offset-gray-900 ring-offset-2 hover:scale-105 transition-transform duration-200 shadow-lg">
// //                             <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
// //                                 style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}>
// //                                 <span className="text-lg font-bold">{user?.firstname?.charAt(0).toUpperCase() || '?'}</span>
// //                             </div>
// //                         </div>
// //                         <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow-xl menu bg-gray-800 rounded-box w-52 z-[60] border border-gray-700 backdrop-blur-md">
// //                             <li><NavLink to="/profile" className="hover:bg-indigo-500/20 py-2">Profile</NavLink></li>
// //                             {user?.role === 'admin' && <li><NavLink to="/admin" className="hover:bg-indigo-500/20 py-2">Admin Panel</NavLink></li>}
// //                             <div className="divider my-1 h-px bg-gray-700" />
// //                             <li><button onClick={() => dispatch(logoutUser())} className="text-red-400 hover:bg-red-400/20 py-2">Logout</button></li>
// //                         </ul>
// //                     </div>
// //                 </div>
// //             </nav>

// //             {/* Main Profile Content Area */}
// //             <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
// //                 {/* Left Sidebar */}
// //                 <div className="w-full lg:w-1/4 bg-gray-900/50 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center sticky top-28 h-fit animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
// //                     <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl text-gray-400 border-4 border-indigo-500 mb-4 overflow-hidden">
// //                         {/* Avatar / Profile Picture */}
// //                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
// //                             <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
// //                         </svg>
// //                     </div>
// //                     <h2 className="text-2xl font-bold text-white mb-1">{profileData?.firstname || 'Guest User'}</h2>
// //                     <p className="text-gray-400 text-sm mb-6">LeetCode ID: <span className="text-indigo-400">{displayLeetcodeId}</span></p>

// //                     {/* Navigation Links */}
// //                     <ul className="menu w-full space-y-2">
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'basicInfo' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('basicInfo')}>
// //                                 <i className="fas fa-info-circle mr-2"></i> Basic Info
// //                             </button>
// //                         </li>
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('account')}>
// //                                 <i className="fas fa-user-circle mr-2"></i> Account
// //                             </button>
// //                         </li>
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('privacy')}>
// //                                 <i className="fas fa-shield-alt mr-2"></i> Privacy
// //                             </button>
// //                         </li>
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('notifications')}>
// //                                 <i className="fas fa-bell mr-2"></i> Notifications
// //                             </button>
// //                         </li>
// //                         {/* Other static menu items from screenshot */}
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-star mr-2"></i> Points
// //                             </a>
// //                         </li>
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-flask mr-2"></i> Lab
// //                             </a>
// //                         </li>
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-receipt mr-2"></i> Billing <span className="badge badge-sm badge-info text-blue-200 bg-blue-700/50 border-blue-600/50 ml-auto">New</span>
// //                             </a>
// //                         </li>
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-shopping-bag mr-2"></i> Orders <span className="badge badge-sm badge-warning text-yellow-200 bg-yellow-700/50 border-yellow-600/50 ml-auto">Beta</span>
// //                             </a>
// //                         </li>
// //                     </ul>
// //                 </div>

// //                 {/* Right Content Area (Dynamically rendered based on activeTab) */}
// //                 <div className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
// //                     {activeTab === 'basicInfo' && (
// //                         <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
// //                             <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Basic Info</h3>
// //                             <div className="space-y-4">
// //                                 {/* Name */}
// //                                 {renderEditableField('firstname', profileData.firstname)}

// //                                 {/* Gender */}
// //                                 {renderEditableField('profile.gender', profileData.profile?.gender, 'select', ['Not provided', 'Male', 'Female', 'Other'])}

// //                                 {/* Location */}
// //                                 {renderEditableField('profile.location', profileData.profile?.location)}

// //                                 {/* Birthday */}
// //                                 {renderEditableField('profile.birthday', profileData.profile?.birthday ? new Date(profileData.profile.birthday).toISOString().split('T')[0] : '', 'date')}

// //                                 {/* Summary */}
// //                                 {renderEditableField('profile.summary', profileData.profile?.summary, 'textarea')}

// //                                 {/* Website */}
// //                                 {renderEditableField('profile.website', profileData.profile?.website)}

// //                                 {/* Github */}
// //                                 {renderEditableField('profile.github', profileData.profile?.github)}

// //                                 {/* LinkedIn */}
// //                                 {renderEditableField('profile.linkedin', profileData.profile?.linkedin)}

// //                                 {/* X (formerly Twitter) */}
// //                                 {renderEditableField('profile.twitter', profileData.profile?.twitter)}

// //                                 {/* Experience */}
// //                                 <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Experience</h4>
// //                                 {renderEditableField('profile.work', profileData.profile?.work, 'textarea')}
// //                                 {renderEditableField('profile.education', profileData.profile?.education, 'textarea')}

// //                                 {/* Skills */}
// //                                 <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Skills</h4>
// //                                 {renderEditableField('profile.skills', profileData.profile?.skills, 'textarea')}
// //                             </div>
// //                         </div>
// //                     )}

// //                     {activeTab === 'account' && renderAccountInfo()}
// //                     {activeTab === 'privacy' && renderPrivacySettings()}
// //                     {activeTab === 'notifications' && renderNotificationSettings()}
// //                 </div>
// //             </div>

// //             {/* Change Password Modal */}
// //             <ChangePasswordModal 
// //                 isOpen={showChangePasswordModal} 
// //                 onClose={() => setShowChangePasswordModal(false)} 
// //             />

// //             {/* Delete Account Confirmation Modal */}
// //             {showDeleteAccountConfirmation && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999]">
// //                     <div className="modal-box bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-sm text-white text-center">
// //                         <h3 className="font-bold text-2xl mb-4 text-red-400">Confirm Deletion</h3>
// //                         <p className="text-gray-300 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
// //                         <div className="flex justify-center gap-4">
// //                             <button
// //                                 className="btn bg-red-600 hover:bg-red-700 border-red-600 text-white"
// //                                 onClick={handleDeleteAccount}
// //                             >
// //                                 Yes, Delete
// //                             </button>
// //                             <button
// //                                 className="btn btn-ghost text-gray-400 hover:bg-gray-700"
// //                                 onClick={() => setShowDeleteAccountConfirmation(false)}
// //                             >
// //                                 Cancel
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// // export default ProfilePage;

// // import React, { useState, useEffect, useCallback } from 'react';
// // import { NavLink, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import axiosClient from '../utils/axiosClient';
// // import { logoutUser } from '../authSlice';
// // import ChangePasswordModal from '../components/ChangePasswordModal'; // Import the modal


// // // Helper function to capitalize first letter of each word (and handle camelCase)
// // const capitalizeWords = (str) => {
// //     if (typeof str !== 'string' || !str) return '';
// //     return str
// //         .replace(/([A-Z])/g, ' $1') // Add space before capital letters
// //         .split(' ')
// //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //         .join(' ');
// // };

// // function ProfilePage() {
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();
// //     const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

// //     const [profileData, setProfileData] = useState(null);
// //     const [pageLoading, setPageLoading] = useState(true);
// //     const [activeTab, setActiveTab] = useState('basicInfo'); // 'basicInfo', 'account', 'privacy', 'notifications'

// //     // State for managing editable fields (Basic Info, Experience, Skills)
// //     const [editingField, setEditingField] = useState(null);
// //     const [tempValue, setTempValue] = useState('');

// //     // State for managing settings (Privacy, Notifications)
// //     const [notificationSettings, setNotificationSettings] = useState({});
// //     const [privacySettings, setPrivacySettings] = useState({});
// //     const [editingPrivacyField, setEditingPrivacyField] = useState(null);

// //     // Modals state
// //     const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
// //     const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] = useState(false);

// //     // Fetch user profile data on component mount
// //     const fetchProfileData = useCallback(async () => {
// //         try {
// //             setPageLoading(true);
// //             const res = await axiosClient.get('/api/profile');
// //             setProfileData(res.data);
            
// //             // Initialize notification and privacy settings with fetched data or sensible defaults
// //             setNotificationSettings(res.data.settings?.notifications || {
// //                 importantAnnouncements: { email: true, site: false },
// //                 featureAnnouncements: { email: true, site: false },
// //                 awardNotification: { email: true, site: true },
// //                 globalRanking: { email: false, site: true },
// //                 contestBadge: { email: false, site: true },
// //                 contestAnnouncements: { email: true, site: true },
// //                 newComment: { email: false, site: true },
// //                 otherNotifications: { email: true, site: false },
// //                 promotions: { email: true, site: false },
// //                 weeklyRecommendations: { email: true, site: false },
// //             });
// //             setPrivacySettings(res.data.settings?.privacy || {
// //                 contactByCompanies: true,
// //                 joinStudyPlanLeaderboard: true,
// //                 displaySubmissionHistory: true,
// //             });
// //             // alert('Profile data loaded successfully.'); // Use alert for critical feedback, but not for every successful load
// //         } catch (err) {
// //             console.error('Error fetching profile data:', err);
// //             alert(`Failed to load profile: ${err.response?.data?.message || err.message}`);
// //             // If fetching fails, especially due to auth, redirect to login
// //             if (err.response?.status === 401 || err.response?.status === 403) {
// //                 dispatch(logoutUser());
// //                 navigate('/login');
// //             }
// //         } finally {
// //             setPageLoading(false);
// //         }
// //     }, [dispatch, navigate]);

// //     useEffect(() => {
// //         if (isAuthenticated && !authLoading) {
// //             fetchProfileData();
// //         }
// //     }, [isAuthenticated, authLoading, fetchProfileData]);

// //     // Handle editing any profile field (Basic Info, Experience, Skills)
// //     const handleEditClick = (fieldPath, currentValue) => {
// //         setEditingField(fieldPath);
// //         // Ensure tempValue is a string, handle null/undefined/Date objects for input fields
// //         if (fieldPath === 'profile.birthday' && currentValue) {
// //             setTempValue(new Date(currentValue).toISOString().split('T')[0]);
// //         } else {
// //             setTempValue(currentValue === null || currentValue === undefined || String(currentValue).trim() === '' ? '' : String(currentValue));
// //         }
// //     };

// //     const handleSaveClick = async (fieldPath) => {
// //         try {
// //             let valueToSave = tempValue;
// //             // Special handling for Gender: Map 'Not provided' back to empty string for backend enum
// //             if (fieldPath === 'profile.gender') {
// //                 valueToSave = tempValue === 'Not provided' ? '' : tempValue;
// //             } else if (fieldPath === 'profile.birthday') {
// //                 // Ensure birthday is saved as a Date object or null if empty
// //                 valueToSave = tempValue ? new Date(tempValue) : null;
// //             }

// //             const res = await axiosClient.put('/api/profile/field', {
// //                 field: fieldPath,
// //                 value: valueToSave
// //             });
// //             // Update local state with the new user data from response
// //             setProfileData(res.data.user);
// //             setEditingField(null); // Exit editing mode
// //             setTempValue('');
// //             alert(`Updated ${capitalizeWords(fieldPath.split('.').pop())} successfully!`);
// //         } catch (err) {
// //             console.error('Error updating field:', fieldPath, err);
// //             alert(`Failed to update ${capitalizeWords(fieldPath.split('.').pop())}: ${err.response?.data?.message || err.message}`);
// //         }
// //     };

// //     const handleCancelClick = () => {
// //         setEditingField(null);
// //         setTempValue('');
// //     };

// //     // Helper to render an editable input or text for basic info fields
// //     const renderEditableField = (fieldPath, displayValue, inputType = 'text', options = []) => {
// //         const isEditing = editingField === fieldPath;
// //         const actualDisplayValue = (displayValue === null || displayValue === undefined || String(displayValue).trim() === '') 
// //             ? 'Not provided' 
// //             : String(displayValue);

// //         return (
// //             <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-700/50">
// //                 <span className="text-gray-400 text-sm font-semibold min-w-[120px] mb-2 md:mb-0">
// //                     {capitalizeWords(fieldPath.split('.').pop().replace(/([A-Z])/g, ' $1').trim())}
// //                 </span>
// //                 <div className="flex-1 w-full max-w-lg flex items-center gap-2">
// //                     {isEditing ? (
// //                         inputType === 'textarea' ? (
// //                             <textarea
// //                                 className="textarea textarea-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow text-sm min-h-[60px]"
// //                                 value={tempValue}
// //                                 onChange={(e) => setTempValue(e.target.value)}
// //                                 rows="2"
// //                                 placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
// //                             ></textarea>
// //                         ) : inputType === 'select' ? (
// //                             <select
// //                                 className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full max-w-[200px] text-sm"
// //                                 value={tempValue}
// //                                 onChange={(e) => setTempValue(e.target.value)}
// //                             >
// //                                 {options.map((opt) => (
// //                                     <option key={opt} value={opt}>{opt}</option>
// //                                 ))}
// //                             </select>
// //                         ) : (
// //                             <input
// //                                 type={inputType}
// //                                 className="input input-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow text-sm"
// //                                 value={tempValue}
// //                                 onChange={(e) => setTempValue(e.target.value)}
// //                                 placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
// //                             />
// //                         )
// //                     ) : (
// //                         <span className="text-gray-300 flex-grow py-2 text-sm">{actualDisplayValue}</span>
// //                     )}
// //                     <div className="flex gap-2 min-w-[140px] justify-end">
// //                         {isEditing ? (
// //                             <>
// //                                 <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handleSaveClick(fieldPath)}>Save</button>
// //                                 <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={handleCancelClick}>Cancel</button>
// //                             </>
// //                         ) : (
// //                             <button
// //                                 className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700"
// //                                 onClick={() => handleEditClick(fieldPath, displayValue)}
// //                             >
// //                                 Edit
// //                             </button>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     };

// //     // Notification settings handler
// //     const handleNotificationChange = async (setting, type, checked) => {
// //         try {
// //             const res = await axiosClient.put('/api/profile/settings/notifications', {
// //                 setting,
// //                 type,
// //                 value: checked
// //             });
// //             setNotificationSettings(prev => ({
// //                 ...prev,
// //                 [setting]: {
// //                     ...prev[setting],
// //                     [type]: checked
// //                 }
// //             }));
// //             alert('Notification settings updated!');
// //         } catch (err) {
// //             console.error('Error updating notification setting:', err);
// //             alert(`Failed to update notification setting: ${err.response?.data?.message || err.message}`);
// //         }
// //     };

// //     // Privacy settings handler
// //     const handlePrivacyChange = async (field, value) => {
// //         try {
// //             const booleanValue = value === 'Yes'; // Convert 'Yes'/'No' to boolean
// //             const res = await axiosClient.put('/api/profile/settings/privacy', {
// //                 field,
// //                 value: booleanValue
// //             });
// //             setPrivacySettings(prev => ({
// //                 ...prev,
// //                 [field]: booleanValue
// //             }));
// //             setEditingPrivacyField(null); // Exit editing mode for this field
// //             setTempValue(''); // Clear temp value
// //             alert('Privacy settings updated!');
// //         } catch (err) {
// //             console.error('Error updating privacy setting:', err);
// //             alert(`Failed to update privacy setting: ${err.response?.data?.message || err.message}`);
// //         }
// //     };

// //     const handleDeleteAccount = async () => {
// //         try {
// //             const res = await axiosClient.delete('/auth/profile'); // Using the /auth/profile route for self-delete
// //             dispatch(logoutUser()); // Log out user after deletion
// //             alert(res.data.message || 'Your account has been deleted successfully.');
// //             navigate('/signup'); // Redirect to signup/login page
// //         } catch (err) {
// //             console.error('Error deleting account:', err);
// //             alert(`Failed to delete account: ${err.response?.data?.message || err.message}`);
// //         } finally {
// //             setShowDeleteAccountConfirmation(false); // Close confirmation modal
// //         }
// //     };

// //     // Render functions for different tabs
// //     const renderAccountInfo = () => {
// //         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

// //         return (
// //             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
// //                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Account Information</h3>
// //                 <div className="space-y-6">
// //                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
// //                         <div className="flex-1">
// //                             <p className="text-gray-400 text-sm mb-1">LeetCode ID</p>
// //                             <p className="text-white text-lg">{user?.firstname?.toLowerCase() + user?.id?.slice(0, 5) || 'N/A'}</p>
// //                         </div>
// //                         <button className="btn btn-ghost btn-sm text-gray-500 mt-2 md:mt-0" disabled>Edit</button>
// //                     </div>

// //                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
// //                         <div className="flex-1">
// //                             <p className="text-gray-400 text-sm mb-1">Email</p>
// //                             <p className="text-white text-lg">{profileData.emailId} <span className="badge badge-success bg-emerald-500 text-white border-transparent ml-2">Primary</span></p>
// //                         </div>
// //                         <button className="btn btn-ghost btn-sm text-gray-500 mt-2 md:mt-0" disabled>Edit</button>
// //                     </div>

// //                     <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
// //                         <div className="flex-1">
// //                             <p className="text-gray-400 text-sm mb-1">Password</p>
// //                             <button 
// //                                 className="text-indigo-400 text-lg hover:underline cursor-pointer btn btn-ghost btn-sm p-0 h-auto min-h-0"
// //                                 onClick={() => setShowChangePasswordModal(true)}
// //                             >
// //                                 Change Password
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <h3 className="text-2xl font-bold text-white mt-8 mb-6 border-b border-gray-700 pb-4">Social Account</h3>
// //                 <div className="space-y-4">
// //                     {['LinkedIn', 'Google', 'Github', 'Facebook'].map(platform => (
// //                         <div key={platform} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
// //                             <div className="flex items-center">
// //                                 <span className={`mr-3 text-2xl font-bold
// //                                     ${platform === 'LinkedIn' ? 'text-blue-500' :
// //                                       platform === 'Google' ? 'text-red-500' :
// //                                       platform === 'Github' ? 'text-gray-400' : 'text-blue-600'}`}
// //                                 >
// //                                     {/* These are FontAwesome icons, ensure FontAwesome is linked in your index.html */}
// //                                     {platform === 'LinkedIn' && <i className="fab fa-linkedin"></i>}
// //                                     {platform === 'Google' && <i className="fab fa-google"></i>}
// //                                     {platform === 'Github' && <i className="fab fa-github"></i>}
// //                                     {platform === 'Facebook' && <i className="fab fa-facebook"></i>}
// //                                 </span>
// //                                 <p className="text-white text-lg">{platform}</p>
// //                             </div>
// //                             <div className="flex items-center gap-4">
// //                                 <span className="text-gray-400">Not Connected</span>
// //                                 <span className="text-green-400 font-bold">+10</span>
// //                                 <button className="btn btn-sm btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">Connect</button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 <button
// //                     className="btn btn-error bg-red-600 hover:bg-red-700 border-red-600 text-white mt-10 px-8 py-3 rounded-xl shadow-lg"
// //                     onClick={() => setShowDeleteAccountConfirmation(true)}
// //                 >
// //                     Delete Account
// //                 </button>
// //             </div>
// //         );
// //     };

// //     const renderPrivacySettings = () => {
// //         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

// //         const privacyFields = [
// //             {
// //                 field: 'contactByCompanies',
// //                 label: 'Can companies contact you with job opportunities?',
// //                 description: 'We will only send your contact information to interested partner companies to connect you with job opportunities. We respect your privacy and will never give or sell your personal information to third parties without your explicit consent.',
// //                 currentValue: privacySettings.contactByCompanies
// //             },
// //             {
// //                 field: 'joinStudyPlanLeaderboard',
// //                 label: 'Join study plan leaderboard',
// //                 description: 'Will no longer join the leaderboard after turning off, the changes will be applied at the start of each week.',
// //                 currentValue: privacySettings.joinStudyPlanLeaderboard
// //             },
// //             {
// //                 field: 'displaySubmissionHistory',
// //                 label: 'Display my submission history',
// //                 description: 'After closing, your submission history data and information will not be displayed on your profile page to others.',
// //                 currentValue: privacySettings.displaySubmissionHistory
// //             }
// //         ];

// //         return (
// //             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
// //                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Privacy</h3>
// //                 <div className="space-y-8">
// //                     {privacyFields.map(({ field, label, description, currentValue }) => (
// //                         <div key={field} className="flex flex-col lg:flex-row lg:items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
// //                             <div className="flex-1 pr-4 mb-4 lg:mb-0">
// //                                 <p className="text-white text-lg font-medium">{label}</p>
// //                                 <p className="text-gray-400 text-sm mt-1">{description}</p>
// //                             </div>
// //                             <div className="flex items-center gap-2 min-w-[140px] justify-end">
// //                                 {editingPrivacyField === field ? (
// //                                     <>
// //                                         <select
// //                                             className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 w-24 text-sm"
// //                                             value={tempValue}
// //                                             onChange={(e) => setTempValue(e.target.value)}
// //                                         >
// //                                             <option value="Yes">Yes</option>
// //                                             <option value="No">No</option>
// //                                         </select>
// //                                         <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handlePrivacyChange(field, tempValue)}>Save</button>
// //                                         <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(null); setTempValue(''); }}>Cancel</button>
// //                                     </>
// //                                 ) : (
// //                                     <>
// //                                         <span className="text-gray-300 font-semibold text-sm">{currentValue ? 'Yes' : 'No'}</span>
// //                                         <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(field); setTempValue(currentValue ? 'Yes' : 'No'); }}>Edit</button>
// //                                     </>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const renderNotificationSettings = () => {
// //         if (!profileData) return <div className="text-center py-10 text-gray-400">Loading...</div>;

// //         const notificationCategories = {
// //             Announcements: ['importantAnnouncements', 'featureAnnouncements'],
// //             Award: ['awardNotification'],
// //             Contest: ['globalRanking', 'contestBadge', 'contestAnnouncements'],
// //             Discuss: ['newComment'],
// //             Other: ['otherNotifications'],
// //             Promotions: ['promotions'],
// //             'Weekly Email': ['weeklyRecommendations']
// //         };

// //         const renderCheckboxRow = (settingKey, label) => (
// //             <tr key={settingKey} className="border-b border-gray-700/50 last:border-none">
// //                 <td className="py-3 px-4 text-white text-sm font-medium">{label}</td>
// //                 <td className="py-3 px-4 text-center">
// //                     <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
// //                         checked={notificationSettings[settingKey]?.email || false}
// //                         onChange={(e) => handleNotificationChange(settingKey, 'email', e.target.checked)}
// //                     />
// //                 </td>
// //                 <td className="py-3 px-4 text-center">
// //                     <input
// //                         type="checkbox"
// //                         className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
// //                         checked={notificationSettings[settingKey]?.site || false}
// //                         onChange={(e) => handleNotificationChange(settingKey, 'site', e.target.checked)}
// //                     />
// //                 </td>
// //             </tr>
// //         );

// //         return (
// //             <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
// //                 <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Notifications</h3>
// //                 <div className="overflow-x-auto">
// //                     <table className="table w-full text-slate-200">
// //                         <thead>
// //                             <tr className="border-b border-gray-700 bg-gray-700/50">
// //                                 <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 rounded-tl-xl"></th>
// //                                 <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Email</th>
// //                                 <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-gray-300 rounded-tr-xl">Site</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {Object.entries(notificationCategories).map(([category, settings]) => (
// //                                 <React.Fragment key={category}>
// //                                     <tr>
// //                                         <td colSpan="3" className="py-4 px-4 text-gray-400 font-bold uppercase text-xs border-b border-gray-700/50 bg-gray-800/60">{category}</td>
// //                                     </tr>
// //                                     {settings.map(settingKey => renderCheckboxRow(settingKey, capitalizeWords(settingKey.replace(/([A-Z])/g, ' $1').replace('Id', ' ID').trim())))}
// //                                 </React.Fragment>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         );
// //     };


// //     if (authLoading || pageLoading || !profileData) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
// //                 <span className="loading loading-spinner loading-lg text-indigo-500"></span>
// //                 <p className="ml-3 text-lg">Loading profile...</p>
// //             </div>
// //         );
// //     }

// //     // Determine the user's display name for the header (e.g., LeetCode ID style)
// //     const displayLeetcodeId = user?.firstname ? user.firstname.toLowerCase() + user.id.slice(0, 5) : 'unknownid12345';

// //     return (
// //         <div className="min-h-screen bg-slate-950 text-slate-200 font-sans"
// //             style={{
// //                 backgroundImage: `
// //                     radial-gradient(circle at 1% 90%, rgba(99, 102, 241, 0.08), transparent 50%),
// //                     radial-gradient(circle at 99% 10%, rgba(139, 92, 246, 0.07), transparent 45%),
// //                     radial-gradient(circle at 40% 100%, rgba(236, 72, 153, 0.04), transparent 60%),
// //                     radial-gradient(circle at 60% 0%, rgba(59, 130, 246, 0.03), transparent 70%)
// //                 `,
// //                 backgroundAttachment: 'fixed',
// //             }}>
// //             {/* Inline styles for custom animations */}
// //             <style>
// //                 {`
// //                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// //                 .animate-fade-in { animation: fadeIn 0.5s ease-in forwards; }
// //                 @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// //                 .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
// //                 @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
// //                 .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
// //                 .loading-spinner { animation: spin 0.8s linear infinite; }
// //                 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// //                 `}
// //             </style>

// //             {/* Navbar (reusing from Homepage for consistency, simplified) */}
// //             <nav className="navbar sticky top-0 z-50 backdrop-blur-lg bg-gray-900/70 px-6 border-b border-gray-700 shadow-md">
// //                 <div className="flex-1">
// //                     <NavLink to="/" className="btn btn-ghost normal-case text-3xl font-bold text-transparent bg-clip-text"
// //                         style={{ backgroundImage: 'linear-gradient(to right, #6366F1, #EC4899)', textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
// //                         CoderWorld<span className="text-xl opacity-70">.dev</span>
// //                     </NavLink>
// //                 </div>
// //                 <div className="flex-none">
// //                     <div className="dropdown dropdown-end ml-4">
// //                         <div tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-indigo-500 ring-offset-gray-900 ring-offset-2 hover:scale-105 transition-transform duration-200 shadow-lg">
// //                             <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
// //                                 style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}>
// //                                 <span className="text-lg font-bold">{user?.firstname?.charAt(0).toUpperCase() || '?'}</span>
// //                             </div>
// //                         </div>
// //                         <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow-xl menu bg-gray-800 rounded-box w-52 z-[60] border border-gray-700 backdrop-blur-md">
// //                             <li><NavLink to="/profile" className="hover:bg-indigo-500/20 py-2">Profile</NavLink></li>
// //                             {user?.role === 'admin' && <li><NavLink to="/admin" className="hover:bg-indigo-500/20 py-2">Admin Panel</NavLink></li>}
// //                             <div className="divider my-1 h-px bg-gray-700" />
// //                             <li><button onClick={() => dispatch(logoutUser())} className="text-red-400 hover:bg-red-400/20 py-2">Logout</button></li>
// //                         </ul>
// //                     </div>
// //                 </div>
// //             </nav>

// //             {/* Main Profile Content Area */}
// //             <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
// //                 {/* Left Sidebar */}
// //                 <div className="w-full lg:w-1/4 bg-gray-900/50 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center sticky top-28 h-fit animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
// //                     <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl text-gray-400 border-4 border-indigo-500 mb-4 overflow-hidden">
// //                         {/* Avatar / Profile Picture */}
// //                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
// //                             <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
// //                         </svg>
// //                     </div>
// //                     <h2 className="text-2xl font-bold text-white mb-1">{profileData?.firstname || 'Guest User'}</h2>
// //                     <p className="text-gray-400 text-sm mb-6">LeetCode ID: <span className="text-indigo-400">{displayLeetcodeId}</span></p>

// //                     {/* Navigation Links */}
// //                     <ul className="menu w-full space-y-2">
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'basicInfo' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('basicInfo')}>
// //                                 <i className="fas fa-info-circle mr-2"></i> Basic Info
// //                             </button>
// //                         </li>
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('account')}>
// //                                 <i className="fas fa-user-circle mr-2"></i> Account
// //                             </button>
// //                         </li>
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('privacy')}>
// //                                 <i className="fas fa-shield-alt mr-2"></i> Privacy
// //                             </button>
// //                         </li>
// //                         <li>
// //                             <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
// //                                 onClick={() => setActiveTab('notifications')}>
// //                                 <i className="fas fa-bell mr-2"></i> Notifications
// //                             </button>
// //                         </li>
// //                         {/* Other static menu items from screenshot */}
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-star mr-2"></i> Points
// //                             </a>
// //                         </li>
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-flask mr-2"></i> Lab
// //                             </a>
// //                         </li>
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-receipt mr-2"></i> Billing <span className="badge badge-sm badge-info text-blue-200 bg-blue-700/50 border-blue-600/50 ml-auto">New</span>
// //                             </a>
// //                         </li>
// //                         <li>
// //                             <a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">
// //                                 <i className="fas fa-shopping-bag mr-2"></i> Orders <span className="badge badge-sm badge-warning text-yellow-200 bg-yellow-700/50 border-yellow-600/50 ml-auto">Beta</span>
// //                             </a>
// //                         </li>
// //                     </ul>
// //                 </div>

// //                 {/* Right Content Area (Dynamically rendered based on activeTab) */}
// //                 <div className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
// //                     {activeTab === 'basicInfo' && (
// //                         <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
// //                             <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Basic Info</h3>
// //                             <div className="space-y-4">
// //                                 {/* Name */}
// //                                 {renderEditableField('firstname', profileData.firstname)}

// //                                 {/* Gender */}
// //                                 {renderEditableField('profile.gender', profileData.profile?.gender, 'select', ['Not provided', 'Male', 'Female', 'Other'])}

// //                                 {/* Location */}
// //                                 {renderEditableField('profile.location', profileData.profile?.location)}

// //                                 {/* Birthday */}
// //                                 {renderEditableField('profile.birthday', profileData.profile?.birthday ? new Date(profileData.profile.birthday).toISOString().split('T')[0] : '', 'date')}

// //                                 {/* Summary */}
// //                                 {renderEditableField('profile.summary', profileData.profile?.summary, 'textarea')}

// //                                 {/* Website */}
// //                                 {renderEditableField('profile.website', profileData.profile?.website)}

// //                                 {/* Github */}
// //                                 {renderEditableField('profile.github', profileData.profile?.github)}

// //                                 {/* LinkedIn */}
// //                                 {renderEditableField('profile.linkedin', profileData.profile?.linkedin)}

// //                                 {/* X (formerly Twitter) */}
// //                                 {renderEditableField('profile.twitter', profileData.profile?.twitter)}

// //                                 {/* Experience */}
// //                                 <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Experience</h4>
// //                                 {renderEditableField('profile.work', profileData.profile?.work, 'textarea')}
// //                                 {renderEditableField('profile.education', profileData.profile?.education, 'textarea')}

// //                                 {/* Skills */}
// //                                 <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Skills</h4>
// //                                 {renderEditableField('profile.skills', profileData.profile?.skills, 'textarea')}
// //                             </div>
// //                         </div>
// //                     )}

// //                     {activeTab === 'account' && renderAccountInfo()}
// //                     {activeTab === 'privacy' && renderPrivacySettings()}
// //                     {activeTab === 'notifications' && renderNotificationSettings()}
// //                 </div>
// //             </div>

// //             {/* Change Password Modal */}
// //             <ChangePasswordModal 
// //                 isOpen={showChangePasswordModal} 
// //                 onClose={() => setShowChangePasswordModal(false)} 
// //             />

// //             {/* Delete Account Confirmation Modal */}
// //             {showDeleteAccountConfirmation && (
// //                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999]">
// //                     <div className="modal-box bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-sm text-white text-center">
// //                         <h3 className="font-bold text-2xl mb-4 text-red-400">Confirm Deletion</h3>
// //                         <p className="text-gray-300 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
// //                         <div className="flex justify-center gap-4">
// //                             <button
// //                                 className="btn bg-red-600 hover:bg-red-700 border-red-600 text-white"
// //                                 onClick={handleDeleteAccount}
// //                             >
// //                                 Yes, Delete
// //                             </button>
// //                             <button
// //                                 className="btn btn-ghost text-gray-400 hover:bg-gray-700"
// //                                 onClick={() => setShowDeleteAccountConfirmation(false)}
// //                             >
// //                                 Cancel
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// // export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

// Helper function to capitalize first letter of each word
const capitalizeWords = (str) => {
    if (typeof str !== 'string' || !str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// --- Frontend Default Settings ---
// These should mirror the backend's DEFAULT_NOTIFICATION_SETTINGS and DEFAULT_PRIVACY_SETTINGS
// to ensure consistent initial state and prevent errors if settings are not fully present in fetched data.
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

function ProfilePage() {
    const dispatch = useDispatch();
    // Get user and auth status from Redux store
    const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

    // Local states for profile data and UI management
    const [profileData, setProfileData] = useState(null); // Full profile data from backend
    const [pageLoading, setPageLoading] = useState(true); // Loading state for profile data fetch
    const [fetchError, setFetchError] = useState(null); // Error state for profile data fetch

    const [activeTab, setActiveTab] = useState('basicInfo'); // Currently active tab

    // States for managing editable fields
    const [editingField, setEditingField] = useState(null); 
    const [tempValue, setTempValue] = useState(''); 

    // States for notification and privacy settings, initialized with defaults
    const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
    const [privacySettings, setPrivacySettings] = useState(DEFAULT_PRIVACY_SETTINGS_FRONTEND);
    const [editingPrivacyField, setEditingPrivacyField] = useState(null); 

    // --- Handlers for Profile Field Editing (Basic Info) ---
    const handleEditClick = (fieldPath, currentValue) => {
        setEditingField(fieldPath);
        // Ensure tempValue is a string, handle null/undefined
        setTempValue(currentValue === null || currentValue === undefined ? '' : currentValue); 
    };

    const handleSaveClick = async (fieldPath) => {
        try {
            setFetchError(null); // Clear previous errors

            let valueToSave = tempValue;
            if (fieldPath === 'profile.gender') {
                valueToSave = tempValue === 'Not provided' ? '' : tempValue;
            } else if (fieldPath === 'profile.birthday') {
                // Send ISO string for backend date parsing if date exists, otherwise null
                valueToSave = tempValue ? new Date(tempValue).toISOString() : null;
            }

            // Send PUT request to update specific field
            const res = await axiosClient.put('/profile/field', { // Endpoint matching profileRouter.js
                field: fieldPath,
                value: valueToSave
            });
            
            // Backend should return the updated user object or the specific updated profile field.
            // Assuming `res.data.user` contains the full updated user object including profile and settings.
            setProfileData(res.data.user); 
            
            // Update notification and privacy settings based on the fresh data from the response
            setNotificationSettings(res.data.user.settings?.notifications || DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
            setPrivacySettings(res.data.user.settings?.privacy || DEFAULT_PRIVACY_SETTINGS_FRONTEND);

            setEditingField(null); // Exit editing mode
            setTempValue('');
        } catch (err) {
            console.error('Error updating field:', fieldPath, err);
            setFetchError(`Failed to update ${capitalizeWords(fieldPath.split('.').pop())}: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleCancelClick = () => {
        setEditingField(null);
        setTempValue('');
    };

    // Helper to render an editable input or text for basic info fields
    const renderEditableField = (fieldPath, displayValue, inputType = 'text', options = []) => {
        const isEditing = editingField === fieldPath;

        return (
            <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
                <span className="text-gray-400 text-md min-w-[120px]">{capitalizeWords(fieldPath.split('.').pop().replace(/([A-Z])/g, ' $1').trim())}</span>
                <div className="flex-1 w-full max-w-lg flex flex-col items-start md:items-center md:flex-row gap-2">
                    {isEditing ? (
                        inputType === 'textarea' ? (
                            <textarea
                                className="textarea textarea-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                rows="3"
                                placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
                            ></textarea>
                        ) : inputType === 'select' ? (
                            <select
                                className="select select-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full max-w-[200px]"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                            >
                                {options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={inputType}
                                className="input input-bordered bg-gray-700 text-slate-200 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 w-full flex-grow"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                placeholder={`Enter your ${capitalizeWords(fieldPath.split('.').pop())}`}
                            />
                        )
                    ) : (
                        <span className="text-gray-300 flex-grow py-2">{displayValue || 'Not provided'}</span>
                    )}
                    <div className="flex gap-2 mt-2 md:mt-0">
                        {isEditing ? (
                            <>
                                <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handleSaveClick(fieldPath)}>Save</button>
                                <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={handleCancelClick}>Cancel</button>
                            </>
                        ) : (
                            <button
                                className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700"
                                onClick={() => handleEditClick(fieldPath, displayValue === 'Not provided' ? '' : displayValue)}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    // --- useEffect for fetching user profile data on component mount/auth change ---
    useEffect(() => {
        const fetchProfileData = async () => {
            // Prevent fetching if already loading or not authenticated
            if (!isAuthenticated) { 
                setPageLoading(false); // Stop loading animation if not authenticated
                return; // Let Navigate component handle redirection
            }

            try {
                setPageLoading(true);
                setFetchError(null); // Clear any previous errors before new fetch

                // Make API call to get profile data
                const res = await axiosClient.get('/profile'); // Endpoint matching profileRouter.js
                setProfileData(res.data);
                
                // Initialize notification and privacy settings with defensive checks and defaults
                setNotificationSettings(res.data.settings?.notifications || DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
                setPrivacySettings(res.data.settings?.privacy || DEFAULT_PRIVACY_SETTINGS_FRONTEND);

            } catch (err) {
                console.error('Error fetching profile data:', err);
                setFetchError('Failed to load profile data. Please try again or log in again.');
                // If unauthorized (401), dispatch logout to clear Redux/localStorage state fully
                if (err.response?.status === 401) {
                    dispatch(logoutUser()); 
                }
            } finally {
                setPageLoading(false); // Always set loading to false when fetch finishes
            }
        };

        // Trigger fetch only if authenticated and authentication status is not still loading
        if (isAuthenticated && !authLoading) {
            fetchProfileData();
        } else if (!isAuthenticated && !authLoading) {
            // If authentication process finished and user is not authenticated,
            // then there's no data to fetch, and the Navigate will handle redirect.
            setPageLoading(false);
        }

    }, [isAuthenticated, authLoading, dispatch]); // Dependencies: Re-run if auth status changes

    // --- Handlers for Notification Settings ---
    const handleNotificationChange = async (setting, type, checked) => {
        try {
            setFetchError(null); // Clear errors
            // Optimistic UI update: update state immediately for better UX
            setNotificationSettings(prev => ({
                ...prev,
                [setting]: { ...prev[setting], [type]: checked }
            }));

            await axiosClient.put('/profile/settings/notifications', { // Endpoint matching profileRouter.js
                setting,
                type,
                value: checked
            });
            // If backend sends back the updated user, you could update profileData here:
            // setProfileData(res.data.user); 
        } catch (err) {
            console.error('Error updating notification setting:', err);
            // Revert optimistic update and display error
            setNotificationSettings(profileData.settings?.notifications || DEFAULT_NOTIFICATION_SETTINGS_FRONTEND);
            setFetchError('Failed to update notification setting. Please retry.');
        }
    };

    // --- Handlers for Privacy Settings ---
    const handlePrivacyChange = async (field, value) => {
        try {
            setFetchError(null); // Clear errors
            const booleanValue = value === 'Yes'; // Convert 'Yes'/'No' to boolean

            // Optimistic UI update
            setPrivacySettings(prev => ({
                ...prev,
                [field]: booleanValue
            }));

            await axiosClient.put('/profile/settings/privacy', { // Endpoint matching profileRouter.js
                field,
                value: booleanValue
            });
            setEditingPrivacyField(null); 
            setTempValue('');
            // If backend sends back the updated user, you could update profileData here:
            // setProfileData(res.data.user); 
        } catch (err) {
            console.error('Error updating privacy setting:', err);
            // Revert optimistic update and display error
            setPrivacySettings(profileData.settings?.privacy || DEFAULT_PRIVACY_SETTINGS_FRONTEND);
            setFetchError('Failed to update privacy setting. Please retry.');
        }
    };

    // --- Render Functions for Different Tabs ---
    // These functions now assume profileData is not null, as main render logic handles it.
    const renderAccountInfo = () => {
        return (
            <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Account Information</h3>
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm mb-1"> ID</p>
                            {/* Ensure user and user.id exist before accessing/slicing */}
                            <p className="text-white text-lg">
                                {user?.firstname?.toLowerCase() || ''}{user?.id?.slice(0, 5) || ''}
                            </p>
                        </div>
                        <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700 mt-2 md:mt-0" disabled>Edit</button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-700/50">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm mb-1">Email</p>
                            <p className="text-white text-lg">
                                {/* Ensure profileData.emailId exists before displaying */}
                                {profileData.emailId || 'N/A'} <span className="badge badge-success bg-emerald-500 text-white border-transparent ml-2">Primary</span></p>
                        </div>
                        <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700 mt-2 md:mt-0" disabled>Edit</button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
                        <div className="flex-1">
                            <p className="text-gray-400 text-sm mb-1">Password</p>
                            <p className="text-indigo-400 text-lg hover:underline cursor-pointer">Change Password</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mt-8 mb-6 border-b border-gray-700 pb-4">Social Account</h3>
                <div className="space-y-4">
                    {['LinkedIn', 'Google', 'Github', 'Facebook'].map(platform => (
                        <div key={platform} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-none">
                            <div className="flex items-center">
                                <span className={`mr-3 text-2xl font-bold ${platform === 'LinkedIn' ? 'text-blue-500' : platform === 'Google' ? 'text-red-500' : platform === 'Github' ? 'text-gray-400' : 'text-blue-600'}`}>
                                    {platform === 'LinkedIn' && 'in'}
                                    {platform === 'Google' && 'G'}
                                    {platform === 'Github' && 'Gh'}
                                    {platform === 'Facebook' && 'f'}
                                </span>
                                <p className="text-white text-lg">{platform}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">Not Connected</span>
                                <span className="text-green-400">+10</span> 
                                <button className="btn btn-sm btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">Connect</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn btn-error bg-red-600 hover:bg-red-700 border-red-600 text-white mt-10 px-8 py-3 rounded-xl shadow-lg">
                    Delete Account
                </button>
            </div>
        );
    };

    const renderPrivacySettings = () => {
        return (
            <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Privacy</h3>
                <div className="space-y-8">
                    {[
                        { field: 'contactByCompanies', label: 'Can companies contact you with job opportunities?', description: 'We will only send your contact information to interested partner companies to connect you with job opportunities. We respect your privacy and will never give or sell your personal information to third parties without your explicit consent.' },
                        { field: 'joinStudyPlanLeaderboard', label: 'Join study plan leaderboard', description: 'Will no longer join the leaderboard after turning off, the changes will be applied at the start of each week.' },
                        { field: 'displaySubmissionHistory', label: 'Display my submission history', description: 'After closing, your submission history data and information will not be displayed on your profile page to others.' }
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
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                        <button className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white" onClick={() => handlePrivacyChange(field, tempValue)}>Save</button>
                                        <button className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(null); setTempValue(''); }}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        {/* Use privacySettings state directly which is robustly initialized */}
                                        <span className="text-gray-300 font-semibold">{privacySettings[field] ? 'Yes' : 'No'}</span>
                                        <button className="btn btn-ghost btn-sm text-indigo-400 hover:bg-gray-700" onClick={() => { setEditingPrivacyField(field); setTempValue(privacySettings[field] ? 'Yes' : 'No'); }}>Edit</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderNotificationSettings = () => {
        const notificationCategories = {
            Announcements: ['importantAnnouncements', 'featureAnnouncements'],
            Award: ['awardNotification'],
            Contest: ['globalRanking', 'contestBadge', 'contestAnnouncements'],
            Discuss: ['newComment'],
            Other: ['otherNotifications'],
            Promotions: ['promotions'],
            'Weekly Email': ['weeklyRecommendations']
        };

        const renderCheckboxRow = (settingKey, label) => (
            <tr key={settingKey} className="border-b border-gray-700/50 last:border-none">
                <td className="py-3 px-4 text-white text-md font-medium">{label}</td>
                <td className="py-3 px-4 text-center">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
                        checked={notificationSettings[settingKey]?.email || false}
                        onChange={(e) => handleNotificationChange(settingKey, 'email', e.target.checked)}
                    />
                </td>
                <td className="py-3 px-4 text-center">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary bg-gray-600 border-gray-500 checked:bg-indigo-500 checked:border-indigo-500"
                        checked={notificationSettings[settingKey]?.site || false}
                        onChange={(e) => handleNotificationChange(settingKey, 'site', e.target.checked)}
                    />
                </td>
            </tr>
        );

        return (
            <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 animate-fade-in-up">
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
            </div>
        );
    };

    // --- Main Render Logic (Conditional Rendering Based on State) ---
    // Handle loading, authentication, and initial data fetching states.
    if (authLoading || pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
                <p className="ml-3 text-lg">Loading profile...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page.
        return <Navigate to="/login" />;
    }

    if (fetchError) {
        // Display a user-friendly error message if fetching profile data failed.
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-red-500">
                <p className="text-xl mb-4 text-center">Error: {fetchError}</p>
                <button className="btn btn-primary bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.reload()}>Retry Loading Profile</button>
            </div>
        );
    }

    if (!profileData) {
        // This case should ideally be caught by pageLoading and fetchError,
        // but as a fallback, if data is unexpectedly null.
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
                <p className="ml-3 text-lg">No profile data available. Please try logging in again.</p>
            </div>
        );
    }

    // Determine the user's display ID (e.g., LeetCode ID style)
    // Use optional chaining for `user` and `user.id` to prevent errors if they are null/undefined
    const displayLeetcodeId = user?.firstname ? user.firstname.toLowerCase() + (user.id ? user.id.slice(0, 5) : '') : 'unknownid';


    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans"
            style={{
                backgroundImage: `
                    radial-gradient(circle at 1% 90%, rgba(99, 102, 241, 0.08), transparent 50%),
                    radial-gradient(circle at 99% 10%, rgba(139, 92, 246, 0.07), transparent 45%),
                    radial-gradient(circle at 40% 100%, rgba(236, 72, 153, 0.04), transparent 60%),
                    radial-gradient(circle at 60% 0%, rgba(59, 130, 246, 0.03), transparent 70%)
                `,
                backgroundAttachment: 'fixed',
            }}>
            {/* Inline styles for custom animations (good to put in a CSS file for larger apps) */}
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.5s ease-in forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-down { animation: fadeInDown 0.6s ease-out forwards; }
                .loading-spinner { animation: spin 0.8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}
            </style>

            {/* Navbar */}
            <nav className="navbar sticky top-0 z-50 backdrop-blur-lg bg-gray-900/70 px-6 border-b border-gray-700 shadow-md">
                <div className="flex-1">
                    <NavLink to="/" className="btn btn-ghost normal-case text-3xl font-bold text-transparent bg-clip-text"
                        style={{ backgroundImage: 'linear-gradient(to right, #6366F1, #EC4899)', textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
                        CoderWorld<span className="text-xl opacity-70">.dev</span>
                    </NavLink>
                </div>
                <div className="flex-none">
                    <div className="dropdown dropdown-end ml-4">
                        <div tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-indigo-500 ring-offset-gray-900 ring-offset-2 hover:scale-105 transition-transform duration-200 shadow-lg">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
                                style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}>
                                {/* Display user's initial, safely handle null/undefined */}
                                <span className="text-lg font-bold">{user?.firstname?.charAt(0)?.toUpperCase() || '?'}</span> 
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow-xl menu bg-gray-800 rounded-box w-52 z-[60] border border-gray-700 backdrop-blur-md">
                            <li><NavLink to="/profile" className="hover:bg-indigo-500/20 py-2">Profile</NavLink></li>
                            {/* Conditionally render Admin Panel link if user is admin */}
                            {user?.role === 'admin' && <li><NavLink to="/admin" className="hover:bg-indigo-500/20 py-2">Admin Panel</NavLink></li>}
                            <div className="divider my-1 h-px bg-gray-700" />
                            <li><button onClick={() => dispatch(logoutUser())} className="text-red-400 hover:bg-red-400/20 py-2">Logout</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Profile Content Area */}
            <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                <div className="w-full lg:w-1/4 bg-gray-900/50 rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col items-center sticky top-28 h-fit animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl text-gray-400 border-4 border-indigo-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {/* Ensure profileData.firstname exists */}
                    <h2 className="text-2xl font-bold text-white mb-1">{profileData?.firstname || 'Guest User'}</h2>
                    <p className="text-gray-400 text-sm mb-6"> ID: <span className="text-indigo-400">{displayLeetcodeId}</span></p>

                    {/* Navigation Links */}
                    <ul className="menu w-full space-y-2">
                        <li>
                            <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'basicInfo' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
                                onClick={() => setActiveTab('basicInfo')}>
                                Basic Info
                            </button>
                        </li>
                        <li>
                            <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
                                onClick={() => setActiveTab('account')}>
                                Account
                            </button>
                        </li>
                        <li>
                            <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
                                onClick={() => setActiveTab('privacy')}>
                                Privacy
                            </button>
                        </li>
                        <li>
                            <button className={`btn btn-block justify-start text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70'}`}
                                onClick={() => setActiveTab('notifications')}>
                                Notifications
                            </button>
                        </li>
                        {/* Other static menu items as per screenshot */}
                        <li><a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">Points</a></li>
                        <li><a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">Lab</a></li>
                        <li><a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">Billing <span className="badge badge-sm badge-info text-blue-200 bg-blue-700/50 border-blue-600/50 ml-auto">New</span></a></li>
                        <li><a href="#" className="btn btn-block justify-start text-left px-4 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/70">Orders <span className="badge badge-sm badge-warning text-yellow-200 bg-yellow-700/50 border-yellow-600/50 ml-auto">Beta</span></a></li>
                    </ul>
                </div>

                {/* Right Content Area (Dynamically rendered based on activeTab) */}
                <div className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    {/* Conditionally render Basic Info tab only when profileData is available */}
                    {activeTab === 'basicInfo' && profileData && (
                        <div className="p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Basic Info</h3>
                            <div className="space-y-6">
                                {/* Name */}
                                {renderEditableField('firstname', profileData.firstname)}

                                {/* Gender */}
                                {renderEditableField('profile.gender', profileData.profile?.gender || 'Not provided', 'select', ['Not provided', 'Male', 'Female', 'Other'])}

                                {/* Location */}
                                {renderEditableField('profile.location', profileData.profile?.location)}

                                {/* Birthday */}
                                {renderEditableField('profile.birthday', profileData.profile?.birthday ? new Date(profileData.profile.birthday).toISOString().split('T')[0] : '', 'date')}

                                {/* Summary */}
                                {renderEditableField('profile.summary', profileData.profile?.summary, 'textarea')}

                                {/* Website */}
                                {renderEditableField('profile.website', profileData.profile?.website)}

                                {/* Github */}
                                {renderEditableField('profile.github', profileData.profile?.github)}

                                {/* LinkedIn */}
                                {renderEditableField('profile.linkedin', profileData.profile?.linkedin)}

                                {/* X (formerly Twitter) */}
                                {renderEditableField('profile.twitter', profileData.profile?.twitter)}

                                {/* Experience */}
                                <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Experience</h4>
                                {renderEditableField('profile.work', profileData.profile?.work)}
                                {renderEditableField('profile.education', profileData.profile?.education)}

                                {/* Skills */}
                                <h4 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">Skills</h4>
                                {renderEditableField('profile.skills', profileData.profile?.skills)}
                            </div>
                        </div>
                    )}

                    {/* Render other tabs. Their internal render functions already handle `!profileData` */}
                    {activeTab === 'account' && renderAccountInfo()}
                    {activeTab === 'privacy' && renderPrivacySettings()}
                    {activeTab === 'notifications' && renderNotificationSettings()}

                </div>
            </div>
        </div>
    );
}

export default ProfilePage;