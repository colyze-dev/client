import React, { useEffect, useState } from "react";
import useAuthGuard from "../hooks/useAuthGuard";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaProjectDiagram,
  FaUserFriends,
  FaCode,
} from "react-icons/fa";

export default function Collaborations() {
  useAuthGuard();

  const [requests, setRequests] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [authoredPosts, setAuthoredPosts] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/authored-requests`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error("Failed to fetch requests", err);
        setError("Failed to fetch requests");
      });

    fetch(`${process.env.REACT_APP_API_URL}/my-collaborations`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setMyPosts(data))
      .catch((err) => {
        console.error("Failed to fetch my collaborations", err);
        setError("Failed to fetch your projects");
      });

    fetch(`${process.env.REACT_APP_API_URL}/post`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        const userInfo = JSON.parse(atob(token?.split(".")[1] || "e30="));
        const authored = data.filter(
          (post) => post.author?._id === userInfo.id
        );
        setAuthoredPosts(authored);
      })
      .catch((err) => console.error("Error fetching authored posts:", err));
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/collaborate/accept`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      if (response.ok) {
        setRequests(requests.filter((req) => req._id !== requestId));
      }
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleReject = async (requestId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/collaborate/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId }),
    });
    if (response.ok) {
      setRequests(requests.filter((req) => req._id !== requestId));
    }
  } catch (err) {
    console.error("Failed to reject request:", err);
  }
};

  return (
    <main className="collaborations-page">
      <div className="collab-header">
        <h1>Collaborations Hub</h1>
        <p>Manage your project collaborations and requests</p>
      </div>

      <div className="collab-tabs">
        <button
          className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <FaUserFriends /> Collaboration Requests
          {requests.length > 0 && (
            <span className="notification-badge">{requests.length}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === "collaborations" ? "active" : ""}`}
          onClick={() => setActiveTab("collaborations")}
        >
          <FaProjectDiagram /> My Collaborations
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="collab-content">
        {activeTab === "requests" ? (
          <section className="collab-section requests-section">
            <div className="section-header">
              <h2>🤝 Collaboration Requests</h2>
              <p>Review and respond to collaboration requests</p>
            </div>

            <div className="requests-grid">
              {requests.length === 0 ? (
                <div className="empty-state">
                  <FaUserFriends className="empty-icon" />
                  <p>No pending collaboration requests</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div className="request-card" key={req._id}>
                    <div className="request-header">
                      <h3>{req.project}</h3>
                      <span className="request-by">from {req.username}</span>
                    </div>
                    <p className="request-summary">{req.summary}</p>
                    {req.roles?.length > 0 && (
                      <div className="request-roles">
                        {req.roles.map((role, index) => (
                          <span key={index} className="role-tag">
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="request-actions">
                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(req._id)}
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(req._id)}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <section className="collab-section collaborations-section">
            <div className="section-header">
              <h2>🛠️ My Collaborations</h2>
              <p>Track your active collaborations and projects</p>
            </div>

            <div className="collaborations-grid">
              {myPosts.length === 0 && authoredPosts.length === 0 ? (
                <div className="empty-state">
                  <FaProjectDiagram className="empty-icon" />
                  <p>You're not part of any collaborations yet</p>
                  <Link to="/ideas" className="browse-btn">
                    Browse Projects
                  </Link>
                </div>
              ) : (
                <>
                  {myPosts.map((collab) => (
                    <div className="collab-card" key={collab._id}>
                    <div
                      className="collab-status"
                      data-status={collab.project?.status?.toLowerCase?.() || ""}
                      >
                      {collab.project?.status || "Unknown"}
                    </div>
                    <h3>{collab.project?.title || "Untitled Project"}</h3>
                    <div className="collab-tags">
                      {collab.project?.tags?.map((tag, i) => (
                      <span key={i} className="tag">
                      {tag}
                      </span>
                    ))}
                  </div>
                <Link
                  to={`/post/${collab.project?._id}`}
                  className="view-project-btn"
                >
                  View Project
                </Link>
              </div>
            ))}


                  {authoredPosts.length > 0 && (
                    <div className="authored-projects">
                      <h3 className="authored-title">
                        <FaCode /> My Projects
                      </h3>
                      <div className="authored-grid">
                        {authoredPosts.map((post) => (
                          <Link
                            to={`/post/${post._id}`}
                            className="authored-card"
                            key={post._id}
                          >
                            <h4>{post.title}</h4>
                            <div
                              className="authored-status"
                              data-status={post.status?.toLowerCase?.() || ""}
                            >
                              {post.status}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
