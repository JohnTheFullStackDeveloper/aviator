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
    messages = document.getElementById("messages")
    isGameRunning = false;
    document.getElementById("bet").innerText = "Bet"
    if(PlayingBet > 0){
    messages.innerText = "you lose "+PlayingBet
    }
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
    <h4 id="money">{money}$</h4>
    <div className="runners">
      <h1 id='x'>Connecting</h1>
      <h1 id='y'></h1>
      </div>
      <div className="inputs">
      <input type='number' id="moneyPlaced"/>
      <button id="bet" onClick={()=>onBet(money,setMoney)}>bet</button>
      </div>
      <div className='msg'>
      <h1 id="messages"></h1>
      </div>
    </div>
  );
}

export default App;
