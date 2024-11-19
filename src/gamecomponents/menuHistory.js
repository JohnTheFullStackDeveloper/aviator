import img from "./signout.png";
import wrong from "./worng.png";
import { hideHistoryOrNot, hideOrNot } from "./header";
import { child, get, ref, set } from "firebase/database";
import { auth, db } from "../config/firebase.js";
export function getHistory() {
  get(child(ref(db), auth?.currentUser?.uid + "/history")).then((snapshot) => {
    document.getElementById("allHistory").innerHTML = "";
    snapshot.forEach((e) => {
    let isWon = false
      let won = document.createElement("div");
      won.className = "menuBar-f"
      let child = document.createElement("div");
      child.className = "When";
      child.innerHTML = `<div class="Time"><div>${e.val().Time}</div><div>${
        e.val().Date
      }</div></div>`;
      let child2 = document.createElement("div");
      if (e.val()?.goneAt == undefined) {
        isWon = true
        child2.className = "HowMuch";
        if(e.val()?.at == undefined || e.val()?.BetWon == undefined){
          won = null
        }
        else{
        child2.innerHTML = `<div class="MoneyWon"><div>${Number(e.val().Bet).toFixed(2)}</div><div>${e.val().at}</div><div>${e.val().BetWon}</div></div>`;
        }
      } else {
        child2.className = "HowMuchL";
        child2.innerHTML = `<div class="MoneyLoss"><div>${Number(e.val().Bet).toFixed(2)}</div><div>${e.val().goneAt}</div></div>`;
      }
      try{
      if(isWon){
        won.style.backgroundColor = "green"
      }
      won.appendChild(child)
      won.appendChild(child2)
      document.getElementById("allHistory").appendChild(won);
      }catch(e){}
    });
    let gun = document.createElement("div")
    gun.className = "menuBar-f"
    gun.innerHTML = `<div class="gurentee">no more histroy</div>`
    document.getElementById("allHistory").appendChild(gun)
  });
}
const MenuHistory = () => {
  function hideMenuHistory() {
    hideOrNot[0] = "hide";
    hideHistoryOrNot[0] = "hide";
    document.getElementsByClassName("menuBar-2")[0].style.display = "none";
    document.getElementsByClassName("menuBar")[0].style.display = "none";
  }

  return (
    <div className={"menuBar-2"}>
      <div className={"wrong-e"}onClick={hideMenuHistory}style={{ marginLeft: 10, marginTop: 10, position: "absolute" }}>
        <img src={wrong} width={20} />
      </div>
      <div id="allHistory">
  
      </div>
    </div>
  );
};
export default MenuHistory;
