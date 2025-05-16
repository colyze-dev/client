import { format } from "date-fns";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
  disablePopup = false,
  isLoggedIn = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const plainContent = content
    ? content.replace(/<[^>]+>/g, "")
    : "No description available.";

  const handleProjectClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // If not logged in, navigate to login page with state
      navigate("/login", {
        state: { from: "project", projectId: _id },
      });
    } else {
      // If logged in, navigate directly to project
      navigate(`/post/${_id}`);
    }
  };

  return (
    <>
      <div className="post-card">
        <img
          src={
              cover?.startsWith("/assets/")
              ? cover
              : `${process.env.REACT_APP_API_URL}/${cover}`
              }
          alt="Project Cover"
        />

        <div className="post-card-content">
          {!disablePopup ? (
            <>
              <h2 onClick={handleProjectClick} className="clickable-title">
                {title}
              </h2>
            </>
          ) : (
            <Link
              to={`/post/${_id}`}
              onClick={handleProjectClick}
              style={{ textDecoration: "none", color: "#58a6ff" }}
            >
              <h2>{title}</h2>
            </Link>
          )}

          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
          <p className="summary">{summary}</p>
          <p className="preview">{plainContent.substring(0, 150)}...</p>
        </div>
      </div>

      {/* Popup only if not disabled */}
      {!disablePopup && showModal && (
        <div className="post-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <h2>{title}</h2>
            <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
            <p>
              <strong>{summary}</strong>
            </p>
            <hr />
            <div className="modal-content">{plainContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
