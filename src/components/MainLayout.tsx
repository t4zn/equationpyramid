import React from 'react';
import BottomNavBar from './BottomNavBar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow overflow-auto">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
};

export default MainLayout; 