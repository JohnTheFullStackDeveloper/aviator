import {auth, db} from '../config/firebase.js';
import {onAuthStateChanged, signOut} from 'firebase/auth'
import {useState} from "react";
import {HashRouter, Routes, Route, Link} from 'react-router-dom';
import Register from "./registerC";
import Login from "./loginC";
import {io} from 'socket.io-client'
import Header from "../gamecomponents/header";
import {TermsPage} from "../policycomponents/termspage";
import {RefundPolicyPage} from "../policycomponents/refundpage";
import {PrivacyPolicyPage} from "../policycomponents/privacypolicy";
import {ContactUsPage} from "../policycomponents/contactus";
import {child, get, ref} from "firebase/database";
import Cookies from 'js-cookie'
import { Deposit } from './deposit.js';
import GamePage from './gamepage.js';
import { Deposits } from './deposits.js';
export var getDeviceId = [""]
setInterval(()=>{
    let w = localStorage.getItem("windows")||null;
    if(w == "0"){
        window.location.reload()
    }
    if (w === null){
        signOut(auth).then(()=>{
            alert("window")
        })
    }
},2000)
// export let Socket = io("https://check-t8r7.onrender.com")
// export let Socket = io("localhost:2000")
// export let Socket = io("https://45199e36-3f47-41ea-85a8-beb8e8754558-00-bn729pw6xmq9.pike.replit.dev/")
export const Socket = io("https://server-25w1.onrender.com")
let i;
export const Auth= ()=>{
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.email || "null");
    onAuthStateChanged(auth,()=>{
        setCurrentUser(auth?.currentUser?.email || "null")
        if (currentUser === null || currentUser === "null") {
            document.getElementById("toLogin").click();                
        }
        else{
            document.getElementById("toGame").click();
            clearInterval(i)
            i = setInterval(()=>{
                get(child(ref(db),"users/"+auth?.currentUser?.uid)).then(snapshot=>{
                    if (snapshot.val() === localStorage.getItem("LoginS")) {}
                    else{
                        Socket.removeAllListeners()
                        signOut(auth).then(()=>{})
                        clearInterval(i)
                        alert("some one login your account")    
                    }
                })
            },2000)
        }
    })
    return (
        <HashRouter>
            <Link id={"toGame"} to={"/aviator" }></Link>
            <Link id={"toLogin"} to={"/login"}></Link>
            <Routes>
                <Route path="/aviator" element={<GamePage/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/deposit" element={<Deposits/>} />
                <Route path="/terms" element={<TermsPage/>} />
                <Route path="/refund-policy" component={<RefundPolicyPage/>} />
                <Route path="/privacy-policy" component={<PrivacyPolicyPage/>} />
                <Route path="/contact-us" component={<ContactUsPage/>} />
                <Route path="*" element={<GamePage/>} />
            </Routes>
        </HashRouter>
    )
}