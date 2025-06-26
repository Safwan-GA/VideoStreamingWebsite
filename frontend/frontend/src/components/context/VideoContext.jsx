import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useSelector((state) => state.user);  // URL from Redux

  useEffect(() => {
    if (!url) return;

    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${url}videos`);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [url]);

  return (
    <VideoContext.Provider value={{ videos, setVideos, loading, error }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  return useContext(VideoContext);
}