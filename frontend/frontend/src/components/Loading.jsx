import { PiSpinnerGap } from "react-icons/pi"
import './Home.css'

export default function Loading(){
    console.log('Loading fallback'); 
    return (
        <div className="loading-wrapper">
            <PiSpinnerGap size={32} className="spin"></PiSpinnerGap>
            <span>Loading…</span>
        </div>
        
    )
}