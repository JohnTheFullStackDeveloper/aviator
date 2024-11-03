import {get,child,ref} from 'firebase/database'
import {useState} from "react";
import {auth, db} from "../config/firebase";
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {signOut} from "firebase/auth";
import img from './signout.png'
import './cssforgame.css'
import {Socket} from "../components/auth";
import User from "./currentusers";
const Header = ()=>{
    let lastX = 1;
    const [playing, setPlaying] = useState(true);
    const [name,setName]=useState('')
    const [money,setMoney]=useState(0)
    const [bet1,setBet1]=useState(10)
    const [bet1Placed,setBet1Placed]=useState(false)
    const [bet1PlacedMoney, setBet1PlacedMoney]=useState(0)
    const [bet2,setBet2]=useState(10)
    const [bet2Placed,setBet2Placed]=useState(false)
    Socket.on("firstBetF",data=>{
        toast.error(data,{position:"top-right",autoClose:3000,hideProgressBar:true,toastId:"betFailed"})
    })
    Socket.on("betWon",data=>{
        console.log(data)
    })
    Socket.on("getX",data=>{
        lastX = data
        if(data!=="gone") {
            try {
                setPlaying(true)
                document.getElementById("multiplier").style.color = "black"
                document.getElementById("plane").style.animation = "fly 5s linear infinite"
                document.getElementById("multiplier").innerText = data + "x"
            }catch (e){
            }
        }
        else{
            try {
                document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                document.getElementById("multiplier").style.color = "red"
                document.getElementById("plane").style.animation = "none"
                setPlaying(false)
                setBet1Placed(false)
                toast.error(data + " at " + document.getElementById("multiplier").innerText, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    toastId: "gone",
                    pauseOnHover: false
                })
            }catch (e){
            }
        }
    })
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            setName(snapshot?.val()?.name || "");
        })
    }catch (e){}
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            setMoney(snapshot?.val()?.money || 0);
        })
    }catch (e){}
    const addBet1 = ()=>{
        setBet1(Number(bet1)+10)
    }
    const subBet1 = ()=>{
        if(bet1>=20) {
            setBet1(bet1 - 10)
        }
        else{
            setBet1(10)
        }
    }
    const addBet2 = ()=>{
        setBet2(Number(bet2)+10)
    }
    const subBet2 = ()=>{
        if(bet2>=20) {
            setBet2(bet2 - 10)
        }
        else{
            setBet2(10)
        }
    }
    const sOut = async ()=>{
        let log = window.confirm("do you want to logout");
        if (log) {
            signOut(auth).then(() => {
                console.log("signOut")
            }).catch(err => {
                console.log(err)
            })
        }
    }
    const firstBet = ()=>{
        if (!playing) {
            if(money < bet1){
                document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                toast.error("low money",{position:"top-right",autoClose:700,hideProgressBar:true,toastId:"low money"})
            }
            else {
                Socket.emit("firstBet", {uid: auth.currentUser.uid, betPlaced: bet1, totalMoney: money})
                toast.success("bet placed",{position:"top-right",autoClose:3000,hideProgressBar:true,toastId:"betFailed"})
                document.getElementById("firstBet").style.backgroundColor = "orange"
                setBet1Placed(true)
            }
        }
        else{
            if (bet1Placed){
                setBet1Placed(false)
                document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                Socket.emit("StopBet",{atX:lastX,uid:auth.currentUser.uid})
            }
            else{
            toast.warning("wait for next round",{position:"top-right",autoClose:700,hideProgressBar:true,toastId:"wait for next round"})
            }
        }
    }
    return (
        <div className={"total2"}>
            <div className="first">
        <ToastContainer closeButton={false}/>
        <div className="form">
            <div className={"details"}>
                <div>{"‎ "}</div>
                <div className="name">{name}</div>
                <div className={"MSDiv"}>
                <div className="money">{money + "$"}</div>
                <img className={"signOut"} src={img} alt={"signOut"} onClick={sOut}/>
                </div>
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
                <div className={"two-container"}>
                    <div className="bet-container" id={"bet-container-1"}>
                        <div className="bet-input">
                            <div className={"bet-inputs1"}>
                                <button onClick={subBet1} className={"minus1"}>-</button>
                                <input className={"betinput"} type="number" value={bet1} onChange={(e) => {
                                    if (e.target.value == null || e.target.value === "") {
                                        setBet1("‎ ")
                                    }else {
                                        setBet1(Number(e.target.value))
                                    }
                                }}/>
                                <button className={"plus1"} onClick={addBet1}>+</button>
                            </div>
                            <div className={"bet-values"}>
                                <div className={"bet-value-1"}>
                                    <div className={"bet-value-100"} onClick={()=>{setBet1(100)}}>100</div>
                                    <div className={"bet-value-200"} onClick={()=>{setBet1(200)}}>200</div>
                                </div>
                                <div className={"bet-value-2"}>
                                    <div className={"bet-value-500"} onClick={()=>{setBet1(500)}}>500</div>
                                    <div className={"bet-value-1000"} onClick={()=>{setBet1(1000)}}>1000</div>
                                </div>
                            </div>
                        </div>
                        <button className="bet-button" id={"firstBet"} onClick={firstBet}>
                            <div>bet</div>
                            <div>{bet1}</div>
                        </button>
                    </div>
                    <div className="bet-container">
                        <div className="bet-input">
                            <div className={"bet-inputs1"}>
                                <button onClick={subBet2} className={"minus1"}>-</button>
                                <input className={"betinput"} type="number" value={bet2} onChange={(e) => {
                                    if (e.target.value == null || e.target.value === "") {
                                        setBet2("‎ ")
                                    } else {
                                        setBet2(Number(e.target.value))
                                    }
                                }}/>
                                <button className={"plus1"} onClick={addBet2}>+</button>
                            </div>
                            <div className={"bet-values"}>
                                <div className={"bet-value-1"}>
                                    <div className={"bet-value-100"} onClick={() => {
                                        setBet2(100)
                                    }}>100
                                    </div>
                                    <div className={"bet-value-200"} onClick={() => {
                                        setBet2(200)
                                    }}>200
                                    </div>
                                </div>
                                <div className={"bet-value-2"}>
                                    <div className={"bet-value-500"} onClick={() => {
                                        setBet2(500)
                                    }}>500
                                    </div>
                                    <div className={"bet-value-1000"} onClick={() => {
                                        setBet2(1000)
                                    }}>1000
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="bet-button" id={"secondBet"}>
                            <div>bet</div>
                            <div>{bet2}</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            </div>
            <User/>
        </div>
    )
}
export default Header;