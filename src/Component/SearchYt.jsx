import React, { useState } from "react";
import axios from "axios";
import Constant from "../Component/Constant";

const YoutubeVideoItem = ({ item, handleDownload }) => (
  <div
    key={item.url}
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "5px",
      display: "flex",
      gap: "20px",
      alignItems: "center",
    }}
  >
    <img
      src={item.thumbnailUrl}
      alt={item.title}
      style={{ width: "120px", height: "90px", objectFit: "cover" }}
    />
    <div>
      <h3>{item.title}</h3>
      <p style={{ fontSize: "0.9em", color: "#555" }}>
        Channel: {item.channelName}
      </p>
      <p
        style={{
          fontSize: "0.8em",
          color: "#777",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "400px",
        }}
      >
        {item.description}
      </p>
      <button
        onClick={() => handleDownload(item)}
        style={{
          padding: "8px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
          marginTop: "5px",
        }}
      >
        Download (AI Verify)
      </button>
    </div>
  </div>
);

function SearchYt() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [previousPageToken, setPreviousPageToken] = useState(null);

  // --- Fetch results from backend ---
  const fetchResults = async (searchQuery, token = null) => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query or YouTube URL.");
      return;
    }
    setError("");
    setStatusMessage("");

    try {
      const res = await axios.get(`${Constant.BASE_URL}/SearchOnYt`, {
        params: { query: searchQuery, token: token },
      });


      setResult(res.data.yt || []);
      setNextPageToken(res.data.nextPageToken || null);
      setPreviousPageToken(res.data.prevPageToken || null);
    } catch (err) {
      console.error("Search request failed:", err);
      setError("Search failed. Check API URL or network connection.");
    }
  };

  // --- Handle search form submit ---
  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(query);
  };

  // --- Handle pagination ---
  const handlePagination = (token) => {
    if (!token) return;
    fetchResults(query, token);
  };

  // --- Handle AI Download ---
  const handleDownload = async (youtubeVideo) => {
    setError("");
    setStatusMessage("Initiating AI verification and download...");

    const payload = {
      title: youtubeVideo.title,
      url: youtubeVideo.url,
      thumbnailUrl: youtubeVideo.thumbnailUrl,
      channelName: youtubeVideo.channelName,
      description: youtubeVideo.description,
    };

    try {
      const res = await axios.post(
        `${Constant.BASE_URL}/AiDownloading`,
        payload
      );
      console.log("Download response:", res.data);
      setStatusMessage(res.data);
    } catch (err) {
      console.error("Download request failed:", err);
      setStatusMessage("Download request failed due to a server error.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>YouTube Search & AI Downloader</h2>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Search for a song or paste a YouTube URL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* Status & Error Messages */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {statusMessage && (
        <p
          style={{
            color: statusMessage.includes("didn’t pass") ? "orange" : "green",
          }}
        >
          {statusMessage}
        </p>
      )}

      {/* Results */}
      <div className="search-results">
        {result.length > 0 ? (
          result.map((item) => (
            <YoutubeVideoItem
              key={item.url}
              item={item}
              handleDownload={handleDownload}
            />
          ))
        ) : (
          <p>No results. Try a new search!</p>
        )}
      </div>

      {/* Pagination */}
      <div
        style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}
      >
        <button
          onClick={() => handlePagination(previousPageToken)}
          disabled={!previousPageToken}
          style={{
            padding: "10px 20px",
            cursor: previousPageToken ? "pointer" : "not-allowed",
          }}
        >
          Previous Page
        </button>
        <button
          onClick={() => handlePagination(nextPageToken)}
          disabled={!nextPageToken}
          style={{
            padding: "10px 20px",
            cursor: nextPageToken ? "pointer" : "not-allowed",
          }}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default SearchYt;