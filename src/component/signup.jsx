import React from "react";

function SignUp() {
  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form style={styles.form}>
        <input type="text" placeholder="Full Name" style={styles.input} />
        <input type="email" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <input type="date" style={styles.input} />
        <button style={styles.button}>Create Account</button>
      </form>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "50px" },
  form: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { margin: "10px", padding: "10px", width: "250px" },
  button: { padding: "10px 20px", cursor: "pointer" },
};

export default SignUp;
