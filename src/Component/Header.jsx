import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
<div className="flex items-center justify-between md:justify-center bg-white/80 backdrop-blur-md text-slate-800 p-4 shadow-lg border-b border-slate-200 sticky top-0 z-20">
      <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow hover:opacity-90">
        <Menu size={20} />
      </button>
      <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Music Player</h1>
    </div>
  );
};

export default Header;