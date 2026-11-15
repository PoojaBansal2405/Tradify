
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Funds = () => {
    

        const [balance, setBalance] = useState(0);
         const[showAddFunds , setShowAddFunds] = useState(false);
         const[showWithdrawFunds,setShowWithdrawFunds] = useState(false);
         const[amount,setAmount] = useState("");

        useEffect(() => {
           
            axios.get(
                "http://localhost:3002/funds",
                {
                    withCredentials: true
                }
            )
                .then((res) => {
                    setBalance(res.data.balance);
                })
                .catch((err) => {
                    console.log(err);
                })

        }, []);

 const addFunds = async()=>{
     try{
        
        const res = await axios.post("http://localhost:3002/addFunds" , {amount:Number(amount)},{withCredentials:true})
        setBalance(res.data.balance);
        setAmount("");
        setShowAddFunds(false);
     }catch(err){
        console.log(err);
     }
 }

    const withdrawFunds = async () => {
        try {
            console.log("add clicked");
            const res = await axios.post("http://localhost:3002/withdrawFunds", { amount: Number(amount) }, { withCredentials: true })
            setBalance(res.data.balance);
            setAmount("");
            setShowWithdrawFunds(false);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            <div className="funds">
                <p>Instant, zero-cost fund transfers with UPI </p>
                <button onClick={()=>setShowAddFunds(true)} className="btn btn-green">
                    Add funds
                </button>
                {showAddFunds && (
                    <div>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                        <button onClick={addFunds}>
                            Add
                        </button>
                    </div>
                )}
                <button onClick={()=>setShowWithdrawFunds(true)} className="btn btn-blue">
                    Withdraw funds
                    </button>
                {showWithdrawFunds && (
                    <div>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                        <button onClick={withdrawFunds}>
                            Withdraw
                        </button>
                    </div>
                )}
               
            </div>


            <div className="row">
                <div className="col">
                    <span>
                        <p>Equity</p>
                    </span>
                    <div className="table">

                        <div className="data">
                            <p>Available balance</p>
                            <p className="imp colored">
                                ₹ {balance}
                            </p>
                        </div>

                        <div className="data">
                            <p>Used margin</p>
                            <p className="imp">
                                ₹ 0
                            </p>
                        </div>

                        <div className="data">
                            <p>Available cash</p>
                            <p className="imp">
                                ₹ {balance}
                            </p>
                        </div>

                        <hr />

                        <div className="data">
                            <p>Opening Balance</p>
                            <p>
                                ₹ {balance}
                            </p>
                        </div>

                        <div className="data">
                            <p>Payin</p>
                            <p>
                                ₹ 0
                            </p>
                        </div>

                        <div className="data">
                            <p>Withdrawn</p>
                            <p>
                                ₹ 0
                            </p>
                        </div>

                    </div>
                    
                    
                </div>

                <div className="col">
                    <div className="commodity">
                        <p>You don't have a commodity account</p>
                        <Link className="btn btn-blue">Open Account</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Funds;