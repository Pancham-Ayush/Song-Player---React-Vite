import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { X } from "lucide-react";
import Constant from './Constant'
function SongPlayer() {
  const [songId, setSongId] = useState("");
  const [validSong, setValidSong] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePlay = async () => {
    if (!songId) {
      setError("Please enter a song ID.");
      return;
    }
    setLoading(true);
    setError("");
    setValidSong(false);

    try {
      const response = await fetch(`${Constant.BASE_URL}/playsong/get/${songId}`, {
        method: "GET",
      });

      if (response.ok) {
        setValidSong(true);
      } else {
        setError("Song not found. Please check the ID.");
      }
    } catch (error) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValidSong(false);
    setSongId("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-extrabold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">🎶 Music Player</h1>
          <Button color="light" onClick={() => navigate("/")}>Home</Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto text-center py-10 px-4">
        <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">Play Your Song</h2>

        <div className="flex justify-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Song ID"
            value={songId}
            onChange={(e) => setSongId(e.target.value)}
            className="px-4 py-2 w-2/3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <Button
            onClick={handlePlay}
            disabled={loading || !songId}
            color="blue"
          >
            {loading ? "Checking..." : "Play"}
          </Button>
        </div>

        {error && <p className="text-rose-600 mb-4">{error}</p>}

        {validSong && (
          <div className="mt-6 relative">
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
              title="Close player"
            >
              <X size={16} />
            </button>
            <audio
              controls
              autoPlay
              src={`${Constant.BASE_URL}/playsong/get/${songId}`}
              className="w-full rounded-xl shadow"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default SongPlayer;
