import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForYou from "./pages/ForYou";
import Profile from "./pages/Profile";
import Testimony from "./pages/Testimony";
import UploadPost from "./pages/UploadPost";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import ChatPage from "./pages/chatpage";
import PrivateRoute from "./components/PrivateRoute";
import PageNotFound from "./pages/PageNotFound";
import Terms from "./pages/Terms";
<Route path="/terms" element={<Terms />} />
export const ThemeContext = createContext();

import "./index.css";

export default function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.className = darkMode ? "dark-theme" : "light-theme";
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <Router>
                <div>
                    <button
                        onClick={toggleTheme}
                        style={{
                            position: "fixed",
                            top: 10,
                            right: 10,
                            zIndex: 1000,
                            padding: "5px 10px",
                            borderRadius: "5px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none"
                        }}
                    >
                        {darkMode ? "Light" : "Dark"} Mode
                    </button>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<ForYou />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/upload" element={
                            <PrivateRoute>
                                <UploadPost />
                            </PrivateRoute>
                        } />
                        <Route path="/testimony" element={<Testimony />} />
                        <Route path="/user/:id" element={<UserProfile />} />
                        <Route path="/settings" element={
                            <PrivateRoute>
                                <Settings />
                            </PrivateRoute>
                        } />
                        <Route path="/chat" element={
                            <PrivateRoute>
                                <ChatPage />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
            </Router>
        </ThemeContext.Provider>
    );
}
