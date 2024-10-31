import React, {useState} from "react";
import {Link} from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
import {auth} from "../config/firebase";
import './cssforcomponents.css'
import {ToastContainer,toast} from "react-toastify";

const Login = ()=>{
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [type, setType] = useState("password");
    const login = async ()=>{
        try {
            await signInWithEmailAndPassword(auth, email, password).then(() => {
            });
        }catch (error) {
            toast.error(error.message,{position:"top-right",autoClose:3000,hideProgressBar:true})
        }
    }
    const showHide = (e)=>{
        if (e.target.checked){
            setType("text")
        }
        else{
            setType("password")
        }
    }
    return (
        <div>
            <ToastContainer closeButton={false}/>
        <div className="container">
            <div className={"formb"}>
                <h1>Login</h1>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
                <input type={type} minLength={6} placeholder="Password"
                       onChange={(e) => setPassword(e.target.value)} required/>
                <div className={"showHide"}>
                    <div className={"checkBox"}><input onChange={(e) => showHide(e)} type="checkbox"/></div>
                </div>
                <button onClick={login}>Log In</button>
                <span>Don't have an account?<Link to={"/register"}>register</Link></span>
            </div>
        </div>
        </div>
    )
}
export default Login;