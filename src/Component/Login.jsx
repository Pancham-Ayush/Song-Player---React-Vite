import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Constant from './Constant';
import { UserContext } from '../Context/ContextProvider';

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAdmin } = useContext(UserContext);
  const [error, setError] = useState('');
  const { setUserEmail } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${Constant.BASE_URL}/login`, { email, password }, { withCredentials: true });
      const me = await axios.get(`${Constant.BASE_URL}/current-user`, { withCredentials: true });
      setUser(me.data.username);
      setUserEmail(me.data.email);
      setIsAdmin(me.data.admin);
    } catch (error) {
      setError('Login failed');
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
