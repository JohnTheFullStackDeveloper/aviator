import logo from './logo.svg';
import './App.css';
import  io from 'socket.io-client'
import { useState } from 'react';
let isGameRunning =true;
let PlayingBet = 0;
let winning = 0;
let isBet = false;
const socket = io('https://check-t8r7.onrender.com')
let messages;
socket.on("getX",data=>{ 
  if(data == "gone"){
    isGameRunning = false;
    document.getElementById("bet").innerText = "Bet"
    messages.innerText = "you lose "+PlayingBet
    PlayingBet = 0
    winning = 0
    isBet = false
    document.getElementById("y").innerText = data
}
  else{
  isGameRunning = true;
  if(isBet){
    console.log(PlayingBet * data)
    winning = PlayingBet * data
    document.getElementById("bet").innerText = "cash out "+winning.toFixed(2)
  }
  document.getElementById("y").innerText = ""
  document.getElementById("x").innerText = data
  }
})
function onBet(money,setMoney){
  messages = document.getElementById("messages")
  if(isBet){
    setMoney(Number((money+winning).toFixed(2)))
    document.getElementById("bet").innerText = "Bet"
    PlayingBet = 0
    messages.innerText = "you win "+winning.toFixed(2)+" $"
    winning = 0
    isBet = false
  }
  else{
  if(!isGameRunning){
  let bet = Number(document.getElementById("moneyPlaced").value)
  if(money < bet){
   messages.innerText = "less money"
  }
  else{
    if(bet >= 1){
    console.log(money,bet)
    setMoney(Number((money - bet).toFixed(2)))
    PlayingBet = bet
    isBet = true
    winning = bet
    messages.innerText = "bet placed "+bet
    document.getElementById("bet").innerText = "cash out"
    }
  }
}
else{
  messages.innerText = "wait for next round"
}
}
}
function App() {
let [money,setMoney] = useState(24.43)
return (
    <div className="App">
    <h1 id="money">{money}$</h1>
      <h1 id='x'>Connecting</h1>
      <h1 id='y'></h1>
      <input type='number' id="moneyPlaced"/>
      <button id="bet" onClick={()=>onBet(money,setMoney)}>bet</button>
      <h1 id="messages"></h1>

    </div>
  );
}

export default App;
