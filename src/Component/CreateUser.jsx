import Constant from './Constant';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../Context/ContextProvider";

function CreateUser() {
  const [name, setName] = useState('');
  const [tempemail, setTempEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { user, setUser } = useContext(UserContext);  
  const { setIsAdmin } = useContext(UserContext);
  const { useremail, setUserEmail } = useContext(UserContext);
  const navigate = useNavigate();

  // Navigate after user state is properly set
  useEffect(() => {
    if (shouldNavigate && user) {
      navigate('/');
      setShouldNavigate(false);
    }
  }, [user, shouldNavigate, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const cur = await axios.post(`${Constant.BASE_URL}/createuser`, { name, email: tempemail, password }, { withCredentials: true });
      if (cur.data.message === "User created successfully") {
        setUser(cur.data.username);
        setIsAdmin(cur.data.admin);
        setUserEmail(cur.data.email);
        setShouldNavigate(true);
      } else {
        setError(cur.data.message);
      }
    } catch (err) {
      setError('Create user failed');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-rose-50 to-cyan-50 text-slate-900">
      <div className="p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">Name</label>
            <input 
              className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text" 
              placeholder="Your Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <input 
              className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email" 
              placeholder="your.email@example.com" 
              value={tempemail} 
              onChange={(e) => setTempEmail(e.target.value)} 
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
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default CreateUser;