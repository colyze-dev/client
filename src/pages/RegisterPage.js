import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        username,
        password,
        phoneNumber,
        linkedin,
        github,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.status === 400) {
      alert(`Registration failed: ${data.error}`);
    } else if (response.status !== 200) {
      alert("Registration failed due to an unexpected error.");
    } else {
      alert(
        "Registration successful! You will receive an email once your account is reviewed."
      );
      window.location.href = "/login";
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={register}>
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Official Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(ev) => setPhoneNumber(ev.target.value)}
          required
        />
        <input
          type="text"
          placeholder="LinkedIn URL"
          value={linkedin}
          onChange={(ev) => setLinkedin(ev.target.value)}
          required
        />

        <input
          type="text"
          placeholder="GitHub URL"
          value={github}
          onChange={(ev) => setGithub(ev.target.value)}
          required
        />

        <button type="submit">Register</button>
        <div className="auth-form-footer">
          <p className="auth-switch-text">Don’t have an account?</p>
          <Link className="auth-form-link" to="/login">
            Login →
          </Link>
        </div>
      </form>
    </div>
  );
}
