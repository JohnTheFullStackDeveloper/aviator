import img from "./signout.png";
import wrong from "./worng.png";
import {useEffect, useState} from "react";
import {signOut} from "firebase/auth";
import {auth, db} from "../config/firebase";
import {Socket} from "../components/auth";
import {hideHistoryOrNot, hideOrNot} from "./header";
import {child, get, ref} from "firebase/database";
import {Link} from "react-router-dom";
import { getHistory } from "./menuHistory";
import { hord } from "./header";
import GamePage from "../components/gamepage";
export const history = []
export const MenuOriginal = (props) => {
    let a =  (
        <div className={"menuBar"}>
            <div className={"wrong-e"} onClick={menuHide} style={{marginLeft: 10, marginTop: 10, position: "absolute"}}>
                <img src={wrong} width={20}/></div>
            <div className={"menuBar-e"} onClick={()=>{hideHistory();getHistory()}}>bet history</div>
            <div className={"line"}></div>
            <div className={"menuBar-e"} onClick={()=>{props.prp();Socket.removeAllListeners();}}>deposit
            </div>
            <div className={"line"}></div>
            <div className={"menuBar-e"}>withdraw</div>
            <div className={"line"}></div>
            <div className={"center"} onClick={sOut}>
                <div className={"menuBar-e"}>sign out</div>
                <img className={"signOut"} src={img} alt={"signOut"}/></div>
        </div>
    )
    let b;
    const [A,setA] = useState(a);
    function menuHide() {
        hideOrNot[0] = "hide"
        document.getElementsByClassName("menuBar")[0].style.display = "none";
    }
    function hideHistory(){
        if (hideHistoryOrNot[0] === "hide") {
            hideHistoryOrNot[0] = "none"
            document.getElementsByClassName("menuBar-2")[0].style.display = "flex";
            menuHide()
        }
        else{

        }
    }
    function sOut(event) {
        console.log("sOut")
        event.preventDefault()
        let log = window.confirm("do you want to logout");
        if (log) {
            signOut(auth).then(() => {
            }).catch(err => {
                console.log(err)
            })
        }
    }
    return (A)
}