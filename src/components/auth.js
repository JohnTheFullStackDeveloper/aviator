import {auth} from '../config/firebase.js';
import {onAuthStateChanged} from 'firebase/auth'
import {useState} from "react";
import {HashRouter, Routes, Route, Link} from 'react-router-dom';
import Register from "./registerC";
import Login from "./loginC";
import GamePage from "./gamepage";
import {io} from 'socket.io-client'
import Header from "../gamecomponents/header";
import {TermsPage} from "../policycomponents/termspage";
import {RefundPolicyPage} from "../policycomponents/refundpage";
import {PrivacyPolicyPage} from "../policycomponents/privacypolicy";
import {ContactUsPage} from "../policycomponents/contactus";
// export let Socket = io("https://check-t8r7.onrender.com")
// export let Socket = io("localhost:2000")
// export let Socket = io("https://45199e36-3f47-41ea-85a8-beb8e8754558-00-bn729pw6xmq9.pike.replit.dev/")
export const Socket = io("https://server-25w1.onrender.com")
export const Auth= ()=>{
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.email || "null");
    onAuthStateChanged(auth,()=>{
        setCurrentUser(auth?.currentUser?.email || "null")
        if (currentUser === null || currentUser === "null") {
            document.getElementById("toLogin").click();
        }
        else{
            document.getElementById("toGame").click();
        }
    })
    return (
        <HashRouter>
            <Link id={"toGame"} to={"/aviator" }></Link>
            <Link id={"toLogin"} to={"/login"}></Link>
            <Routes>
                <Route path="/aviator" element={<Header/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/terms" component={TermsPage} />
                <Route path="/refund-policy" component={RefundPolicyPage} />
                <Route path="/privacy-policy" component={PrivacyPolicyPage} />
                <Route path="/contact-us" component={ContactUsPage} />
                <Route path="*" element={<Header/>} />
            </Routes>
        </HashRouter>
    )
}