import {auth} from "../config/firebase";
import {useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import Header from "../gamecomponents/header";
import { hord } from "../gamecomponents/header";
import { Deposit } from "./deposit";
const GamePage = ()=>{
    // create pressed state
const [pressed, setPressed] = useState(true);

// onClick() function
function press() {
    if (localStorage.getItem("page") == "d") {
        localStorage.setItem("page","h") 
        setPressed(true);
        }
    else{
         localStorage.setItem("page","d")
         setPressed(false);
    }
        }

// true or false // change component
const component = pressed ? <Header onClick={press} /> : <Deposit onClick={press} />
    return(
        component
    )
}
export default GamePage;