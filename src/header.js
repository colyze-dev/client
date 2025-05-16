import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  const logout = async () => {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    });

    setUserInfo(null);           // Clear context
    window.location.href = "/";  // Redirect to home
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  const username = userInfo?.username;
  const name = userInfo?.name;
  const isAdmin = userInfo?.isAdmin;

  const toggleMobileNav = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileNav = () => setMobileMenuOpen(false);

  return (
    <header>
      <div className="nav-container">
        <Link to="/" className="logo-link">
          <img
            src="/colyze-icon-white.png"
            alt="Colyze Logo"
            className="logo"
          />
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileNav}
          aria-label="Toggle Navigation"
        >
          <span className="hamburger"></span>
        </button>

        <nav className={mobileMenuOpen ? "nav-open" : ""}>
          <Link to="/about-us" onClick={closeMobileNav}>
            About Us
          </Link>
          <Link to="/contact" onClick={closeMobileNav}>
            Contact
          </Link>

          {username ? (
            <>
              <Link to="/ideas" onClick={closeMobileNav}>
                Ideas
              </Link>
              <Link to="/create" onClick={closeMobileNav}>
                Create Project
              </Link>
              <Link to="/collaboration" onClick={closeMobileNav}>
                Collaborations
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={closeMobileNav}>
                  Admin
                </Link>
              )}
              <div className="dropdown">
                <button className="dropdown-btn" aria-haspopup="true">
                  👤 {name} <span aria-hidden>▼</span>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile" onClick={closeMobileNav}>
                    📝 Profile
                  </Link>
                  <Link to="/updates" onClick={closeMobileNav}>
                    📢 My Updates
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/updates" onClick={closeMobileNav}>
                    🛠 Admin Updates
                    </Link>
                  )}
                  <a onClick={logout}>🚪 Logout</a>
                </div>
              </div>
            </>
          ) : (
            <div className="dropdown">
              <button
                className="dropdown-btn header-btn cta"
                aria-haspopup="true"
              >
                🔑 Login/Register <span aria-hidden>▼</span>
              </button>
              <div className="dropdown-content">
                <Link to="/login" onClick={closeMobileNav}>
                  🔐 Login
                </Link>
                <Link to="/register" onClick={closeMobileNav}>
                  ✍️ Register
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
