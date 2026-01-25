import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";

import Login from "./Component/Login";
import CreateUser from "./Component/CreateUser";
import Home from "./Component/Home";
import UploadSong from "./Component/UploadSong";
import SongPlayer from "./Component/SongPlayer";
import SongList from "./Component/SongList";
import Search from "./Component/Search";
import CreatePlaylist from "./Component/CreatePlaylist";
import Logout from "./Component/Logout";
import { UserContext } from "./Context/ContextProvider";
import AllPlayList from "./Component/AllPlayList";
import Layout from "./Component/Layout";
import Player from "./Component/Player";
import DeleteSong from "./Component/DeleteSong";
import SearchYt from "./Component/SearchYt";

function App() {
  const { user, setUser } = useContext(UserContext);

  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);

  /* 🔔 Notifications now store SONG OBJECT */
  const [notifications, setNotifications] = useState([]);

  /* ===============================
     PLAY FULL LIST (playlist/search)
     =============================== */
  const playSong = (songs, index) => {
    setQueue(songs);
    setCurrentSongIndex(index);
  };

  /* =================================================
     PLAY FROM NOTIFICATION (interrupt + continue queue)
     ================================================= */
  const playSongFromNotification = (song) => {
    setQueue((prevQueue) => {
      // If nothing is playing
      if (currentSongIndex === null || prevQueue.length === 0) {
        setCurrentSongIndex(0);
        return [song];
      }

      const before = prevQueue.slice(0, currentSongIndex + 1);
      const after = prevQueue.slice(currentSongIndex + 1);

      return [...before, song, ...after];
    });

    // Jump playback to inserted song
    setCurrentSongIndex((prev) => prev + 1);
  };

  /* 🔥 SSE CONNECTION */
  useEffect(() => {
    if (!user) return;

    const eventSource = new EventSource(
      "http://localhost:8080/s3/upload/notification/stream",
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      try {
        const song = JSON.parse(event.data);

        setNotifications((prev) => [
          {
            id: Date.now(),
            song,
          },
          ...prev,
        ]);
      } catch (e) {
        console.error("Invalid SSE data:", event.data);
      }
    };

    eventSource.onerror = () => eventSource.close();

    return () => eventSource.close();
  }, [user]);

  return (
    <>
      {/* 🔔 GLOBAL NOTIFICATION UI */}
      <div
        style={{
          position: "fixed",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              background: "#000",
              color: "#fff",
              padding: "10px 16px",
              marginBottom: "8px",
              borderRadius: "6px",
              minWidth: "260px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <strong>{n.song.name}</strong>
              <div style={{ fontSize: "12px", color: "#aaa" }}>
                {n.song.artist}
              </div>

              <button
                onClick={() => {
                  playSongFromNotification(n.song);
                  setNotifications((prev) =>
                    prev.filter((x) => x.id !== n.id)
                  );
                }}
                style={{
                  marginTop: "6px",
                  background: "#1db954",
                  border: "none",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ▶ Play
              </button>
            </div>

            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((x) => x.id !== n.id)
                )
              }
              style={{
                background: "transparent",
                border: "none",
                color: "#aaa",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* ROUTES */}
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/createuser"
          element={!user ? <CreateUser setUser={setUser} /> : <Navigate to="/" replace />}
        />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={user ? <Home /> : <Navigate to="/songs" replace />} />
                <Route path="/songs" element={<SongList playSong={playSong} />} />
                <Route path="/search" element={user ? <Search playSong={playSong} /> : <Navigate to="/login" replace />} />
                <Route path="/upload" element={user ? <UploadSong /> : <Navigate to="/" replace />} />
                <Route path="/play" element={user ? <SongPlayer /> : <Navigate to="/login" replace />} />
                <Route path="/createplaylist" element={user ? <CreatePlaylist /> : <Navigate to="/login" replace />} />
                <Route path="/playlist" element={user ? <AllPlayList playSong={playSong} /> : <Navigate to="/login" replace />} />
                <Route path="/ytsearch" element={user ? <SearchYt /> : <Navigate to="/login" replace />} />
                <Route path="/delete" element={user ? <DeleteSong playSong={playSong} /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>

      {/* 🎵 PLAYER */}
      <Player
        queue={queue}
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
      />
    </>
  );
}

export default App;
