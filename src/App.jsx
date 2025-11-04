import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForYou from "./pages/ForYou";
import Profile from "./pages/Profile";
import UploadPost from "./pages/UploadPost";
import Testimony from "./pages/Testimony";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<ForYou />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<UploadPost />} />
          <Route path="/testimony" element={<Testimony />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
