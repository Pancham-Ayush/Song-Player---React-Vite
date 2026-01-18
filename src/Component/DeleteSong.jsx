import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Constant from "./Constant";
import { UserContext } from "../Context/ContextProvider";
import { Trash2, Music } from "lucide-react";

const BASE_URL = Constant.BASE_URL;

function DeleteSong() {
  const { useremail } = useContext(UserContext);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const pageSize = 20;

  // 🔹 Fetch Songs (Paginated)
  const fetchSongs = async (page = currentPage) => {
    try {
      setLoading(true);

      const res = await axios.get(`${Constant.Search_URL}/allsongs`, {
        params: {
          page: page,
          chunk: pageSize,
        },
        withCredentials: true,
      });

      setSongs(res.data.content || []);
      setTotalPage(res.data.totalPages || 0);
    } catch (err) {
      console.error("❌ Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load whenever page changes
  useEffect(() => {
    fetchSongs(currentPage);
  }, [currentPage]);

  // 🔹 Delete with smart pagination fix
  const handleDelete = async () => {
    try {
      await axios.post(
        `${BASE_URL}/delete`,
        { id: selected, email: useremail },
        { withCredentials: true }
      );

      setSelected(null);

      // Reload current page
      const res = await axios.get(`${Constant.Search_URL}/allsongs`, {
        params: { page: currentPage, chunk: pageSize },
        withCredentials: true,
      });

      const newSongs = res.data.content || [];
      const newTotalPages = res.data.totalPages || 0;

      // If current page becomes empty → move back
      if (newSongs.length === 0 && currentPage > 0) {
        setCurrentPage((p) => p - 1);
      } else {
        setSongs(newSongs);
        setTotalPage(newTotalPages);
      }

    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Unauthorized or failed to delete song");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading songs...</p>;
  }

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-500 to-orange-500">
        Delete Songs
      </h1>

      <div className="space-y-4">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song.id}
              className="relative flex items-center p-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white transition duration-200 cursor-pointer shadow hover:shadow-md border border-slate-200"
            >
              <div className="flex-1 flex items-center gap-4">
                <Music size={24} className="text-rose-600" />
                <div>
                  <p className="font-semibold">{song.name}</p>
                  <p className="text-sm text-slate-500">{song.artist}</p>
                </div>
              </div>

              <button
                onClick={() => setSelected(song.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
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
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-rose-700"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-slate-600">
          Page {currentPage + 1} of {totalPage}
        </span>

        <button
          disabled={currentPage + 1 >= totalPage}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-orange-700"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full md:max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Confirm Delete
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to permanently delete this song?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-xl bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 size={18} />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteSong;
