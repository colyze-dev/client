import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../userContext";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();
  const { username } = useParams();
  const { setUserInfo: setGlobalUserInfo } = useContext(UserContext);

  useEffect(() => {
    const endpoint = username
      ? `${process.env.REACT_APP_API_URL}/profile/${username}`
      : `${process.env.REACT_APP_API_URL}/profile`;

    fetch(endpoint, { credentials: "include" })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) setUserInfo(data);
      })
      .catch((error) => console.error("Error fetching profile:", error));

    fetch(`${process.env.REACT_APP_API_URL}/recent-activity`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRecentActivity(data || []))
      .catch(() => setRecentActivity([]));
  }, [username, navigate]);

  if (!userInfo) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        Loading profile...
      </div>
    );
  }

  const avatarUrl = userInfo.avatar || null;
  const initials = getInitials(userInfo.name);
  const isAdmin = userInfo.isAdmin;

  const isLimitedView =
    !userInfo.phoneNumber && !userInfo.joinedDate && !userInfo.bio;

  return (
    <main className="profile-sections">
      {/* Profile Overview */}
      <section className="profile-section profile-overview">
        <div className="profile-avatar-block">
          <div className="profile-avatar-outer">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-fallback">{initials}</div>
            )}
            <div className="profile-avatar-glow"></div>
          </div>
          <div className="profile-name-block">
            <h1>
              {userInfo.name}
              {userInfo.verified && (
                <span className="profile-verified" title="Verified">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="11"
                      fill="#58a6ff"
                      opacity="0.8"
                    />
                    <path
                      d="M8 12.5l2.5 2.5 5-5"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              {isAdmin && <span className="profile-badge">Admin</span>}
            </h1>
            <span className="profile-username">@{userInfo.username}</span>
          </div>
        </div>
      </section>

      {/* Limited View for Collaborators */}
      {isLimitedView ? (
        <section className="profile-section contact-card">
          <h2>👥 Collaborator Contact Card</h2>
          <ul className="contact-details">
            <li>
              <strong>Email:</strong> {userInfo.email}
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              {userInfo.linkedin ? (
                <a
                  href={userInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userInfo.linkedin}
                </a>
              ) : (
                "Not linked"
              )}
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              {userInfo.github ? (
                <a
                  href={userInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userInfo.github}
                </a>
              ) : (
                "Not linked"
              )}
            </li>
          </ul>
        </section>
      ) : (
        <>
          {/* Full Bio Section */}
          <section className="profile-section profile-bio">
            <h2>About</h2>
            <p>{userInfo.bio || "No bio provided yet. Tell us about yourself!"}</p>
          </section>

          {/* Contact & Social */}
          <section className="profile-section profile-contact">
            <h2>Contact & Social</h2>
            <div className="profile-contact-grid">
              <div>
                <span className="profile-field-icon">📧</span>
                <span>{userInfo.email}</span>
              </div>
              <div>
                <span className="profile-field-icon">📱</span>
                <span>
                  {userInfo.phoneNumber || (
                    <span className="profile-field-missing">Not set</span>
                  )}
                </span>
              </div>
              <div>
                <span className="profile-field-icon">🔗</span>
                {userInfo.linkedin ? (
                  <a
                    href={userInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-social-link"
                  >
                    LinkedIn
                  </a>
                ) : (
                  <span className="profile-field-missing">Not linked</span>
                )}
              </div>
              <div>
                <span className="profile-field-icon">🐙</span>
                {userInfo.github ? (
                  <a
                    href={userInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-social-link"
                  >
                    GitHub
                  </a>
                ) : (
                  <span className="profile-field-missing">Not linked</span>
                )}
              </div>
              <div>
                <span className="profile-field-icon">🌐</span>
                {userInfo.website ? (
                  <a
                    href={userInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-social-link"
                  >
                    Website
                  </a>
                ) : (
                  <span className="profile-field-missing">Not set</span>
                )}
              </div>
            </div>
          </section>

          {/* Activity */}
          <section className="profile-section profile-activity">
            <h2>Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="profile-field-missing">No recent activity.</p>
            ) : (
              <ul className="profile-activity-list">
                {recentActivity.map((item, idx) => (
                  <li key={idx}>
                    <span className="profile-activity-icon">📝</span>
                    <span>{item.text}</span>
                    <span className="profile-activity-date">
                      {new Date(item.date).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Settings – only for logged-in user */}
          {!username && (
            <section className="profile-section profile-actions">
              <h2>Account</h2>
              <div className="profile-actions-grid">
                <button
                  className="profile-action-btn"
                  onClick={() => alert("Edit profile coming soon!")}
                >
                  ✏️ Edit Profile
                </button>
                <button
                  className="profile-action-btn"
                  onClick={() => alert("Change password coming soon!")}
                >
                  🔒 Change Password
                </button>
                <button
                  className="profile-action-btn"
                  onClick={async () => {
                    try {
                      await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                        credentials: "include",
                        method: "POST",
                      });

                      setUserInfo(null);
                      setGlobalUserInfo(null);
                      document.cookie =
                        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      window.location.href = "/";
                    } catch (err) {
                      console.error("Logout failed:", err);
                    }
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
