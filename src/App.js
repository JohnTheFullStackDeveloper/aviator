import logo from './logo.svg';
import './App.css';
import  io from 'socket.io-client'
const socket = io('https://check-t8r7.onrender.com')
socket.on("getX",data=>{ 
  if(data == "gone"){
    document.getElementById("y").innerText = data
}
  else{
  document.getElementById("y").innerText = ""
  document.getElementById("x").innerText = data
  }
})
let money = 10.11;
function App() {
  return (
    <div className="App">
    <h1 id="money">{money} $</h1>
      <h1 id='x'>hello bro</h1>
      <h1 id='y'></h1>
      <button id="bet">bet</button>
    </div>
  );
}

export default App;
