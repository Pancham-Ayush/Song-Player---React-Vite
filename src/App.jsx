import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import axios from "axios";

import Login from "./Component/Login";
import CreateUser from "./Component/CreateUser";
import Home from "./Component/Home";
import UploadSong from "./Component/UploadSong";
import SongPlayer from "./Component/SongPlayer";
import SongList from "./Component/SongList";
import Constant from "./Component/Constant";
import CreatePlaylist from "./Component/CreatePlaylist";
import Logout from "./Component/Logout";
import { UserContext } from "./Context/ContextProvider";
import AllPlayList from "./Component/AllPlayList";
import Layout from "./Component/Layout";
import Player from "./Component/Player";
import DeleteSong from "./Component/DeleteSong";
import SearchYt from "./Component/SearchYt";

function App() {
  const { user, setUser, isMobile, setisMobile } = useContext(UserContext);
  const { useremail, setUserEmail } = useContext(UserContext);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);

  const playSong = (songs, index) => {
    setQueue(songs);
    setCurrentSongIndex(index);
  };

  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />} />
        <Route path="/createuser" element={!user ? <CreateUser setUser={setUser} /> : <Navigate to="/" replace />} />
        <Route path="/logout" element={<Logout />} />

        {/* Main App Routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={user ? <Home /> : <Navigate to="/songs" replace />} />
                <Route path="/songs" element={<SongList playSong={playSong} />} />
                {/* UploadSong is hidden on mobile */}
                <Route path="/upload" element={user ? <UploadSong /> : <Navigate to="/" replace />} />
<Route 
  path="/play" 
  element={user ? <SongPlayer /> : <Navigate to="/login" replace />} 
/>
                <Route path="/createplaylist" element={user ? <CreatePlaylist /> : <Navigate to="/login" replace />} />
                <Route path="/playlist" element={user ? <AllPlayList playSong={playSong} /> : <Navigate to="/login" replace />} />
                <Route path="/ytsearch" element={user ? <SearchYt/>: <Navigate to="/login" replace />} />
                <Route path="/delete" element={user ? <DeleteSong playSong={playSong} /> : <Navigate to="/login" replace />} /> 
                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>

      {/* Player Component */}
      <Player queue={queue} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} />

    
    </>
  );
}

export default App;