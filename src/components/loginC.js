import React, {useState} from "react";
import {Link} from "react-router-dom";
import {signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
import {auth, db, GoogleProvider} from "../config/firebase";
import './cssforcomponents.css'
import {ToastContainer,toast} from "react-toastify";
import {child, ref, set} from "firebase/database";
import {getDeviceId, Socket} from "./auth";
import hide from './hide.png'
import show from './show.png'
let sh = false;
const Login = ()=>{
    Socket.removeAllListeners()
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [type, setType] = useState("password");
    const [imgage,setImgage] = useState(hide);
    const login = async ()=>{
        try {
            await signInWithEmailAndPassword(auth, email, password).then((user) => {
                getDeviceId = (Date.now() * Math.random() * 100).toString();
                sessionStorage.setItem("login", getDeviceId);
                set(ref(db, "users/" + user.user.uid), getDeviceId).then()
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
    const googleSign = ()=>{
        signInWithPopup(auth, GoogleProvider).then(r =>{
            let id = r.user.uid;
            set(ref(db, id+"/"+"name"),  r.user.displayName).then()
            getDeviceId = (Date.now() * Math.random() * 100).toString();
            sessionStorage.setItem("login", getDeviceId);
            set(ref(db, "users/" + id), getDeviceId).then()
        }).catch(e=>{
          toast.error(e.message,{position:"top-right",autoClose:3000,hideProgressBar:true})
        })
    }
    return (
        <div className={"c"}>
            <ToastContainer newestOnTop={true} closeButton={false}/>
        <div className="container">
            <div className={"formb"}>
                <h1>Login</h1>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
                <input type={type} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                <img id={"hideImg"} src={imgage} onClick={e=>{
                    if(sh)
                    {
                        sh = false;
                        setImgage(hide);
                        setType("password")
                    }
                    else {
                        sh = true;
                        setImgage(show)
                        setType("text")
                    }
                }}/>
                <div className={"optionsF"}>
                    <div className={"forgot"}>forgot password</div>
                </div>
                <button onClick={login}>Log In</button>
                <button type="button" onClick={googleSign} className="login-with-google-btn">login with Google
                </button>
                <span>Don't have an account?<Link to={"/register"}>register</Link></span>
            </div>
        </div>
        </div>
    )
}
export default Login;