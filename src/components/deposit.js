import { auth } from "../config/firebase";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
let first = true;
export const Deposit = (props) => {
  const [qr, setQr] = useState('please enter a number');
  const [money, setMoney] = useState("Enter Amount");
  function checkApp() {
    document.getElementById("toDeposit").click();   
  }
  return (
    <div className="container2">
      <Link to={"/deposit"} id="toDeposit" />
      <div className="container" style={{ animation: "" }}>
        <div>
          <button
            onClick={() => {
              props.onClick();
            }}
            style={{ maxWidth: 60 }}
          >
            home
          </button>
          <div>
            <h3 style={{ color: "green" }}>
              Payment to the Aviator Underprocess
            </h3>
            <h5>Name:John Prakash</h5>
            <h3>Amount:{money}</h3>
          </div>
          <div>
            <div id="qrcode">
              <QRCode
                style={{ marginTop: 20 }}
                title="Payment with this qr"
                value={qr}
                bgColor={"white"}
                fgColor={"black"}
                size={250}
              />
            </div>
            <div className="link">
              <input
                id="amount"
                placeholder="amount"
                type="number"
                onChange={(e) => {
                  if (e.target.value <= 10 || e.target.value == "") {
                    let Now = new Date()
                    setQr(`upi://pay?pa=9640122807@fam&tn=${Now.getDate().toString() + "J" + (Now.getMonth() + 1).toString() + "J" + Now.getFullYear().toString().substring(2, 4)+"@"+auth.currentUser.email + "MJ10"}&pn=john prakash&am=` + 10);
                    setMoney(10);
                  } else {
                    let Now = new Date()
                    setQr(`upi://pay?pa=9640122807@fam&tn=${Now.getDate().toString() + "J" + (Now.getMonth() + 1).toString() + "J" + Now.getFullYear().toString().substring(2, 4)+"@"+auth.currentUser.email + `MJ${e.target.value}`}&pn=john prakash&am=` + e.target.value);
                    setMoney(e.target.value);
                  }
                }}
              />
              <a id="payApp" href={qr}>
                <button>pay with app</button>
              </a>
            </div>
          </div>
          <button onClick={checkApp}>if you not receive money please click here</button>
        </div>
      </div>
    </div>
  );
};
