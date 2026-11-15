import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [loading, setLoading] = useState(false);

    const { email, password, username } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleError = (err) => {
        toast.error(err, {
            position: "top-right",
        });
    };

    const handleSuccess = (msg) => {
        toast.success(msg, {
            position: "top-right",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !username.trim() || !password) {
            handleError("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3002/signup",
                {
                    ...inputValue,
                },
                { withCredentials: true }
            );

            const { success, message } = response.data;
            if (success) {
                handleSuccess(message);
                setInputValue({
                    email: "",
                    password: "",
                    username: "",
                });
                const token = response.data.token;
                const redirectUrl = token ? `http://localhost:3001/?token=${encodeURIComponent(token)}` : "http://localhost:3001/";
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
            handleError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2>Signup Account</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            placeholder="Enter your username"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <span>Already have an account? <Link to={"/login"}>Login</Link></span>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Signup;