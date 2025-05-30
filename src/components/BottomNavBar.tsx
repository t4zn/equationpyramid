import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, Settings } from 'lucide-react';

const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/leaderboards', icon: Trophy, label: 'Leaderboard' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-lg bg-black text-white h-16 flex justify-around items-center rounded-full shadow-lg px-4">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-nav-active' : 'text-gray-400'}`
          }
        >
          <item.icon size={24} />
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavBar;
