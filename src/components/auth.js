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
function getI(){
    let id = localStorage.getItem("login")||null
    if (id===null){
        try {
            signOut(auth).then()
        }catch (e){}
    }
    else{
        return localStorage.getItem("login")
    }
}
export var getDeviceId = [getI()]
setInterval(()=>{
    let w = localStorage.getItem("windows")||null;
    if (w === null){
        window.location.reload()
        signOut(auth).then()
    }
},1000)
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
                    if (document.cookie.includes(snapshot.val())) {}
                    else{
                        Socket.removeAllListeners()
                        clearInterval(i)
                        console.log(document.cookie)
                        // console.log(snapshot.val(),document.cookie)
                        signOut(auth).then()
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