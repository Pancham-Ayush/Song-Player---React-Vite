import React, { useState, useEffect, useContext } from "react";
import Constant from "./Constant";
import axios from "axios";
import { UserContext } from "../Context/ContextProvider";
import { Music, MoreVertical, ListMusic } from "lucide-react";

const Search_URL = Constant.Search_URL;

function SongList({ playSong }) {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // 🔑 CURSOR STACK (single source of truth)
  const [cursorStack, setCursorStack] = useState([null]);
  const [loading, setLoading] = useState(false);

  const { useremail } = useContext(UserContext);

  /* ================= PLAYLIST ================= */

  useEffect(() => {
    if (!useremail) return;

    axios
      .post(
        `${Search_URL}/getplaylist`,
        { email: useremail },
        { withCredentials: true }
      )
      .then((res) => setPlaylist(res.data.playlists || []))
      .catch(() => console.error("Failed to fetch playlist"));
  }, [useremail]);

  /* ================= GRAPHQL FETCH ================= */

  const fetchSongs = async (cursor) => {
    const res = await axios.post(
      `${Search_URL}/graphql`,
      {
        query: `
          query GetAllSongs($cursor: String, $chunkSize: Int!) {
            getAllSongs(cursor: $cursor, chunkSize: $chunkSize) {
              content {
                id
                name
                artist
              }
              nextCursor
            }
          }
        `,
        variables: {
          cursor,
          chunkSize: 10,
        },
      },
      { withCredentials: true }
    );

    return res.data.data.getAllSongs;
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    nextPage(); // uses null cursor
  }, []);

  /* ================= NAVIGATION ================= */

  const nextPage = async () => {
    if (loading) return;

    const currentCursor = cursorStack[cursorStack.length - 1];
    if (currentCursor === null && cursorStack.length > 1) return;

    setLoading(true);
    try {
      const page = await fetchSongs(currentCursor);
      setSongs(page.content);
      setCurrentSongIndex(0);

      if (page.nextCursor !== null) {
        setCursorStack((prev) => [...prev, page.nextCursor]);
      }
    } finally {
      setLoading(false);
    }
  };

  const previousPage = async () => {
    if (cursorStack.length <= 1 || loading) return;

    setLoading(true);
    try {
      const newStack = [...cursorStack];
      newStack.pop(); // remove current
      const prevCursor = newStack[newStack.length - 1];

      const page = await fetchSongs(prevCursor);
      setSongs(page.content);
      setCurrentSongIndex(0);
      setCursorStack(newStack);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PLAY ================= */

  const handlePlay = (index) => {
    setCurrentSongIndex(index);
    playSong(songs, index);
  };

  /* ================= PLAYLIST ADD ================= */

  const handleAddToPlaylist = async (songId, playlistId) => {
    if (!useremail) return alert("Login required");

    await axios.post(
      `${Search_URL}/addtoplaylist`,
      {
        email: useremail,
        songid: songId.toString(),
        playlistid: playlistId.toString(),
      },
      { withCredentials: true }
    );

    setOpenMenu(null);
  };

  /* ================= UI ================= */

  return (
    <div className="text-slate-900">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-rose-500 to-cyan-500">
        All Songs
      </h1>

      <div className="space-y-4">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="relative flex items-center p-4 rounded-2xl bg-white/80 hover:bg-white shadow border"
          >
            <div
              onClick={() => handlePlay(index)}
              className="flex-1 flex items-center cursor-pointer"
            >
              <Music size={24} className="mr-4 text-indigo-600" />
              <div>
                <p className="font-semibold">{song.name}</p>
                <p className="text-sm text-slate-500">{song.artist}</p>
              </div>
            </div>

            <button
              onClick={() => setOpenMenu(song.id)}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={previousPage}
          disabled={cursorStack.length <= 1 || loading}
          className="px-4 py-2 bg-slate-600 text-white rounded-xl disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={nextPage}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* PLAYLIST MODAL */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center"
          onClick={() => setOpenMenu(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ListMusic /> Add to Playlist
            </h3>

            {playlist.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handleAddToPlaylist(openMenu, pl.id)}
                className="block w-full text-left p-2 hover:bg-slate-100 rounded"
              >
                {pl.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SongList;
