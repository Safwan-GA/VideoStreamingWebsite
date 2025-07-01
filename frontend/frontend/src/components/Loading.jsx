import { PiSpinnerGap } from "react-icons/pi"
import './styles/Home.css'

export default function Loading(props){
    console.log('Loading fallback'); 
    return (
        <div className="global-upload-wrapper">
            <div className="loading-wrapper fullscreen-overlay">
                <PiSpinnerGap size={32} className="spin"></PiSpinnerGap>
                <span>{props.uploading?"Uploading":"Loading…"}</span>
            </div>
        </div>
        
    )
}