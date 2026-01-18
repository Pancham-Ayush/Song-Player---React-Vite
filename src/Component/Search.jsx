import React, { useState, useContext } from "react";
import axios from "axios";
import Constant from "./Constant";
import { Music, MoreVertical, Search } from "lucide-react";
import { UserContext } from "../Context/ContextProvider";

const BASE_URL = Constant.BASE_URL;

export default function SearchPage({ playSong }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const { useremail } = useContext(UserContext);

  // Search function
  const handleSearch = async () => {
    if (!query.trim()) return; // ignore empty queries
    try {
      const res = await axios.get(`${Constant.Search_URL}/search`, {
        params: { query },
        withCredentials: true,
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    }
  };

  const handlePlay = (index) => {
    playSong(results, index);
  };

  const toggleMenu = (songId) => {
    setOpenMenu(openMenu === songId ? null : songId);
  };

  return (
    <div className="text-slate-900 p-6">
      <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">
        Search Songs
      </h1>

      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type song name or artist..."
          className="flex-1 px-4 py-2 border rounded-xl"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((song, index) => (
            <div
              key={song.id}
              className={`relative flex items-center p-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white transition duration-200 cursor-pointer shadow hover:shadow-md border border-slate-200 ${
                openMenu === song.id ? "z-40" : "z-0"
              }`}
            >
              <div
                onClick={() => handlePlay(index)}
                className="flex-1 flex items-center"
              >
                <Music size={24} className="mr-4 text-indigo-600" />
                <div>
                  <p className="font-semibold">{song.name}</p>
                  <p className="text-sm text-slate-500">{song.artist}</p>
                </div>
              </div>

              <div className="relative z-50">
                <button
                  onClick={() => toggleMenu(song.id)}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500">
            {query ? "No results found." : "Type a query to search songs."}
          </p>
        )}
      </div>
    </div>
  );
}
