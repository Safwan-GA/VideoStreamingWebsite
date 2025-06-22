import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetchVideo() {
  const url=''
  const [video, setVideo]=useState([]);
  const [error, setError]=useState(null);

  useEffect(()=>{
    axios.get(url).then(response=>setVideo(response.data)).catch(error=>setError(error))
  },[])
  return {video,error}
}
