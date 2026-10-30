import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#edf2ff] flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex-1 flex max-w-[1720px] w-full mx-auto px-2 sm:px-4 lg:px-6">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
