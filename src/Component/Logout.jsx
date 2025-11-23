import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import Constant from './Constant';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/ContextProvider';

const Logout = () => {
  const { setUser } = useContext(UserContext);
  const { setUserEmail } = useContext(UserContext);
  const { setIsAdmin } = useContext(UserContext);
  const { setPlaylist } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(`${Constant.Login_URL}/logout`, {}, { withCredentials: true });
      } catch (err) {
        console.error('Logout failed on server, clearing client session anyway', err);
      } finally {
        setUser(null);
        setUserEmail(null);
        setIsAdmin(false);
        setPlaylist([]);
        navigate('/login');
      }
    };

    performLogout();
  }, [setUser, navigate, setIsAdmin, setPlaylist, setUserEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-rose-50 to-cyan-50 text-slate-900">
      <div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 shadow">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Logging Out</h1>
        <p className="text-lg text-slate-600">Please wait while we securely log you out...</p>
      </div>
    </div>
  );
};

export default Logout;
