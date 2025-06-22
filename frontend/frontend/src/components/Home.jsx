import React,{useState} from "react";
import './Home.css'
import useFetchVideo from "./hooks/useFetchVideo";
import VideoCard from "./VideoCard";
import Menu from "./Menu"
import { PiMagnifyingGlass, PiYoutubeLogoDuotone  } from "react-icons/pi";


function Home(){
    const {videoList,error}=useFetchVideo();
    const [searchText,setSearchText]=useState('');
    const [search, setSearch]=useState('')
    if(error){
        const message="Some error occurred during the loading the video"
        console.log(message)
        return (<div>{message}</div>)
    }

    if(videoList?.length==0) return (<>Video is still Loading....</>)
    
    const filteredVideo=videoList?.filter(video=>video.name.toLowerCase().includes(search.toLowerCase()))


    return (  
        <div className="video_Container">
            {filteredVideo?.map(video=><VideoCard video={video}></VideoCard>)}
        </div>
    );
}
export default Home;