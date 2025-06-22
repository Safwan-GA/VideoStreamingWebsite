import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { initializeToken } from "./redux/userDetailSlice";
import UserCredentialValidation from "./UserCredentailValidation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";


export default function Login(){
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState(null)
    const [load, setLoad]=useState(false)
    const navigate=useNavigate()
    const url=useSelector(state=>state.user.url);
    const dispatch=useDispatch();

    const handleLogin=(e)=>{
        e.preventDefault()
        try{
            setError(null);
            setLoad(true);
            const message=UserCredentialValidation(email,password)
            if(message!==''){
                setError(message)
                return;
            }
            axios.post(`${url}login`, { email, password })
            .then((response) => {
                const { user, email, channel, token } = response.data;
                dispatch(initializeToken({ user, email, channel, token }));
                navigate('/');
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Login failed');
            });

        }
        catch (err) {
            setError('Some error occurred')
        } finally {
            setLoad(false);
        }
        console.log(error)


    }
    return (
        <div className="PopUpContainer">
            {error && <p>Error Occurred: {error}</p>}
            <form className="PopUpBox">
                
                <label htmlFor="email">Email Address/UserName</label>
                <input type="text" style={{maxWidth:600}} value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input type="text" style={{maxWidth:600}} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button onClick={handleLogin} disabled={load}>{load? 'Logging in':'Login'}</button>
                <button onClick={()=>navigate('/register')}>Navigate to Register</button>
            </form>
        </div>
    )
}

