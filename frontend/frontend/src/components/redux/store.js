import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userDetailSlice'

const store=configureStore({
    reducer:{
        user:userReducer,
    }
})

export {store};