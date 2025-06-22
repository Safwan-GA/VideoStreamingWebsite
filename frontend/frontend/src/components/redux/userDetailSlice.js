import {createSlice} from '@reduxjs/toolkit'

const initialState={
    email:"",
    channel:"",
    token:'',
    user:'',
    url:'http://localhost:5173/'
}

const userSlice=createSlice({
    name:'Userdetail',
    initialState,
    reducers:{
        baseurl:(state,action)=>{
            state.url=action.payload.url
        },
        initializeToken:(state,action)=>{
            state.token=action.payload.token;
            state.user=action.payload.user;
            state.channel=action.payload.channelName;
            state.email=action.payload.email;
        },
        removeToken:(state)=>{
            state.token='';
            state.user='';
            state.channel='';
            state.email=''
        },
        initializeChannel:(state)=>{
            state.channel=state.payload.channelName
        }
    }
})

export const {baseurl, initializeToken, removeToken, initializeChannel}=userSlice.actions;
export default userSlice.reducer;