import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Context/ContextProvider';
import axios from 'axios';
import Constant from './Constant';
import { ListMusic, Music } from 'lucide-react';

function AllPlayList({ playSong }) {
  const { user, useremail } = useContext(UserContext);
  const {playlist, setPlaylist} = useContext(UserContext);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all playlists for the user
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    axios
      .post(`${Constant.BASE_URL}/getplaylist`, { email: useremail })
      .then((response) => {
        setPlaylist(response.data?.playlists || []);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
      })
      .finally(() => setLoading(false));
  }, [user, useremail]);

  // Fetch songs of selected playlist
  const playlistOnClick = async (playlistId) => {
    if (activePlaylistId === playlistId) {
                setActivePlaylistId(null);
      setPlaylistSongs([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${Constant.BASE_URL}/playlistsongs`, {
        params: { playlistid: playlistId },
        withCredentials: true,
      });

      const songs = res.data?.songs || [];
      setPlaylistSongs(songs);
      setActivePlaylistId(playlistId);
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
      setPlaylistSongs([]);
      setActivePlaylistId(null);
    } finally {
      setLoading(false);
    }
  };

  // Play song from playlist
  const handlePlay = (index) => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs, index);
    }
  };

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">
        My Playlists
      </h1>

      {loading && <p className="text-indigo-600 mb-4">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {playlist.length > 0 ? (
          playlist.map((playlist) => (
            <div
              key={playlist.id}
              className={`rounded-2xl p-6 border border-slate-200 shadow cursor-pointer transition-colors duration-200 
                ${activePlaylistId === playlist.id ? 'bg-indigo-50' : 'bg-white/80 hover:bg-white/90 backdrop-blur-md'}`}
              onClick={() => playlistOnClick(playlist.id)}
            >
              <div className="flex items-center mb-4">
                <ListMusic size={24} className="mr-4 text-indigo-600" />
                <h2 className="text-2xl font-bold">{playlist.name}</h2>
              </div>

              {activePlaylistId === playlist.id && (
                <div className="space-y-4 mt-4">
                  {playlistSongs.length > 0 ? (
                    playlistSongs.map((song, index) => (
                      <div
                        key={song.id || index}
                        className="flex items-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(index);
                        }}
                      >
                        <Music size={20} className="mr-3 text-indigo-600" />
                        <div>
                          <p className="font-semibold">{song.name || 'Untitled Song'}</p>
                          <p className="text-sm text-slate-500">{song.artist || 'Unknown Artist'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No songs in this playlist.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-500">No playlists available.</p>
        )}
      </div>
    </div>
  );
}

export default AllPlayList;
