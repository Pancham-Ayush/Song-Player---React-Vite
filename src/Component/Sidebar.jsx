import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Music, ListMusic, Upload, PlusSquare, LogOut, LogIn,DeleteIcon } from 'lucide-react';
import { UserContext } from '../Context/ContextProvider';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, isAdmin } = useContext(UserContext);

  // Create nav links dynamically based on current state
  const getNavLinks = () => {
    if (user) {
      const loggedInLinks = [
        { to: '/', text: 'Home', icon: <Home size={24} /> },
        { to: '/songs', text: 'All Songs', icon: <Music size={24} /> },
        { to: '/playlist', text: 'My Playlists', icon: <ListMusic size={24} /> },
        { to: '/createplaylist', text: 'Create Playlist', icon: <PlusSquare size={24} /> },
        { to: '/upload', text: 'Upload Song', icon: <Upload size={24} /> },
        { to: '/ytsearch', text: 'YouTube Search', icon: <Music size={24} /> },
      ];

      // Add admin-only links
      if (isAdmin) {
        loggedInLinks.push(
          { to: '/delete', text: 'Delete Song', icon: <DeleteIcon size={24} /> }
        );
      }
      return loggedInLinks;
    } else {
      return [
        { to: '/songs', text: 'All Songs', icon: <Music size={24} /> },
        { to: '/login', text: 'Login', icon: <LogIn size={24} /> },
      ];
    }
  };

  const navLinks = getNavLinks();

  // Force re-render when user state changes
  useEffect(() => {
    // This effect will run whenever user state changes
    console.log('User state changed in Sidebar:', user);
  }, [user, isAdmin]);


  return (
<div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-xl shadow-xl text-slate-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-slate-200`}>
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Music Player</h1>
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
          <ListMusic size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
`flex items-center px-4 py-2 rounded-xl transition duration-200 ${
                isActive ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
            onClick={toggleSidebar}
          >
            {link.icon}
            <span className="ml-4 font-medium">{link.text}</span>
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="p-4 border-t border-slate-200">
          <NavLink
            to="/logout"
            className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl"
          >
            <LogOut size={24} />
            <span className="ml-4 font-medium">Logout</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;