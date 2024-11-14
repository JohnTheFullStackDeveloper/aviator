import { useState } from "react"

export const Deposits = ()=>{
    const [transactionId,setTransactionId] = useState("")
    const [name,setName] = useState("")
    function submitDeposit(){

    }
    return(
        <div className="container3">
            <div className="container" style={{animation:""}}>
                <div>
                <input placeholder="Your Name For Identity"  onChange={(e)=>{setName(e.target.value)}}></input>
                <input placeholder="paste transaction id here" onChange={(e)=>{setTransactionId(e.target.value)}}></input>
                <button onClick={submitDeposit}>Deposit</button>
                </div>
            </div>
        </div>
    )
}