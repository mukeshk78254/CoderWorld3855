// import React, { useState } from 'react';
// import { Plus, Edit, Trash2, Home, RefreshCw, Zap,Video } from 'lucide-react';

// import { NavLink } from 'react-router';

// function Admin() {
//   const [selectedOption, setSelectedOption] = useState(null);

//   const adminOptions = [
//     {
//       id: 'create',
//       title: 'Create Problem',
//       description: 'Add a new coding problem to the platform',
//       icon: Plus,
//       color: 'btn-success',
//       bgColor: 'bg-success/10',
//       route: '/admin/create'
//     },
//     {
//       id: 'update',
//       title: 'Update Problem',
//       description: 'Edit existing problems and their details',
//       icon: Edit,
//       color: 'btn-warning',
//       bgColor: 'bg-warning/10',
//       route: '/admin/update'
//     },
//     {
//       id: 'delete',
//       title: 'Delete Problem',
//       description: 'Remove problems from the platform',
//       icon: Trash2,
//       color: 'btn-error',
//       bgColor: 'bg-error/10',
//       route: '/admin/delete'
//     },
 
//         {
//           id: 'video',
//           title: 'Video Problem',
//           description: 'Upload And Delete Videos',
//           icon: Video,
//           color: 'btn-success',
//           bgColor: 'bg-success/10',
//           route: '/admin/video'
//         }
//   ];

//   return (
//     <div className="min-h-screen bg-base-200">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-base-content mb-4">
//             Admin Panel
//           </h1>
//           <p className="text-base-content/70 text-lg">
//             Manage coding problems on your platform
//           </p>
//         </div>

//         {/* Admin Options Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {adminOptions.map((option) => {
//             const IconComponent = option.icon;
//             return (
//               <div
//                 key={option.id}
//                 className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
//               >
//                 <div className="card-body items-center text-center p-8">
//                   {/* Icon */}
//                   <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
//                     <IconComponent size={32} className="text-base-content" />
//                   </div>
                  
//                   {/* Title */}
//                   <h2 className="card-title text-xl mb-2">
//                     {option.title}
//                   </h2>
                  
//                   {/* Description */}
//                   <p className="text-base-content/70 mb-6">
//                     {option.description}
//                   </p>
                  
//                   {/* Action Button */}
//                   <div className="card-actions">
//                     <div className="card-actions">
//                     <NavLink 
//                     to={option.route}
//                    className={`btn ${option.color} btn-wide`}
//                    >
//                    {option.title}
//                    </NavLink>
//                    </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Admin;
// src/components/Admin.jsx
import React from 'react';
import { Plus, Edit, Trash2, Video, Home, Settings, Zap } from 'lucide-react'; // More relevant icons
import { NavLink } from 'react-router-dom'; // Corrected import for NavLink

// Tailwind CSS keyframes for custom animations (add this to your main CSS file or a dedicated CSS file)
// Example in src/index.css or src/App.css:
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
.animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
*/


function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a brand new coding problem with comprehensive details.',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-emerald-500/20', // Custom color for icon background
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Modify existing problems, test cases, and solutions.',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-amber-500/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Permanently remove problems and their associated data.',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-rose-500/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload, update, or delete video solutions for problems.',
      icon: Video,
      color: 'btn-info',
      bgColor: 'bg-sky-500/20',
      route: '/admin/video'
    }
    // You can add more options here, e.g., for user management, settings etc.
    // {
    //   id: 'settings',
    //   title: 'Admin Settings',
    //   description: 'Configure general platform settings and preferences.',
    //   icon: Settings,
    //   color: 'btn-secondary',
    //   bgColor: 'bg-purple-500/20',
    //   route: '/admin/settings'
    // }
  ];

  return (
    <div className="min-h-screen bg-base-200 text-base-content relative overflow-hidden">
      {/* Background/Watermark effect - you might want to put this in your App.js or global CSS */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-300 to-base-200 opacity-80 z-0"></div>
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, var(--fallback-bc,oklch(var(--bc)/0.05)) 0, var(--fallback-bc,oklch(var(--bc)/0.05)) 2px, transparent 2px, transparent 10px)`,
          backgroundSize: '10px 10px'
        }}
      ></div>
      {/* End Background/Watermark */}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-5xl font-extrabold text-primary-content mb-5 tracking-tight drop-shadow-lg">
            <span className="text-secondary">CodeFlow</span> Admin Panel
          </h1>
          <p className="text-base-content/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Empower your platform by efficiently managing coding problems, solutions, and content.
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {adminOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl hover:shadow-primary/30 
                            transition-all duration-300 transform hover:-translate-y-2 cursor-pointer 
                            animate-fade-in-up delay-${index * 100}`}
              >
                <div className="card-body items-center text-center p-8">
                  {/* Icon */}
                  <div className={`${option.bgColor} p-5 rounded-full mb-6`}>
                    <IconComponent size={36} className="text-base-content" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="card-title text-2xl font-bold mb-3 text-accent-content">
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-base-content/70 mb-8 text-sm leading-relaxed">
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="card-actions">
                    <NavLink 
                      to={option.route}
                      className={`btn ${option.color} btn-lg btn-block transition-all duration-300 hover:scale-[1.02]`}
                    >
                      <IconComponent className="w-5 h-5 mr-2" />
                      {option.title.split(' ')[0] === 'Manage' ? 'Go to Manager' : option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* You can add a subtle footer or copyright here */}
        <footer className="text-center text-base-content/60 mt-16 text-sm">
          © {new Date().getFullYear()} CodeFlow. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Admin;