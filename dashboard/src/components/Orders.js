import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {

    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3002/allOrders",{
            withCredentials:true
        })
            .then((res) => {
                console.log(res.data);
                setAllOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="orders">

            {allOrders.length === 0 ? (
                <Link to={"/"} className="btn">
                    Get Started
                </Link>
            ) : (
                <>
                    <h3 className="title">
                        Orders ({allOrders.length})
                    </h3>

                    <div className="order-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Qty.</th>
                                    <th>Price</th>
                                    <th>Mode</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allOrders.map((order, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{order.name}</td>
                                            <td>{order.qty}</td>
                                            <td>{order.price}</td>
                                            <td>{order.mode}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>
                </>
            )}

        </div>
    );
};

export default Orders;