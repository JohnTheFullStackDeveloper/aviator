
import { useState } from "react"
import QRCode from 'react-qr-code';
export const Deposit=(props)=>{
    const [qr,setQr] = useState("upi://pay?pa=9640122807@fam&pn=john prakash&am=100.0")
    const [money,setMoney] =useState(100)
return(
    <div className="container2"> 
    <div className="container" style={{animation:""}}>
        <div>
         <div>
            <h4 style={{color:"green"}}>Payment to the Aviator Underprocess</h4>
            <h5>Name:John Prakash</h5>
            <h3>Amount:{money}</h3>
        </div>
        <div>
            <div id="qrcode">
            <QRCode style={{marginTop:20}}
                    title="Payment with this qr"
                    value={qr}
                    bgColor={"white"}
                    fgColor={"black"}
                    size={250}
                />
            </div>
            <div className="link">
                <input id="amount" placeholder="amount" type="number" onChange={(e)=>{
                    if(e.target.value <= 10 || e.target.value == ""){
                        setQr(`upi://pay?pa=9640122807@fam&pn=john prakash&am=`+10)
                        setMoney(10)
                    }
                    else{
                        setQr(`upi://pay?pa=9640122807@fam&pn=john prakash&am=`+e.target.value)
                        setMoney(e.target.value)
                    }
                }}/>
                <a id="payApp" href={qr}><button>pay with app</button></a>
            </div>
            <input placeholder="Your Name For Identity"></input>
            <input placeholder="After paymnent paste transaction id here"></input>
            </div>
    <button onClick={()=>{props.onClick();}}>goto home</button>
    </div>
    </div>
    </div>
)
}