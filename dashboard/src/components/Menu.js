import React, { useState,useEffect } from "react";

import { Link } from "react-router-dom";
import axios from 'axios';
const Menu = () => {
    const handleLogout = async () => {
        console.log("Logout clicked");
        try {
            await axios.post(
                "http://localhost:3002/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            window.location.href = "http://localhost:3000/";
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.removeItem("token");
            window.location.href = "http://localhost:3000/";
        }
    };
    
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:3002/verify",
                    {
                        withCredentials: true
                    }
                );

                if (data.status) {
                    setUsername(data.user);
                }

            } catch (error) {
                console.log(error);
            }
        };

        getUser();

    }, []);
    const handleMenuClick = (indx) => {
        setSelectedMenu(indx);
    }

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }

    const menuClass = "menu";
    const activeMenuClass = "menu selected";
return(
    <div className="menu-container">
        <div className="menus">
            <ul>
                <li>
                    < Link style={{ textDecoration: "none" }} to="/" onClick={() => handleMenuClick(0)}>
                        <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>Dashboard</p>
                    </Link>
                </li>
                <li>
                    <Link style={{textDecoration: "none"}} to="/markets" onClick={()=>handleMenuClick(1)}>
                        <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>Markets</p>
                    </Link>
                </li>
                <li>
                    < Link style={{ textDecoration: "none" }} to="/orders" onClick={() => handleMenuClick(2)}>
                        <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Orders</p>
                    </Link>
                </li>
                <li>
                    < Link style={{ textDecoration: "none" }} to="/holdings" onClick={() => handleMenuClick(3)}>
                        <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                            Holdings</p>
                    </Link>
                </li>
                <li>
                    < Link style={{ textDecoration: "none" }} to="/positions" onClick={() => handleMenuClick(4)}>
                        <p className={selectedMenu === 4 ? activeMenuClass : menuClass}
                        >Positions</p>
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/funds" onClick={() => handleMenuClick(5)}>
                        <p className={selectedMenu === 5 ? activeMenuClass : menuClass}
                        >Funds</p>
                    </Link>
                </li>
                <li>
                    <Link style={{ textDecoration: "none" }} to="/apps" onClick={() => handleMenuClick(6)}>
                        <p className={selectedMenu === 6 ? activeMenuClass : menuClass}
                        >Apps</p>
                    </Link>
                </li>
            </ul>

            <hr/>
            <div className="profile" onClick={handleProfileClick}>
                <div className="avatar">ZU</div>
                <p className="username">{username}</p>
            </div>
            {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                    <p onClick={handleLogout}>
                        Logout
                    </p>
                </div>
            )}
        </div>
    </div>
);
};

export default Menu;