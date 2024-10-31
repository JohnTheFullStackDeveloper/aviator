import {auth} from '../config/firebase.js';
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithPopup,signOut,signInWithEmailAndPassword} from 'firebase/auth'
import {useState} from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Register from "./registerC";
import Login from "./loginC";
import GamePage from "./gamepage";
import {io} from 'socket.io-client'
export let Socket = io("https://check-t8r7.onrender.com")

export const Auth= ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.email || "null");
    onAuthStateChanged(auth,(user)=>{
        setCurrentUser(auth?.currentUser?.email || "null")
        if (currentUser === null || currentUser === "null") {
            // import('./cssforcomponents.css')
            document.getElementById("toLogin").click();
        }
        else{
            // import('../gamecomponents/cssforgame.css')
            document.getElementById("toGame").click();
        }
    })
    return (
        <BrowserRouter>
            <Link id={"toGame"} to={"/aviator" }></Link>
            <Link id={"toLogin"} to={"/login"}></Link>
            <Routes>
                <Route path="/aviator" element={<GamePage/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
            </Routes>
        </BrowserRouter>
    )
}