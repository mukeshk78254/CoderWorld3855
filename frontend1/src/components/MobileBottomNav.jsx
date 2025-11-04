import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Code2, 
  Trophy, 
  MessageSquare, 
  User, 
  FileText 
} from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/problems', icon: Code2, label: 'Problems' },
    { path: '/contests', icon: Trophy, label: 'Contests' },
    { path: '/discuss', icon: MessageSquare, label: 'Discuss' },
    { path: '/submissions', icon: FileText, label: 'Submissions' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-50 safe-bottom">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                active 
                  ? 'text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${active ? 'stroke-2' : 'stroke-1.5'}`} 
              />
              <span className={`text-xs ${active ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
