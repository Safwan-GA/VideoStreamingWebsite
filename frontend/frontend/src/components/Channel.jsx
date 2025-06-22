import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initializeToken, initializeChannel } from "./redux/userDetailSlice";
import axios from "axios";




export function CreateChannel(){
    const [channelName,setChannelName]=useState("")
    const [error,setError]=useState(null)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const user=useSelector(state=>state.user)
    const url=user.url;
    
    const handleSubmitCreateChannel=(e)=>{
        e.preventDefault()
        setError(null)
        const res=axios.post(`${url}createChannel`,{email:user.email,token:user.token,channelName})
        .then(()=>{
            dispatch(initializeChannel(channelName))
            navigate('/channel')
        })
        .catch(err=>setError(err.response?.data?.message))
    }

    if (user.email==='') {
        
        return ( 
        <div className="PopUpContainer">
            <p>User not yet logged in. Please login to continue</p>
            <div className="PopUpBox">
                <button onClick={()=>navigate('/login', { state: { from: "/createchannel" }, replace: true })} className="spanTwoColum">Navigate to Login</button>
            </div>
        </div>
        );
    }
    if (user.channel!==''){
        return ( 
        <div className="PopUpContainer">
            <p>User already has the Channnel. Please open your channel.</p>
            <div className="PopUpBox">
                <button onClick={()=>navigate('/channel', {replace: true })} className="spanTwoColum">Open the Channel</button>
            </div>
        </div>
        );
    }
    return (
        <div className="PopUpContainer">
            {error && <p>{error}</p>}
            <div className="PopUpBox">
                <label>Name of the channel: </label>
                <input style={{ maxWidth: "200px" }} value={channelName} onChange={(e)=>setChannelName(e.target.value)}></input>
                
                <button onClick={handleSubmitCreateChannel} className="spanTwoColum">createChannel</button>
            </div>
            
        </div>
    )
}

export default function Channel(){
    const [video,setVideo]=useState(null)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadView,setUploadView]=useState(false)
    const [error,setError]=useState(null)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const user=useSelector(state=>state.user)
    const url=user.url;

    useEffect(() => {
        axios
            .get(`${url}getChannelVideo`, {
                params: {
                    token: user.token,
                    channel: user.channel,
                },
            })
            .then((response) => setVideo(response.data))
            .catch((err) => setError(err.response?.data?.message || "Error loading video"));
    },[url,user.channel,user.email])
    

    const uploadVideo=(e)=>{
        e.preventDefault()
        setError(null)
        if (!selectedFile) {
            setError("Please select a video file.");
            return;
        }

        const formData = new FormData();
        formData.append("token", user.token);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", selectedFile);

        axios.post(`${url}upload`,formData).then((response)=>console.log('Video got uploaded'))
        .catch((error)=>setError("some error occurrded during upload"))
        setUploadView(false)
        window.location.reload();
    }

    const genThumb = (videoUrl, cb) => {
        const vid = document.createElement("video");
        vid.src = videoUrl;
        vid.muted = true;
        vid.currentTime = 1;
        vid.onloadeddata = () => {
        const c = document.createElement("canvas");
            c.width = 320;
            c.height = 180;
            c.getContext("2d").drawImage(vid, 0, 0, c.width, c.height);
            cb(c.toDataURL("image/png"));
        };
    };

    if (user.email==='') {
        
        return ( 
        <div className="PopUpContainer">
            <p>User not yet logged in. Please login to continue</p>
            <div className="PopUpBox">
                <button onClick={()=>navigate('/login', { state: { from: "/createchannel" }, replace: true })} className="spanTwoColum">Navigate to Login</button>
            </div>
        </div>
        );
    }
    if (user.channel!==''){
        return ( 
        <div className="PopUpContainer">
            <p>User already has the Channnel. Please open your channel.</p>
            <div className="PopUpBox">
                <button onClick={()=>navigate('/createChannel', {replace: true })} className="spanTwoColum">Open the Channel</button>
            </div>
        </div>
        );
    }
    


    return (
        <>
            <div>
                <label>Channel Name: <p>{user.channel}</p></label>
                <button onClick={()=>setUploadView(true)}>Upload Video</button>
                {uploadView && (<form onSubmit={uploadVideo} aria-hidden={uploadView}>
                    <label>Title of the Video</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label>Description</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <label>Video:</label>
                    <input
                        type="file"
                        accept="video/mp4,video/mov"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        required
                    />
                    <button type="submit">Upload</button>
                    <button type="button" onClick={() => setUploadView(false)}>
                        Cancel
                    </button>
                </form>)}

            </div>
            
            {/* {video &&
                    vid?.map((eachVideo, idx) => (
                    <div key={idx} onClick={() => navigate("/video", { state: { video: eachVideo } })}>
                    <p><strong>Title:</strong> {eachVideo.title}</p>
                    <p><strong>Description:</strong> {eachVideo.description}</p>

                    {eachVideo.thumbnailUrl ? (
                        <img
                        src={eachVideo.thumbnailUrl}
                        alt={`Thumbnail for ${eachVideo.title}`}
                        width="320"
                        height="180"
                        />
                    ) : (
                        <p>Loading thumbnail...</p>
                    )}
                    </div>
                ))} */}
        </>
    )
}