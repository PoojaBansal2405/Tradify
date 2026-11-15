import React , {useEffect,useState} from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Funds from './Funds'
import Orders from './Orders'
import Holdings from './Holdings'
import Positions from './Positions'
import Summary from './Summary'
import Markets from './Markets'

import Apps from './Apps'
import WatchList from './WatchList'
import {GeneralContextProvider} from './Generalcontext'
import {Routes,Route} from 'react-router-dom'
const Dashboard=()=>{
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:3002/verify",
                    {
                        withCredentials: true,
                    }
                );

                if (!data.status) {
                    localStorage.removeItem("token");
                    window.location.href = "http://localhost:3000/login";
                } else {
                    console.log("Logged in user:", data.user);
                    setLoading(false);
                }
            } catch (err) {
                localStorage.removeItem("token");
                window.location.href = "http://localhost:3000/login";
            }
        };

        verifyUser();
    }, []);
    if (loading) {
        return <h2>Loading...</h2>;
    }
    return(
        <div className = "dashboard-container">
            <GeneralContextProvider>
            <WatchList/>
            
            <div className="content">
                <Routes>
                    <Route exact path="/" element={<Summary/>}/>
                    <Route path="/markets" element={<Markets/>}/>
                    <Route path="/orders" element={<Orders/>}/>
                    <Route path="/holdings" element={<Holdings/>}/>
                    <Route path="/positions" element={<Positions />} />
                    <Route path="/funds" element={<Funds />} />
                    <Route path="/apps" element={<Apps />} />
                </Routes>
           
            </div>
            </GeneralContextProvider >
            <ToastContainer />
        </div>
          )
}


export default Dashboard

