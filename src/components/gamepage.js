import { auth } from "../config/firebase";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../gamecomponents/header";
import { hord } from "../gamecomponents/header";
import { Deposit } from "./deposit";
let a = true;
const GamePage = () => {
  // create pressed state
    let z;
    if(localStorage.getItem("page")=="d"){
        z = false
    }
    else{
        z = true
    }

  const [pressed, setPressed] = useState(z);

  // onClick() function
  function press() {
    if (localStorage.getItem("page") == "d") {
      localStorage.setItem("page", "h");
      setPressed(true);
    } else {
      localStorage.setItem("page", "d");
      setPressed(false);
    }
  }

  // true or false // change component
  const component = pressed ? (
    <Header onClick={press} />
  ) : (
    <Deposit onClick={press} />
  );
  return component;
};
export default GamePage;
