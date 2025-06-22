import React, {useState} from "react";
import axios from "axios";
import {useSelector} from 'react-redux'
import { useNavigate } from "react-router-dom";
import UserCredentialValidation from "./UserCredentailValidation";

export default function Register(){
    const [error,setError]=useState('')
    const [Name,setName]=useState('')
    const [Email,setEmail]=useState('')
    const [Password,setPassword]=useState('')
    const [load, setLoad]=useState(false)
    const url=useSelector(state=>state.user.url)
    const navigate=useNavigate()

    const handleSubmitRegister=(e)=>{
        e.preventDefault(); 
        try{
            setError('')
            setLoad(true)
            const message=UserCredentialValidation(Email,Password);
            if(message!==''){
                setError(message)
                return;
            }
            axios.post(url+'Register',{
                Name,
                Email,
                Password
            }).then((response)=>navigate('/login')).catch((err)=>setError(err.response?.data?.message || 'Register failed'))
        }
        catch (err) {
            setError('Some error occurred during register')
        } finally {
            setLoad(false);
        }
        console.log(error)
    }
    return (
        <div className="PopUpContainer">
            {error!=='' && <p>{error}</p>}
            <form className="PopUpBox" onSubmit={handleSubmitRegister}>
                <label>Name of the User: </label><input value={Name} type="text" onChange={(e)=>setName(e.target.value)}></input>
                <label>Email Address: </label><input value={Email} type="email" onChange={(e)=>setEmail(e.target.value)}></input>
                <label>Password: </label><input type="password" value={Password} onChange={(e)=>setPassword(e.target.value)}></input>
                <button type='submit' disabled={load}>Register</button>
                <button onClick={()=>navigate('/login')}>Navigate to Login</button>
            </form>
        </div>
    )
}