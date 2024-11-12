import {child, get, ref, set} from 'firebase/database'
import {useEffect, useState} from "react";
import {auth, db} from "../config/firebase";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {signOut} from "firebase/auth";
import img from './signout.png'
import './cssforgame.css'
import {Socket} from "../components/auth";
import User from "./currentusers";
import menu from './menu.png';
import wrong from './worng.png'
import {MenuOriginal} from "./MenuOriginal";
import MenuHistory from "./menuHistory";
export let hideOrNot = ["hide"]
export let hideHistoryOrNot = ["hide"]
let bet1Won = 0;
let bet2Won = 0;
let playing = false
let bet1Placed = false;
let bet2Placed = false
var RoundName = ""
var money = 0
var anotherMoney = 0
let name = "bro";
let bet1PlacedMoney = 0;
let bet2PlacedMoney = 0;
var MoneyPlacedWithBet = 0;
let bet1check = false;
let bet2check = false;
let advancedBet1 = false;
let advancedBet2 = false;
let latestX;
setTimeout(() => {
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            money = snapshot?.val()?.money || 0
            name = snapshot?.val()?.name || "bro"
            document.getElementById("showMoney").innerText = money + "$ "
            document.getElementById("showName").innerText = name
        }).catch(error => {
            console.log("error internet", error)
        });
    } catch (e) {
    }
}, 3000)
let i0 = setInterval(()=>{
    try {
        get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
            document.getElementById("showMoney").innerText = snapshot?.val()?.money + "$" || 0
            document.getElementById("showName").innerText = snapshot?.val()?.name || "bro"
        }).catch(error => {
            console.log("error internet", error)
        });
    } catch (e) {}
},100)

const Header = () => {
    const [bet1, setBet1] = useState(10);
    const [bet2, setBet2] = useState(10);
    const [XList, setXList] = useState([]);
    function menuHide() {
        if (hideOrNot[0] === "hide") {
            document.getElementsByClassName("menuBar")[0].style.display = "flex";
            hideOrNot[0] = "none"
        } else {
            document.getElementsByClassName("menuBar")[0].style.display = "none";
            hideOrNot[0] = "hide"
        }
    }
    const toastOptions = {
        position: "top-end",
        autoClose: 2000,
        closeButton: true,
        toastId: "null",
        closeOnClick:true
    }
    Socket.removeAllListeners()
    const checkStatus = () => {
        if (navigator.onLine === false) {
            toast.error("no internet", {...toastOptions, toastId: "no internet"})
        }
    }
    try {
        if (bet1Placed) {
            document.getElementById("firstBet").style.backgroundColor = "orange"
            document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1Won}</div>`
        } else if (advancedBet1) {
            try {
                get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
                    money = snapshot?.val()?.money || 0
                    name = snapshot?.val()?.name || "bro "
                    document.getElementById("showMoney").innerText = money + "$"
                    document.getElementById("showName").innerText = name
                }).catch(error => {
                    console.log("error internet", error)
                });
            } catch (e) {
            }
        } else {
            document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
            document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }
        if (bet2Placed) {
            document.getElementById("secondBet").style.backgroundColor = "orange"
            document.getElementById("secondBet").innerHTML = `<div>cashout</div><div id="bet2won">${bet2Won}</div>`
        } else if (advancedBet2) {
            try {
                get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
                    money = snapshot?.val()?.money || 0
                    name = snapshot?.val()?.name || "bro"
                    document.getElementById("showMoney").innerText = money + "$"
                    document.getElementById("showName").innerText = name
                }).catch(error => {
                    console.log("error internet", error)
                });
            } catch (e) {
            }
        } else {
            document.getElementById("secondBet").innerHTML = `<div>bet</div><div >${bet2}</div>`
            document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        }
    } catch (e) {}

    Socket.on("getRoundName", data => {
        RoundName = data
    })

    function firstBet() {
        if (bet1Placed) {
            money = Number(Number(Number(bet1Won) + MoneyPlacedWithBet).toFixed(2))
            set(ref(db, auth?.currentUser?.uid + "/money"), money).then()
            let Now = new Date()
            set(ref(db, auth?.currentUser?.uid + "/history/" + RoundName + "1"), {
                Bet: bet1PlacedMoney,
                Time: Now.getHours().toString() + ":" + Now.getMinutes().toString() + ":" + Now.getSeconds(),
                Date: Now.getDate().toString() + "-" + (Now.getMonth() + 1).toString() + "-" + Now.getFullYear().toString().substring(2, 4),
                BetWon: bet1Won,
                at: Number(bet1Won / bet1PlacedMoney).toFixed(2)
            }).then()
            Socket.emit("placedBet", -bet1PlacedMoney)
            MoneyPlacedWithBet = Number(Number(Number(bet1Won) + MoneyPlacedWithBet).toFixed(2))
            toast.success("Added " + Number(bet1Won) + " at " + Number(bet1Won / bet1PlacedMoney).toFixed(2), {
                ...toastOptions,
                toastId: "bet 1 won"
            })
            bet1Won = 0
            bet1Placed = false
            bet1PlacedMoney = 0
            document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
            document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        } else {
            if (!playing) {
                if (money < bet1) {
                    toast.error("low money", {...toastOptions, toastId: "1 low money"})
                } else {
                    let cc = money
                    anotherMoney = money
                    anotherMoney = Number(Number(anotherMoney - bet1).toFixed(2))
                    money = anotherMoney
                    document.getElementById("firstBet").style.backgroundColor = "orange"
                    document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1}</div>`
                    MoneyPlacedWithBet = Number(Number(cc - bet1).toFixed(2))
                    bet1Placed = true
                    bet1Won = bet1
                    bet1PlacedMoney = bet1
                    set(ref(db, auth?.currentUser?.uid + "/money"), money).then(() => {
                        Socket.emit("placedBet", bet1)
                        let Now = new Date()
                        set(ref(db, auth?.currentUser?.uid + "/history/" + RoundName + "1"), {
                            Bet: bet1PlacedMoney,
                            Time: Now.getHours().toString() + ":" + Now.getMinutes().toString() + ":" + Now.getSeconds(),
                            Date: Now.getDate().toString() + "-" + (Now.getMonth() + 1).toString() + "-" + Now.getFullYear().toString().substring(2, 4)
                        }).then()
                    })
                }
            } else {
                if (!advancedBet1) {
                    document.getElementById("firstBet").style.backgroundColor = "rgba(0, 51, 255, 0.71)"
                    document.getElementById("firstBet").children.item(0).innerText = "next round"
                    advancedBet1 = true
                } else {
                    document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
                    document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                    advancedBet1 = false
                }
            }
        }
    }

    function secondBet() {
        if (bet2Placed) {
            money = Number(Number(Number(bet2Won) + MoneyPlacedWithBet).toFixed(2))
            set(ref(db, auth?.currentUser?.uid + "/money"), money).then()
            let Now = new Date()
            set(ref(db, auth?.currentUser?.uid + "/history/" + RoundName + "2"), {
                Bet: bet2PlacedMoney,
                Time: Now.getHours().toString() + ":" + Now.getMinutes().toString() + ":" + Now.getSeconds(),
                Date: Now.getDate().toString() + "-" + (Now.getMonth() + 1).toString() + "-" + Now.getFullYear().toString().substring(2, 4),
                BetWon: bet2Won,
                at: Number(bet2Won / bet2PlacedMoney).toFixed(2)
            }).then()
            Socket.emit("placedBet", -bet2PlacedMoney)
            MoneyPlacedWithBet = Number(Number(Number(bet2Won) + MoneyPlacedWithBet).toFixed(2))
            toast.success("Added " + Number(bet2Won) + " at " + Number(bet2Won / bet2PlacedMoney).toFixed(2), {
                ...toastOptions,
                toastId: "bet 2 won"
            })
            bet2Won = 0
            bet2Placed = false
            bet2PlacedMoney = 0
            document.getElementById("secondBet").innerHTML = `<div>bet</div><div>${bet2}</div>`
            document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
        } else {
            if (!playing) {
                if (money < bet2) {
                    toast.error("low money", {...toastOptions, toastId: "2 low money"})
                } else {
                    let cc = money
                    bet2PlacedMoney = bet2
                    anotherMoney = money
                    anotherMoney = Number(Number(anotherMoney - bet2).toFixed(2))
                    money = anotherMoney
                    MoneyPlacedWithBet = Number(Number(cc - bet2).toFixed(2))
                    document.getElementById("secondBet").style.backgroundColor = "orange"
                    document.getElementById("secondBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet2}</div>`
                    bet2Placed = true
                    bet2Won = bet2
                    set(ref(db, auth?.currentUser?.uid + "/money"), money).then(() => {
                        Socket.emit("placedBet", bet2)
                        let Now = new Date()
                        set(ref(db, auth?.currentUser?.uid + "/history/" + RoundName + "2"), {
                            Bet: bet2PlacedMoney,
                            Time: Now.getHours().toString() + ":" + Now.getMinutes().toString() + ":" + Now.getSeconds(),
                            Date: Now.getDate().toString() + "-" + (Now.getMonth() + 1).toString() + "-" + Now.getFullYear().toString().substring(2, 4)
                        }).then()
                    })
                }
            } else {
                if (!advancedBet2) {
                    document.getElementById("secondBet").children.item(0).innerText = "next round"
                    document.getElementById("secondBet").style.backgroundColor = "rgba(0, 51, 255, 0.71)"
                    advancedBet2 = true
                } else {
                    document.getElementById("secondBet").innerHTML = `<div>bet</div><div>${bet2}</div>`
                    document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                    advancedBet2 = false
                }
            }
        }
    }

    Socket.on("getList", list => {
        let a = []
        list.forEach(element => {
            if (element < 2) {
                a.push(<div className={`xBox`} style={{color: "rgba(0, 25, 245, 0.95)"}}>{element}</div>)
            } else if (element < 5) {
                a.push(<div className={`xBox`} style={{color: "rgba(163, 0, 245, 0.95)"}}>{element}</div>)
            } else {
                a.push(<div className={'xBox'} style={{color: "rgba(245, 0, 0, 0.95)"}}>{element}</div>)
            }
            setXList(a)
        });
    })
    Socket.on("getTimeToStart", data => {
        document.getElementById("multiplier").innerText = "game starts in " + data
        document.getElementById("multiplier").style.color = "orange"
    })

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

    Socket.on("getX", data => {
        if (data !== "gone") {
            latestX = data;
            try {
                if (playing !== true) {
                    playing = true
                }
                if (document.getElementById("multiplier").style.color !== "black") {
                    document.getElementById("multiplier").style.color = "black"
                    document.getElementById("plane").style.animation = "fly 5s linear infinite"
                }
                document.getElementById("multiplier").innerText = data + "x"
                if (bet1Placed) {
                    bet1Won = (data * bet1PlacedMoney).toFixed(2)
                    if (bet1check) {
                        document.getElementById("bet1won").innerText = bet1Won
                    } else {
                        bet1check = true
                        document.getElementById("firstBet").style.backgroundColor = "orange"
                        document.getElementById("firstBet").innerHTML = `<div>cashout</div><div id="bet1won">${bet1Won}</div>`
                    }
                }
                if (bet2Placed) {
                    bet2Won = (data * bet2PlacedMoney).toFixed(2)
                    if (bet2check) {
                        document.getElementById("bet2won").innerText = bet2Won
                    } else {
                        bet2check = true
                        document.getElementById("secondBet").style.backgroundColor = "orange"
                        document.getElementById("secondBet").innerHTML = `<div>cashout</div><div id="bet2won">${bet2Won}</div>`
                    }
                }
            } catch (e) {
            }
        } else {
            try {
                try {
                    get(child(ref(db), auth?.currentUser?.uid)).then(snapshot => {
                        money = snapshot?.val()?.money || 0
                        name = snapshot?.val()?.name || " bro"
                        document.getElementById("showMoney").innerText = money + "$"
                        document.getElementById("showName").innerText = name
                    }).catch(error => {
                    });
                } catch (e) {
                }
                if (bet1Placed) {
                    set(ref(db, auth?.currentUser?.uid + "/history/" + RoundName + "1/goneAt"), latestX).then()
                }
                if (bet2Placed) {
                    set(ref(db, auth?.currentUser?.uid + "/history/" + RoundName + "2/goneAt"), latestX).then()
                }
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
                advancedBet1 = false
                advancedBet2 = false
                document.getElementById("firstBet").innerHTML = `<div>bet</div><div>${bet1}</div>`
                document.getElementById("firstBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                document.getElementById("secondBet").innerHTML = `<div>bet</div><div>${bet2}</div>`
                document.getElementById("secondBet").style.backgroundColor = "rgba(0, 255, 0, 0.7)"
                document.getElementById("multiplier").style.color = "red"
                document.getElementById("plane").style.animation = "none"
                if (document.getElementById("multiplier").innerText === "game starts in 0") {
                    toast.error(data + " at 1.00", {
                        ...toastOptions,
                        toastId: "gone"
                    })
                    document.getElementById("multiplier").innerText = "1.00x"
                } else {
                    toast.error(data + " at " + document.getElementById("multiplier").innerText, {
                        ...toastOptions,
                        toastId: "gone"
                    })
                }
            } catch (e) {
            }
        }
    })

    return (
        <div className={"total2"}>
            <div className="first">
            <MenuOriginal/>
            <MenuHistory/>
                    <ToastContainer closeButton={false} autoClose={2}  style={{display:"none"}}/>
                <div className="form">
                    <div className={"details"}>
                        <div>{"‎ "}</div>
                        <div className="name" id={"showName"}>{name}</div>
                        <div className={"MSDiv"}>
                            <div className="money" id={"showMoney"}>{money + "$"}</div>
                            <div id={"addMoney"}><img onClick={() => menuHide()} src={menu}
                                                      style={{width: 15, cursor: "pointer"}}/></div>
                        </div>
                    </div>
                    <div className="game-area">
                        <div className='Boxes'>
                            {XList}
                        </div>
                        <div id="plane">
                        <div className="flight-path"></div>
                            <div className="plane-icon">✈️</div>
                        </div>
                        <div className="multiplier-display" id={"multiplier_display"}>
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
                                            } else if (Number(e.target.value) <= 0) {
                                                setBet1(10)
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
                                            } else if (Number(e.target.value) <= 0) {
                                                setBet2(10)
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