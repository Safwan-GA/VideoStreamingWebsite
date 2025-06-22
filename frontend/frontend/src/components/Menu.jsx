import React, { useEffect, useState } from "react";
import Upload from "./Upload"
import './Home.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { initializeToken } from "./redux/userDetailSlice";
import { PiToggleLeftDuotone, PiToggleRightFill, PiYoutubeLogoDuotone, PiMagnifyingGlass, PiUserCircleCheckBold, PiUserCircleBold, PiTelevisionSimpleBold } from "react-icons/pi";


export default function Menu(){
    let isLoggedIn=false
    const [isDark,setIsDark]=useState(false)
    const [profileDetail,setProfileDetail]=useState(false)
    const [searchText,setSearchText]=useState("")
    const [search, setSearch]=useState("")
    const navigate=useNavigate()
    const user=useSelector(state=>state.user)
    const dispatch=useDispatch();
    const loaction=useLocation()


    const handleProfileButton=()=>{
        setProfileDetail(!profileDetail);
    }

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) root.setAttribute("theme", "dark");
        else root.removeAttribute("theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    const allowedPaths=['/']
    const isSearchVisible=allowedPaths.includes(location.pathname)
    return (
        <div className="header">
            <div className="streamingHeader">
                <button onClick={()=>navigate('/')}><PiYoutubeLogoDuotone size={30}/></button>
                
                <div className={isSearchVisible?'visible':'hidden'}>
                    <input type='search' value={searchText} onChange={e=>setSearchText(e.target.value)}/>
                    <button text={'Search'} onClick={e=>setSearch(searchText)}><PiMagnifyingGlass  size={20}/></button>
                </div>
                <div>
                    <div>
                        <button title='theme' className="theme_button" onClick={(themeOption)=>setIsDark(!isDark)}>
                            {isDark?<PiToggleRightFill size={20}/>:<PiToggleLeftDuotone size={20}/>}
                        </button>
                        <button className="ChannelNavigateButtom" title='Channel' onClick={()=>navigate('/channel')}><PiTelevisionSimpleBold size={20}/></button>
                        {isLoggedIn?<button title="profile" classname="profileIcon" onClick={()=>setProfileDetail(!profileDetail)}><></></button>:
                        <button title="SignIn" className="signIn" onClick={()=>navigate('/login')}>{user.email!=''?<PiUserCircleCheckBold size={20}/>:<PiUserCircleBold size={20}/>}</button>}
                    </div>
                    {profileDetail && (<div className="profileDetail" aria-hidden={profileDetail}>
                        <label>UserName: {user.name}</label>
                        <label>email: {user.email}</label>
                        <label>Channel: {(user.channel=='')?"Channel not created":user.channel}</label>
                        <button onclick={()=>{dispatch(initializeToken("","","",""))}}></button>
                    </div>)}

                </div>
            </div>
        </div>
        
    )
}