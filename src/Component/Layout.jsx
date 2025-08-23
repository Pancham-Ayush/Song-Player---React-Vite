import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserContext } from '../Context/ContextProvider';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAdmin } = useContext(UserContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
<div className="flex h-screen bg-gradient-to-br from-white via-rose-50 to-cyan-50 text-slate-800">
      <Sidebar key={`${user}-${isAdmin}`} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 pb-48 md:pb-52">
<div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
