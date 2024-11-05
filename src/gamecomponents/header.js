import {child, get, ref} from 'firebase/database'
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
let playing = false
let bet1Placed = false;
const Header = () => {
    Socket.removeAllListeners()
    const toastOptions = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: false,
        toastId: null
    }
    const [name, setName] = useState('')
    const [money, setMoney] = useState(0)
    const [bet1, setBet1] = useState(10)
    const [bet2, setBet2] = useState(10)
    const [bet1PlacedMoney, setBet1PlacedMoney] = useState(0)
    const [render, setRender] = useState(null)
    const firstBet = () => {
        console.log(bet1Placed)
        if (bet1Placed) {
            Socket.emit("withdraw1", {uid: auth?.currentUser?.uid, wonMoney: Number(bet1Won), nowMoney: money})
            toast.success("withdraw", {...toastOptions, toastId: "withdraw"})
            bet1Placed = false
            setBet1PlacedMoney(0)
        } else {
            if (playing) {
                toast.warning("wait for next round", {...toastOptions, toastId: "wait for  round"})
                setRender("")
            } else {
                if (money < bet1) {
                    toast.error("low money", {...toastOptions, toastId: "low money"})
                    setRender("")
                } else {
                    bet1Won = bet1
                    Socket.emit("firstBet", {uid: auth?.currentUser?.uid, totalMoney: money, betPlaced: bet1})
                    bet1Placed = true
                    setRender("")
                }
            }
        }
    }
    Socket.on("firstBetS", data => {
        toast.success(data.msg, {...toastOptions, toastId: "bet 1 placed successfully"})
        bet1Placed = true
        setBet1PlacedMoney(data.betPlaced)
    })
    Socket.on("firstBetF", data => {
        toast.error(data.msg, {...toastOptions, toastId: "bet 1 failed successfully"})
        bet1Placed = false
        setBet1PlacedMoney(0)
    })
    Socket.on("withdraw1S", data => {
        toast.success(data, {...toastOptions, toastId: "withdraw1 successfully"})
        setRender("")
    })
    try {
        if (bet1Placed) {
            document.getElementById("firstBet").style.backgroundColor = "orange"
            document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1Won}</div>`
        } else {
            document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
            document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }
    } catch (e) {
    }
    Socket.on("getX", data => {
        if (data !== "gone") {
            try {
                if (playing !== true) {
                    playing = true
                }
                if (bet1Placed) {
                    bet1Won = (data * bet1PlacedMoney).toFixed(2)
                    document.getElementById("bet1won").innerHTML = `<div>${bet1Won}</div>`
                }
                document.getElementById("multiplier").style.color = "black"
                document.getElementById("plane").style.animation = "fly 5s linear infinite"
                document.getElementById("multiplier").innerText = data + "x"
            } catch (e) {
            }
        } else {
            try {
                bet1Placed = false
                playing = false
                document.getElementById("multiplier").style.color = "red"
                document.getElementById("plane").style.animation = "none"
                toast.error(data + " at " + document.getElementById("multiplier").innerText, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    toastId: "gone",
                    pauseOnHover: false
                })
                setBet1PlacedMoney(0)
            } catch (e) {
            }
        }
    })
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            setName(snapshot?.val()?.name || "");
            setMoney(snapshot?.val()?.money || 0);
        })
    } catch (e) {
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
    return (
        <div className={"total2"}>
            <div className="first">
                <ToastContainer closeButton={false} style={{width: '50%'}}/>
                <div className="form">
                    <div className={"details"}>
                        <div>{"‎ "}</div>
                        <div className="name">{name}</div>
                        <div className={"MSDiv"}>
                            <div className="money">{money + "$"}</div>
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
                                            } else {
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