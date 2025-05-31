import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  // Scroll logic
  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 60) {
        setHideNav(true); // scroll down
      } else {
        setHideNav(false); // scroll up
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setUserInfo(data);
      })
      .catch(() => {});
  }, [setUserInfo]);

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    window.location.href = "/";
  };

  const toggleMobileNav = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileNav = () => setMobileMenuOpen(false);

  const { username, name, isAdmin } = userInfo || {};

  return (
    <header className={hideNav ? "nav-hidden" : ""}>
      <div className="nav-container">
        <Link to="/" className="logo-link" onClick={closeMobileNav}>
          <img src="/colyze-icon-white.png" alt="Colyze" className="logo" />
        </Link>

        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileNav}
          aria-label="Toggle Navigation"
        >
          <span className="hamburger"></span>
        </button>

        <nav className={mobileMenuOpen ? "nav-open" : ""}>
          <Link to="/about-us" onClick={closeMobileNav}>About Us</Link>
          <Link to="/contact" onClick={closeMobileNav}>Contact</Link>

          {username ? (
            <>
              <Link to="/ideas" onClick={closeMobileNav}>Ideas</Link>
              <Link to="/create" onClick={closeMobileNav}>Create</Link>
              <Link to="/collaboration" onClick={closeMobileNav}>Collaborations</Link>
              {isAdmin && <Link to="/admin" onClick={closeMobileNav}>Admin</Link>}

              <div className="dropdown">
                <button className="dropdown-btn" aria-haspopup="true">
                  👤 {name} <span aria-hidden="true">▼</span>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile" onClick={closeMobileNav}>📝 Profile</Link>
                  <Link to="/updates" onClick={closeMobileNav}>📢 My Updates</Link>
                  {isAdmin && (
                    <Link to="/admin/updates" onClick={closeMobileNav}>🛠 Admin Updates</Link>
                  )}
                  <a onClick={logout}>🚪 Logout</a>
                </div>
              </div>
            </>
          ) : (
            <div className="dropdown">
              <button className="dropdown-btn header-btn cta" aria-haspopup="true">
                🔑 Login/Register <span aria-hidden="true">▼</span>
              </button>
              <div className="dropdown-content">
                <Link to="/login" onClick={closeMobileNav}>🔐 Login</Link>
                <Link to="/register" onClick={closeMobileNav}>✍️ Register</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
