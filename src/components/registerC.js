import React, {useState} from 'react';
import './cssforcomponents.css';
import {Link} from "react-router-dom";
import {auth, db, GoogleProvider} from "../config/firebase";
import 'react-toastify/dist/ReactToastify.css';
import {set,ref} from 'firebase/database'
import {ToastContainer,toast} from "react-toastify";
import {createUserWithEmailAndPassword,signInWithPopup} from "firebase/auth";
import {getDeviceId} from "./auth";
import hide from './hide.png'
import show from './show.png'
let sh;
const Register = () => {
    const [name,setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hideImg,setHideImg] = useState(hide)
    const [type, setType] = useState("password");
    const create = async ()=>{
        try {
            if(name.length >=3){
            await createUserWithEmailAndPassword(auth, email, password).then((user) => {
                let id = user.user.uid;
                getDeviceId[0] = new Date().getTime().toString();
            document.cookie = `${getDeviceId[0]}; ${999999999999999}; path=/`
            set(ref(db, "users/" + id), getDeviceId[0]).then()
                set(ref(db,id),{name:name,money:0})
            })
            }else{
                toast.error("enter name correctly",{position:"top-right",autoClose:3000,hideProgressBar:true});
            }
        }catch(err){
            toast.error(err.message,{position:"top-right",autoClose:3000,hideProgressBar:true});
        }
    }
    const googleSign = ()=>{
        signInWithPopup(auth, GoogleProvider).then(r =>{
            let id = r.user.uid;
            getDeviceId[0] = new Date().getTime().toString();
            document.cookie = `${getDeviceId[0]}; ${999999999999999}; path=/`
            set(ref(db, "users/" + id), getDeviceId[0]).then()
            set(ref(db, id+"/"+"name"),  r.user.displayName).then()
        }).catch(e=>{
            toast.error(e.message,{position:"top-right",autoClose:3000,hideProgressBar:true})
        })
    }
    return (
        <div className={"c"}>
            <ToastContainer closeButton={false}/>
        <div className="container">
            <div className={"formb"}>
                <h1>Register</h1>
                <input type="text" placeholder="Name" onChange={(e) => {
                    setName(e.target.value)
                }} required/>
                <input type="email" placeholder="Email" onChange={(e) => {
                    setEmail(e.target.value)
                }} required/>
                <input type={type} placeholder="Password" className={"pInput"} onChange={(e) => {
                    setPassword(e.target.value)
                }} required/>
                <img id={"hideImg"} src={hideImg} onClick={e => {
                    if (sh) {
                        sh = false;
                        setHideImg(hide);
                        setType("password")
                    } else {
                        sh = true;
                        setHideImg(show)
                        setType("text")
                    }
                }}/>

                <button onClick={create}>Register</button>
                <button type="button" onClick={googleSign} className="login-with-google-btn">Sign in with Google
                </button>
                <span>Already have an account?<Link to={"/login"}>login</Link></span>
            </div>
        </div>
        </div>
    );
};

export default Register;
