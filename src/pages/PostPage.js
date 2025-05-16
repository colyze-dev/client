import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../userContext";
import useAuthGuard from "../hooks/useAuthGuard";
import CollabRequestModal from "../components/CollabRequestModal";
import {
  FaUsers,
  FaCode,
  FaTags,
  FaCalendarAlt,
  FaEdit,
  FaHandshake,
  FaInfoCircle,
} from "react-icons/fa";

export default function PostPage() {
  useAuthGuard();

  const [postInfo, setPostInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    summary: "",
    checkboxes: [],
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.status === 401) {
        navigate("/login");
      } else {
        response.json().then((postInfo) => {
          setPostInfo(postInfo);
          setFormData((prev) => ({
            ...prev,
            username: userInfo?.username || "",
          }));
        });
      }
    });
  }, [id, navigate, userInfo?.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      projectId: postInfo._id,
      authorId: postInfo.author._id,
      requesterId: userInfo._id,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/collaborate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1]
          }`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Collaboration request submitted!");
        setShowModal(false);
        setFormData({
          username: userInfo.username,
          summary: "",
          checkboxes: [],
        });
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit collaboration request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (!postInfo || !postInfo.author || !userInfo) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  const canViewAuthor =
    userInfo?._id === postInfo?.author?._id ||
    postInfo?.collaborators?.some((c) => c?.user?._id === userInfo?._id);

  return (
    <div className="post-page">
      <div className="post-header">
        <div className="post-title-section">
          <h1>{postInfo.title}</h1>
          <div className="post-meta">
            <span className="post-date">
              <FaCalendarAlt />{" "}
              {postInfo.createdAt
                ? formatISO9075(new Date(postInfo.createdAt))
                : "Unknown date"}
            </span>
            <span className="post-author">
              <FaUsers /> by{" "}
              {canViewAuthor ? (
                <Link to={`/profile/${postInfo.author.username}`}>
                  @{postInfo.author.username}
                </Link>
              ) : (
                `@${postInfo.author.username}`
              )}
            </span>
          </div>
        </div>

        {userInfo._id === postInfo.author._id && (
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <FaEdit /> Edit Project
          </Link>
        )}
      </div>

      <div className="post-cover">
        <img src={postInfo.cover} alt="Project Cover" />
      </div>

      <div className="post-details">
        <div className="post-summary">
          <h2>Project Overview</h2>
          <p>{postInfo.summary}</p>
        </div>

        <div className="post-tags">
          <h3>
            <FaTags /> Technologies & Skills
          </h3>
          <div className="tags-container">
            {postInfo.tags?.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="post-team">
          <h3>
            <FaUsers /> Team Requirements
          </h3>
          <div className="team-info">
            <div className="team-size">
              <span className="label">Team Size:</span>
              <span className="value">{postInfo.teamSize} members</span>
            </div>
            <div className="team-roles">
              <span className="label">Looking For:</span>
              <div className="roles-list">
                {postInfo.positions?.map((role, index) => (
                  <span key={index} className="role">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="collaborators-section">
            <h3>
              <FaUsers /> Collaborators
            </h3>
            {postInfo.collaborators?.length === 0 ? (
              <p>No collaborators yet.</p>
            ) : (
              <ul>
                {postInfo.collaborators?.map((collab, i) => (
                  <li key={i}>
                    @{collab?.user?.username} – {collab?.role}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="post-description">
          <h3>
            <FaCode /> Detailed Description
          </h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
        </div>
      </div>

      {userInfo?._id !== postInfo?.author?._id && (() => {
        const isAlreadyCollaborator = postInfo.collaborators?.some(
          (c) => c?.user?._id === userInfo?._id
        );
        const isAlreadyRequested = postInfo.requests?.some?.(
          (r) => r?.requesterId?._id === userInfo?._id
        );
        const isTeamFull =
          (postInfo.collaborators?.length || 0) >= postInfo.teamSize;

        const isDisabled =
          isAlreadyCollaborator || isAlreadyRequested || isTeamFull;

        let message = "Interested in collaborating on this project?";
        if (isTeamFull) message = "This team is already full.";
        else if (isAlreadyRequested) message = "You’ve already sent a request.";
        else if (isAlreadyCollaborator) message = "You're already part of this team.";

        return (
          <div className="collab-section">
            <div className="collab-info">
              <FaInfoCircle />
              <p>{message}</p>
            </div>
            <button
              className="collab-request-btn"
              onClick={() => setShowModal(true)}
              disabled={isDisabled}
            >
              <FaHandshake /> Request Collaboration
            </button>
          </div>
        );
      })()}

      {showModal && (
        <CollabRequestModal
          username={userInfo.username}
          roles={postInfo.positions}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
