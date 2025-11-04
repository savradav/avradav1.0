import React from "react";

function SignIn() {
  return (
    <div style={styles.container}>
      <h2>Sign In</h2>
      <form style={styles.form}>
        <input type="email" placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button style={styles.button}>Sign In</button>
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

export default SignIn;
