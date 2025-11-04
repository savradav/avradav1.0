import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Avradav Revival</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>For You</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
        <Link to="/upload" style={styles.link}>Upload</Link>
        <Link to="/testimony" style={styles.link}>Testimony</Link>
        <Link to="/signin" style={styles.link}>Sign In</Link>
        <Link to="/signup" style={styles.link}>Sign Up</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#222",
    color: "#fff",
  },
  logo: { margin: 0 },
  links: { display: "flex", gap: "15px" },
  link: { color: "#fff", textDecoration: "none" },
};

export default Navbar;
