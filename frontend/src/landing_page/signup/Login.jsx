import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const { email, password } = inputValue;

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

        if (!email.trim() || !password) {
            handleError("All fields are required");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3002/login",
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
            console.error("Login error:", error);
            const errorMsg = error.response?.data?.message || "Invalid email or password";
            handleError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2>Login Account</h2>
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <span>
                        Don't have an account? <Link to={"/signup"}>Signup</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Login;