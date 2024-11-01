import {auth} from "../config/firebase";
import {useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import Header from "../gamecomponents/header";

const GamePage = ()=>{
    const [currentUser, setCurrentUser] = useState(auth?.currentUser?.email||"null");
    onAuthStateChanged(auth,(user)=>{
        setCurrentUser(user?.email || "null")
        if (currentUser === "null" || currentUser === undefined) {
            document.getElementById("toLogin").click();
        }
    })
    return(
        <div className={"total"}>

        </div>
    )
}
export default GamePage;