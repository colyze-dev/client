import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  async function login(ev) {
    ev.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData?.error || "Login failed");
        return;
      }

      // Refetch profile after successful login
      const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
        credentials: "include",
      });

      if (!profileRes.ok) {
        alert("Failed to load user profile");
        return;
      }

      const profileData = await profileRes.json();
      setUserInfo(profileData);

      if (profileData.isAdmin) {
        navigate("/admin");
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

        navigate(redirectPath);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An unexpected error occurred.");
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
