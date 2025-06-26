import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage
const storedUser = JSON.parse(localStorage.getItem("safwanStreaminAppUserData"));

const initialState = storedUser || {
  email: "",
  channel: "",
  token: "",
  user: "",
  url: "http://localhost:5000/", // Change if hosted
};

const userSlice = createSlice({
  name: "Userdetail",
  initialState,
  reducers: {
    baseurl: (state, action) => {
      state.url = action.payload.url;
    },
    initializeToken: (state, action) => {
      const {  user, email, channel,token, url } = action.payload;
      state.token = token;
      state.user = user;
      state.channel = channel;
      state.email = email;
      state.url = url || state.url;

      // Save to localStorage
      localStorage.setItem(
        "safwanStreaminAppUserData",
        JSON.stringify({
          token,
          user,
          channel,
          email,
          url: state.url,
        })
      );
    },
    removeToken: (state) => {
      state.token = "";
      state.user = "";
      state.channel = "";
      state.email = "";

      localStorage.removeItem("safwanStreaminAppUserData");
    },
    initializeChannel: (state, action) => {
      state.channel = action.payload;
      localStorage.setItem(
        "safwanStreaminAppUserData",
        JSON.stringify({
          token: state.token,
          user: state.user,
          channel: action.payload,
          email: state.email,
          url: state.url,
        })
      );
    },

  },
});

export const { baseurl, initializeToken, removeToken, initializeChannel } = userSlice.actions;
export default userSlice.reducer;
