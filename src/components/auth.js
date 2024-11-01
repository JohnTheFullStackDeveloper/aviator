import {auth} from '../config/firebase.js';
import {onAuthStateChanged} from 'firebase/auth'
import {useState} from "react";
import {HashRouter, Routes, Route, Link} from 'react-router-dom';
import Register from "./registerC";
import Login from "./loginC";
import GamePage from "./gamepage";
import {io} from 'socket.io-client'
export let Socket = io("https://check-t8r7.onrender.com")
// export let Socket = io("localhost:2000")
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
                <Route path="/aviator" element={<GamePage/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="*" element={<GamePage/>} />
            </Routes>
        </HashRouter>
    )
}