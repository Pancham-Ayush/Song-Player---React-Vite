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

  /* 🔔 NOTIFICATION STATE */
  const [notifications, setNotifications] = useState([]);

  const playSong = (songs, index) => {
    setQueue(songs);
    setCurrentSongIndex(index);
  };

  /* 🔥 SSE CONNECTION – OPEN ONCE */
  useEffect(() => {
    if (!user) return; // only connect when logged in

const eventSource = new EventSource(
  "http://localhost:8080/s3/upload/notification/stream",
  { withCredentials: true }
);

    eventSource.onmessage = (event) => {
      setNotifications((prev) => [
        { id: Date.now(), message: event.data },
        ...prev,
      ]);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
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
              minWidth: "250px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{n.message}</span>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((x) => x.id !== n.id)
                )
              }
              style={{
                marginLeft: "12px",
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
        {/* Auth routes */}
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/createuser"
          element={!user ? <CreateUser setUser={setUser} /> : <Navigate to="/" replace />}
        />
        <Route path="/logout" element={<Logout />} />

        {/* Main App Routes */}
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

      {/* PLAYER */}
      <Player
        queue={queue}
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
      />
    </>
  );
}

export default App;
