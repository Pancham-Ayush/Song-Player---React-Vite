import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Constant from './Constant';
import { UserContext } from '../Context/ContextProvider';

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const { setIsAdmin, setUserEmail } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(
        `${Constant.Login_URL}/manual-login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.username);
      setUserEmail(res.data.email);
      setIsAdmin(res.data.admin);
      navigate('/'); 
    } catch (err) {
      console.error(err); 
      setError('Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Open Google OAuth in a popup
      const popup = window.open(
        `${Constant.Login_URL}/oauth2/authorization/google?prompt=select_account`,
        "_blank",
        "width=500,height=600"
      );

      // Polling to check when popup closes
      const checkPopup = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkPopup);
          try {
            // After successful login, fetch user info from Security Microservice
            const res = await axios.get(`${Constant.Login_URL}/google/me`, {
              withCredentials: true,
            });
            setUser(res.data.username);
            setUserEmail(res.data.email);
            setIsAdmin(res.data.admin);
            navigate('/');
          } catch (err) {
            console.error(err);
            setError('Google login failed');
          }
        }
      }, 500);
    } catch (err) {
      console.error(err);
      setError('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-rose-50 to-cyan-50 text-slate-900">
      <div className="p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <input 
              className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email" 
              placeholder="your.email@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input 
              className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            className="w-full py-3 rounded-xl font-semibold transition-colors duration-200 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-90"
            type="submit"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 py-3 rounded-xl font-semibold transition-colors duration-200 bg-red-600 text-white hover:opacity-90"
        >
          Login with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/createuser" className="text-indigo-600 hover:underline">Create one</Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or <Link to="/songs" className="text-cyan-600 hover:underline">continue as guest</Link> to browse songs.
        </p>
      </div>
    </div>
  );
}
