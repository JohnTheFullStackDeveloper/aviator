import {child, get, ref, set} from 'firebase/database'
import {useState} from "react";
import {auth, db} from "../config/firebase";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {signOut} from "firebase/auth";
import img from './signout.png'
import './cssforgame.css'
import {Socket} from "../components/auth";
import User from "./currentusers";
let bet1Won = 0;
let bet2Won = 0;
let playing = false
let bet1Placed = false;
let bet2Placed = false
var money = 0
let name = "bro";
let bet1PlacedMoney = 0;
let bet2PlacedMoney = 0;
var MoneyPlacedWithBet = 0;
let bet1check = false;
let bet2check = false;
const Header =  () => {
    const toastOptions = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: false,
        toastId: null
    }
    const [bet1,setBet1] = useState(10);
    const [bet2,setBet2] = useState(10);
    Socket.removeAllListeners()
    const checkStatus = ()=> {
        if (navigator.onLine === false) {
            toast.error("no internet",{...toastOptions,toastId:"no internet"})
        }
    }
    const setDetails =async ()=>{
        try {
            checkStatus()
            get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
                money = snapshot?.val()?.money || 0
                name = snapshot?.val()?.name || "bro"
                document.getElementById("showMoney").innerText = money + "$"
                document.getElementById("showName").innerText = name
                }).catch(error => {console.log("error internet",error)});
        } catch (e) {}
    }
    setInterval(setDetails,10)
    try {
        if (bet1Placed) {
            document.getElementById("firstBet").style.backgroundColor = "orange"
            document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1Won}</div>`
        }
        else{
            document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
            document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }
        if (bet2Placed) {
            document.getElementById("secondBet").style.backgroundColor = "orange"
            document.getElementById("secondBet").innerHTML = `<div>cashout</div><div id="bet2won">${bet2Won}</div>`
        } else {
            document.getElementById("secondBet").innerHTML = `<div>bet</div><div >${bet2}</div>`
            document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }
    }catch (e){}
    function firstBet(){
        console.log("first")
        if (bet1Placed){
            set(ref(db,auth?.currentUser?.uid+"/money"),Number(Number(Number(bet1Won) + MoneyPlacedWithBet).toFixed(2))).then()
            MoneyPlacedWithBet = Number(Number(Number(bet1Won) + MoneyPlacedWithBet).toFixed(2))
            toast.success("Added "+Number(bet1Won) +" at "+Number(bet1Won/bet1PlacedMoney).toFixed(2),{...toastOptions,toastId:"bet 1 won"})
            bet1Won = 0
            bet1Placed = false
            bet1PlacedMoney = 0
            document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
            document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }else {
            if (!playing) {
                    if (money < bet1) {
                        toast.error("low money", {...toastOptions, toastId: "1 low money"})
                    } else {
                        set(ref(db,auth?.currentUser?.uid+"/money"),Number(Number(money-bet1).toFixed(2))).then(()=>{
                            MoneyPlacedWithBet = Number(Number(money-bet1).toFixed(2))
                            bet1Placed = true
                            bet1Won = bet1
                            bet1PlacedMoney = bet1
                            document.getElementById("firstBet").style.backgroundColor = "orange"
                            document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1Won}</div>`
                        })
                    }
            }else{
                document.getElementById("firstBet").style.backgroundColor = "rgba(0, 51, 255, 0.71)"
                document.getElementById("firstBet").children.item(0).innerText = "next time"
            }
        }
    }
    function secondBet(){
        console.log("second")
        if (bet2Placed){
            set(ref(db,auth?.currentUser?.uid+"/money"),Number(Number(Number(bet2Won) + MoneyPlacedWithBet).toFixed(2))).then()
            MoneyPlacedWithBet = Number(Number(Number(bet2Won) + MoneyPlacedWithBet).toFixed(2))
            toast.success("Added "+Number(bet2Won) +" at "+Number(bet2Won/bet2PlacedMoney).toFixed(2),{...toastOptions,toastId:"bet 2 won"})
            bet2Won = 0
            bet2Placed = false
            bet2PlacedMoney = 0
            document.getElementById("secondBet").innerHTML = `<div>bet</div><div>${bet2}</div>`
            document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }
        else{
            if (!playing) {
                    if (money < bet2) {
                        toast.error("low money", {...toastOptions, toastId: "2 low money"})
                    } else {
                        set(ref(db,auth?.currentUser?.uid+"/money"),Number(Number(money-bet2).toFixed(2))).then(()=>{
                            MoneyPlacedWithBet = Number(Number(money-bet2).toFixed(2))
                            bet2Placed = true
                            bet2Won = bet2
                            bet2PlacedMoney = bet2
                            document.getElementById("secondBet").style.backgroundColor = "orange"
                            document.getElementById("secondBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet2Won}</div>`
                        })
                    }
            }else{
                document.getElementById("secondBet").children.item(0).innerText = "next time"
                document.getElementById("secondBet").style.backgroundColor =  "rgba(0, 51, 255, 0.71)"
            }
        }
    }
    const addBet1 = () => {
        setBet1(Number(bet1) + 10)
    }
    const subBet1 = () => {
        if (bet1 >= 20) {
            setBet1(bet1 - 10)
        } else {
            setBet1(10)
        }
    }
    const addBet2 = () => {
        setBet2(Number(bet2) + 10)
    }
    const subBet2 = () => {
        if (bet2 >= 20) {
            setBet2(bet2 - 10)
        } else {
            setBet2(10)
        }
    }
    const sOut = async () => {
        let log = window.confirm("do you want to logout");
        if (log) {
            signOut(auth).then(() => {
            }).catch(err => {
                console.log(err)
            })
        }
    }
    Socket.on("getX", data => {
        if (data !== "gone") {
            try {
                if (playing !== true) {
                    playing = true
                }
                document.getElementById("multiplier").style.color = "black"
                document.getElementById("plane").style.animation = "fly 5s linear infinite"
                document.getElementById("multiplier").innerText = data + "x"
                if (bet1Placed) {
                    bet1Won = (data * bet1PlacedMoney).toFixed(2)
                    if (bet1check) {
                        document.getElementById("bet1won").innerText = bet1Won
                    }
                    else {
                        bet1check = true
                        document.getElementById("firstBet").style.backgroundColor = "orange"
                        document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1Won}</div>`
                    }
                }
                if (bet2Placed) {
                    bet2Won = (data * bet2PlacedMoney).toFixed(2)
                    if (bet2check) {
                        document.getElementById("bet2won").innerText = bet2Won
                    }
                    else {
                        document.getElementById("secondBet").style.backgroundColor = "orange"
                        document.getElementById("secondBet").innerHTML = `<div>cashout</div><div id="bet2won">${bet2Won}</div>`
                    }
                }
            } catch (e) {
            }
        } else {
            try {
                playing = false
                MoneyPlacedWithBet = 0

                bet1Won = 0
                bet1Placed = false
                bet1PlacedMoney = 0

                bet2Won = 0
                bet2Placed = false
                bet2PlacedMoney = 0

                bet1check = false
                bet2check = false
                document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
                document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                document.getElementById("secondBet").innerHTML = `<div>bet</div><div>${bet2}</div>`
                document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                document.getElementById("multiplier").style.color = "red"
                document.getElementById("plane").style.animation = "none"
                toast.error(data + " at " + document.getElementById("multiplier").innerText, {...toastOptions,toastId:"gone"})
            } catch (e) {
            }
        }
    })
    return (
        <div className={"total2"}>
            <div className="first">
                <ToastContainer closeButton={false} style={{width: '40%'}}/>
                <div className="form">
                    <div className={"details"}>
                        <div>{"‎ "}</div>
                        <div className="name" id={"showName"}>{name}</div>
                        <div className={"MSDiv"}>
                            <div className="money" id={"showMoney"}>{money + "$"}</div>
                            <div id={"addMoney"}><h4>+</h4></div>
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
                                        <button onClick={subBet1} className={"minus1"}>−</button>
                                        <input className={"betinput"} type="number" value={bet1} onChange={(e) => {
                                            if (e.target.value == null || e.target.value === "") {
                                                setBet1("‎ ")
                                            }
                                            else if(Number(e.target.value) <= 0){
                                                setBet1(10)
                                            }
                                            else {
                                                setBet1(Number(e.target.value))
                                            }
                                        }}/>
                                        <button className={"plus1"} onClick={addBet1}>+</button>
                                    </div>
                                    <div className={"bet-values"}>
                                        <div className={"bet-value-1"}>
                                            <div className={"bet-value-100"} onClick={() => {
                                                setBet1(100)
                                            }}>100
                                            </div>
                                            <div className={"bet-value-200"} onClick={() => {
                                                setBet1(200)
                                            }}>200
                                            </div>
                                        </div>
                                        <div className={"bet-value-2"}>
                                            <div className={"bet-value-500"} onClick={() => {
                                                setBet1(500)
                                            }}>500
                                            </div>
                                            <div className={"bet-value-1000"} onClick={() => {
                                                setBet1(1000)
                                            }}>1000
                                            </div>
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
                                        <button onClick={subBet2} className={"minus1"}>−</button>
                                        <input className={"betinput"} type="number" value={bet2} onChange={(e) => {
                                            if (e.target.value == null || e.target.value === "") {
                                                setBet2("‎ ")
                                            }
                                            else if(Number(e.target.value) <= 0){
                                                setBet2(10)
                                            }
                                            else {
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
                                <button className="bet-button" id={"secondBet"} onClick={secondBet}>
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