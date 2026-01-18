import React, { useState, useContext } from 'react';
import Constant from './Constant';
import axios from 'axios';
import { UserContext } from '../Context/ContextProvider';

function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { useremail } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const cur = await axios.post(`${Constant.Search_URL}/createplaylist`, { name: playlistName, email: useremail }, { withCredentials: true });
      if (cur.data.message === "Playlist created successfully") {
        setSuccess(cur.data.message);
        setPlaylistName("");
      } else {
        setError("Unexpected response from server");
      }
    } catch (error) {
      setError("Failed to create playlist. Please try again.");
    }
  };

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Create a New Playlist</h1>
      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">Playlist Name</label>
            <input
              className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="My Awesome Playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>
          <button
            className="w-full py-3 rounded-xl font-semibold transition-colors duration-200 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-90"
            type="submit"
          >
            Create Playlist
          </button>
        </form>
        {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default CreatePlaylist;
