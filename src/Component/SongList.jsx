import React, { useState, useEffect, useContext } from "react";
import Constant from "./Constant";
import axios from "axios";
import { UserContext } from "../Context/ContextProvider";
import { Music, MoreVertical, ListMusic } from 'lucide-react';

const BASE_URL = Constant.BASE_URL;

function SongList({ playSong }) {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const { useremail } = useContext(UserContext);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!useremail) return;
      try {
        const response = await axios.post(
          `${BASE_URL}/getplaylist`,
          { email: useremail },
          { withCredentials: true }
        );
        setPlaylist(response.data.playlists || []);
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      }
    };
    fetchPlaylist();
  }, [useremail]);

  // Fetch songs with pagination
  useEffect(() => {
  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/allsongs`, {
        params: { page: currentPage, chunk: 20 },
        withCredentials: true, 
      });
      const newSongs = res.data.content || [];
      setSongs(newSongs);
      setTotalPage(res.data.totalPages || 0);
      setCurrentSongIndex(0);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    }
  };
  fetchSongs();
}, [currentPage]);

  // Play a song by index
  const handlePlay = (index) => {
    setCurrentSongIndex(index);
    playSong(songs, index);
  };


  // Add song to playlist
  const handleAddToPlaylist = async (songId, playlistId) => {
    if (!useremail) {
      alert("Please log in to add songs to playlist");
      return;
    }
    
    if (!songId || !playlistId) {
      alert("Invalid song or playlist selection");
      return;
    }
    
    try {
      const res = await axios.post(
        `${BASE_URL}/addtoplaylist`,
        { 
          email: useremail, 
          songid: songId.toString(), 
          playlistid: playlistId.toString() 
        },
        { withCredentials: true }
      );
      
      alert(res.data.message || "Song added to playlist successfully");
      setOpenMenu(null);
    } catch (err) {
      let errorMessage = "Failed to add song to playlist";
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = "Network error - please check your connection";
      }
      
      alert(errorMessage);
    }
  };

  const toggleMenu = (songId) => {
    setOpenMenu(openMenu === songId ? null : songId);
  };

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">
        All Songs
      </h1>

      <div className="space-y-4">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={song.id}
              className={`relative flex items-center p-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white transition duration-200 cursor-pointer shadow hover:shadow-md border border-slate-200 ${openMenu === song.id ? 'z-40' : 'z-0'}`}
            >
              <div onClick={() => handlePlay(index)} className="flex-1 flex items-center">
                <Music size={24} className="mr-4 text-indigo-600" />
                <div>
                  <p className="font-semibold">{song.name}</p>
                  <p className="text-sm text-slate-500">{song.artist}</p>
                </div>
              </div>

              <div className="relative z-50">
                <button onClick={() => toggleMenu(song.id)} className="p-2 rounded-full hover:bg-slate-100">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500">No songs available.</p>
        )}
      </div>


      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-3">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-indigo-700"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-slate-600">
          Page {currentPage + 1} of {totalPage}
        </span>
        <button
          disabled={currentPage + 1 >= totalPage}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-cyan-700"
        >
          Next
        </button>
      </div>

      {/* Playlist Modal */}
      {openMenu && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setOpenMenu(null)}
        >
          <div
            className="w-full md:max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-4 md:p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListMusic className="text-indigo-600" />
                <h3 className="text-lg font-semibold">Add to Playlist</h3>
              </div>
              <button
                className="px-2 py-1 rounded-lg hover:bg-slate-100"
                onClick={() => setOpenMenu(null)}
              >
                Close
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {playlist.length === 0 ? (
                <p className="p-3 text-sm text-slate-500">No playlists available</p>
              ) : (
                playlist.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(openMenu, pl.id)}
                    className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-lg flex items-center gap-3"
                  >
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    <span className="font-medium">{pl.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongList;