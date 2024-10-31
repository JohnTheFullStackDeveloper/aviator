import {get,child,ref} from 'firebase/database'
import {useState} from "react";
import {auth, db} from "../config/firebase";
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {signOut} from "firebase/auth";
import img from './signout.png'
import './cssforgame.css'
import {Socket} from "../components/auth";
import {Link} from "react-router-dom";
const Header = ()=>{
    const [name,setName]=useState('')
    const [money,setMoney]=useState(0)
    const [bet,setBet]=useState(10)

    Socket.on("getX",data=>{
        if(data!=="gone") {
            try {
                document.getElementById("multiplier").style.color = "black"
                document.getElementById("plane").style.animation = "fly 5s linear infinite"
                document.getElementById("multiplier").innerText = data + "x"
            }catch (e){
                window.location.reload()
                console.log("disconnected")
            }
        }
        else{
            try {
                document.getElementById("multiplier").style.color = "red"
                document.getElementById("plane").style.animation = "none"
                toast.error(data + " at " + document.getElementById("multiplier").innerText, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    toastId: "gone",
                    pauseOnHover: false
                })
            }catch (e){
                console.log("disconnected")
            }
        }
    })
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            setName(snapshot.val().name);
        })
    }catch (e){}
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            setMoney(snapshot?.val()?.money || 0);
        })
    }catch (e){}
    const addBet = ()=>{
        setBet(bet+10)
    }
    const subBet = ()=>{
        if(bet>10) {
            setBet(bet - 10)
        }
    }
    const allBet = ()=>{
        if(money >=10) setBet(money)
        else setBet(10)
    }
    const tenBet = ()=>{
        setBet(10)
    }
    const sOut = ()=>{

        signOut(auth).then((user)=>{
            console.log("signOut")
            document.getElementById("toLogin").click();
        }).catch(err=>{
            console.log(err)
        })

    }
    return (
        <div>
        <ToastContainer closeButton={false}/>
        <div className="form">
            <Link id={"toLogin"} to={"#/login"}
            <div className={"details"}>
                <div>{"‎ "}</div>
            <div className="name">{name}</div>
            <div className="money">{money+"$"}</div>
            </div>
            <div className="game-area">
                <div id="plane">
                    <div className="flight-path"></div>
                    <div className="plane-icon">✈️</div>
                </div>
                <div className="multiplier-display">
                    <h1 id="multiplier">connecting....</h1>
                </div>
            </div>

            <div className="betting-area">
                <h2>Place Your Bet</h2>
                <div className={"bets"}>
                    <div id={"min"} style={{color:"white",cursor:"pointer"}} onClick={tenBet}>min</div>
                    <div id={"minus"} onClick={subBet}>-</div>
                    <div id={"betPlaced"}>{bet}</div>
                    <div id={"plus"} onClick={addBet}>+</div>
                    <div id={"all"} style={{color:"white",cursor:"pointer"}} onClick={allBet}>all</div>
                </div>
                <button id="placeBet">Place Bet</button>
            </div>
            <img className={"signOut"} src={img} alt={"signOut"} onClick={sOut} />
        </div>
        </div>
    )
}
export default Header;