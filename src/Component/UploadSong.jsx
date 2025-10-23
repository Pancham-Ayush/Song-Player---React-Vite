import React, { useState, useContext } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Constant from './Constant';
import { UserContext } from '../Context/ContextProvider';

function UploadSong() {
  const navigate = useNavigate();
  const { isMobile, uploadPermission, isAdmin ,useremail } = useContext(UserContext);

  const [file, setFile] = useState(null);
  const [song, setSong] = useState({
    name: "",
    artist: "",
    genre: "",
    description: ""
  });
  const [message, setMessage] = useState("");

  // ✅ Block if not admin
  if (!isAdmin) {
    return (
      <div className="text-center mt-20 text-rose-600 font-bold">
        You are not allowed to upload songs. Only admins can upload.
      </div>
    );
  }

  // Mobile users without permission
  if (isMobile && !uploadPermission) {
    return (
      <div className="text-center mt-20 text-rose-600 font-bold">
        <div className="mt-4">
          <button
            onClick={() => alert("Approval request sent! Admin will approve shortly.")}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Request Approval
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setSong({
      ...song,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    setMessage("Please select a file!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("song", new Blob([JSON.stringify(song)], { type: "application/json" }));
  formData.append("mail", useremail);

  try {
    const response = await Axios({
      method: "post",
      url: `${Constant.BASE_URL}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setMessage(response.data.message);
    navigate('/');
  } catch (error) {
    console.error("Error uploading song:", error.response ? error.response.data : error);
    setMessage("Failed to upload song.");
  }
};

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Upload a New Song</h1>
      <div className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600">Song Name</label>
              <input id="name" name="name" type="text" placeholder="Enter song name" value={song.name} onChange={handleChange} required className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Artist</label>
              <input id="artist" name="artist" type="text" placeholder="Enter artist name" value={song.artist} onChange={handleChange} required className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Genre</label>
            <input id="genre" name="genre" type="text" placeholder="Enter genre" value={song.genre} onChange={handleChange} className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Description</label>
            <textarea id="description" name="description" placeholder="Write a short description..." value={song.description} onChange={handleChange} rows={4} className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Upload File</label>
            <input id="file" type="file" onChange={handleFileChange} className="w-full p-3 mt-1 bg-white border border-slate-200 rounded-xl" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl font-semibold transition-colors duration-200 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-90">
            Upload Song
          </button>
        </form>
        {message && <p className="mt-4 text-rose-600 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default UploadSong;
