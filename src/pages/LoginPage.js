import React, { useState, useContext } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { UserContext } from "../userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const location = useLocation();

  async function login(ev) {
  ev.preventDefault();

  const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (response.ok) {
    // 🔁 NEW: Refetch /profile to get complete user info
    const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    });

    if (!profileRes.ok) {
      alert("Failed to load user profile");
      return;
    }

    const profileData = await profileRes.json();
    setUserInfo(profileData);

    if (profileData.isAdmin) {
      window.location.href = "/admin";
    } else {
      let redirectPath = "/ideas";

      if (location.state?.from === "collaboration") {
        redirectPath = "/collaboration";
      } else if (
        location.state?.from === "project" &&
        location.state?.projectId
      ) {
        redirectPath = `/post/${location.state.projectId}`;
      }

      window.location.href = redirectPath;
    }
  } else {
    alert("Login failed");
  }
}


  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={login}>
        <h1>Login</h1>

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

        <button type="submit">Login</button>
        <div className="auth-switch-container">
          <p className="auth-switch-text">Don't have an account?</p>
          <Link className="auth-switch-link" to="/register">
            Register now →
          </Link>
        </div>
      </form>
    </div>
  );
}
