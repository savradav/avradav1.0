import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../component/firebase";

export default function AdminDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, Admin</h1>
      <p>Here you’ll control all user and post actions later.</p>
      <button
        onClick={() => {
          signOut(auth);
          window.location.href = "/";
        }}
      >
        Log out
      </button>
    </div>
  );
}
