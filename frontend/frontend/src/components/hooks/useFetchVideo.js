// hooks/useFetchVideo.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function useFetchVideo() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useSelector((state) => state.user);

  useEffect(() => {
    if (!url) return;

    axios.get(`${url}api/videos`)
      .then((res) => setVideos(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { videos, loading, error };
}

export default useFetchVideo;
