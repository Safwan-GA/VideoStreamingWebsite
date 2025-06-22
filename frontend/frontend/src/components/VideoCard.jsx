import React, {useState} from "react";

export default function VideoCard(){
    const navigate = useNavigate();

    if (!video) {
        return <p>No video data provided.</p>;
    }

    
    return (<>        
        {<div onClick={() => navigate("/video", { state: { video } })} style={{ cursor: "pointer", marginBottom: "1rem" }}>
        <p><strong>Title:</strong> {video.title}</p>
        <p><strong>Description:</strong> {video.description}</p>

        {video.thumbnailUrl ? (
            <img
            src={video.thumbnailUrl}
            alt={`Thumbnail for ${video.title}`}
            width="320"
            height="180"
            />
        ) : (
            <p>Loading thumbnail...</p>
        )}
        </div>}
    </>)
}