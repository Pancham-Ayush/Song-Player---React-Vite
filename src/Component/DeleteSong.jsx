import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Constant from "./Constant";
import { UserContext } from "../Context/ContextProvider";
import { Trash2 } from "lucide-react";

function DeleteSong() {
  const { useremail } = useContext(UserContext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Function to fetch songs
  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${Constant.BASE_URL}/allsongs/delete`);
      setSongs(res.data.songs);
    } catch (err) {
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(`${Constant.BASE_URL}/delete`, {
        id,
        email: useremail,
      });
      alert(res.data.Message);
      // Re-fetch the song list to ensure it's up to date
      fetchSongs();
      setSelected(null);
    } catch (err) {
      alert("Error deleting song or unauthorized!");
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading songs...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Delete Songs</h2>
      {songs.length === 0 ? (
        <p>No songs available</p>
      ) : (
        <div className="grid gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className={`p-4 rounded-xl shadow-md flex flex-col gap-2 ${
                selected === song.id ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{song.name}</span>
                {selected === song.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(song.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(song.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeleteSong;