// components/Menu.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { initializeToken } from "./redux/userDetailSlice";
import { useVideo } from "./context/VideoContext";
import {
  PiToggleLeftDuotone, PiToggleRightFill, PiYoutubeLogoDuotone,
  PiMagnifyingGlass, PiUserCircleCheckBold, PiUserCircleBold, PiTelevisionSimpleBold
} from "react-icons/pi";

export default function Menu() {
  const [isDark, setIsDark] = useState(false);
  const [profileDetail, setProfileDetail] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoggedIn = user.email !== '';
  const { setVideos } = useVideo();

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${user.url}videos`, {
        params: { search: searchText }
      });
      setVideos(res.data);
      navigate("/");
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const allowedPaths = ['/'];
  const isSearchVisible = allowedPaths.includes(location.pathname);

  return (
    <div className="header">
      <div className="streamingHeader">
        <button onClick={() => navigate('/')}><PiYoutubeLogoDuotone size={30} /></button>

        <div className={isSearchVisible ? 'visible' : 'hidden'}>
          <input
            type='search'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button onClick={handleSearch}><PiMagnifyingGlass size={20} /></button>
        </div>

        <div>
          <div>
            <button title='theme' className="theme_button" onClick={() => setIsDark(!isDark)}>
              {isDark ? <PiToggleRightFill size={20} /> : <PiToggleLeftDuotone size={20} />}
            </button>
            <button className="ChannelNavigateButtom" title='Channel' onClick={() => navigate('/channel')}><PiTelevisionSimpleBold size={20} /></button>
            {isLoggedIn ? (
              <button title="profile" className="profileIcon" onClick={() => setProfileDetail(!profileDetail)}>
                <PiUserCircleCheckBold size={20} />
              </button>
            ) : (
              <button title="SignIn" className="signIn" onClick={() => navigate('/login')}>
                <PiUserCircleBold size={20} />
              </button>
            )}
          </div>
          {profileDetail && (
            <div className="profileDetail" aria-hidden={profileDetail}>
              <label>UserName: {user.user}</label>
              <label>Email: {user.email}</label>
              <label>Channel: {user.channel || "Not created"}</label>
              <button onClick={() => {
                dispatch(initializeToken({ user: '', email: '', channel: '', token: '' }));
                setProfileDetail(false);
              }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
