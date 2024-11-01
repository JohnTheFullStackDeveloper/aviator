import React, {useState} from 'react';
import './cssforcomponents.css';
import {Link} from "react-router-dom";
import {auth, db, GoogleProvider} from "../config/firebase";
import 'react-toastify/dist/ReactToastify.css';
import {set,ref} from 'firebase/database'
import {ToastContainer,toast} from "react-toastify";
import {createUserWithEmailAndPassword,signInWithPopup} from "firebase/auth";
const Register = () => {
    const [name,setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState("password");
    const create = async ()=>{
        try {
            if(name.length >=3){
            await createUserWithEmailAndPassword(auth, email, password).then((user) => {
                let id = user.user.uid;
                set(ref(db,id),{name:name})
            })
            }else{
                toast.error("enter name correctly",{position:"top-right",autoClose:3000,hideProgressBar:true});
            }
        }catch(err){
            toast.error(err.message,{position:"top-right",autoClose:3000,hideProgressBar:true});
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
            set(ref(db, id), {name: r.user.displayName})
        })
    }
    return (
        <div>
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
                <input type={type} placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value)
                }} required/>
                <div className={"showHide"}>
                    <div className={"checkBox"}><input onChange={(e) => showHide(e)} type="checkbox"/></div>
                </div>
                <button onClick={create}>Register</button>
                <button type="button" onClick={googleSign} className="login-with-google-btn">Sign in with Google</button>
                <span>Already have an account?<Link to={"/login"}>login</Link></span>
            </div>
        </div>
        </div>
    );
};

export default Register;
