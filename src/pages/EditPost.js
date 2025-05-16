import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";
import Editor from "../Editor";
import {
  FaSave,
  FaTags,
  FaUsers,
  FaCode,
  FaChartLine,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function EditPost() {
  useAuthGuard();

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [tags, setTags] = useState([]);
  const [positions, setPositions] = useState([]);
  const [teamSize, setTeamSize] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    "AI",
    "Cybersecurity",
    "Web Development",
    "ML",
    "Blockchain",
    "GameDev",
  ];
  const availableRoles = [
    "Frontend Dev",
    "Backend Dev",
    "Security Tester",
    "ML Developer",
    "UI/UX Designer",
  ];
  const stages = ["Ideation", "Recruiting", "In Progress", "Completed"];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`)
      .then((res) => res.json())
      .then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
        setTags(postInfo.tags || []);
        setPositions(postInfo.positions || []);
        setTeamSize(postInfo.teamSize || "");
        setStatus(postInfo.status || "");
        setIsLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Project title is required";
    if (!summary.trim()) newErrors.summary = "Project summary is required";
    if (!content.trim()) newErrors.content = "Project description is required";
    if (tags.length === 0) newErrors.tags = "Please select at least one tag";
    if (positions.length === 0)
      newErrors.positions = "Please select at least one role";
    if (!teamSize || teamSize < 1)
      newErrors.teamSize = "Please enter a valid team size";
    else if (positions.length > parseInt(teamSize))
      newErrors.positions = `You can only select up to ${teamSize} roles based on your team size`;
    if (!status) newErrors.status = "Please select a project stage";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePost = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      id,
      title,
      summary,
      content,
      tags,
      positions,
      teamSize,
      status,
      // If cover editing is needed later: include "cover" here
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Update failed.");
      }
    } catch (error) {
      alert("An error occurred while updating the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) return <Navigate to={`/post/${id}`} />;
  if (isLoading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );

  const handleTagToggle = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    if (errors.tags) setErrors((prev) => ({ ...prev, tags: null }));
  };

  const handleRoleToggle = (role) => {
    const teamSizeNum = parseInt(teamSize) || 0;
    if (positions.includes(role)) {
      setPositions((prev) => prev.filter((r) => r !== role));
    } else if (positions.length < teamSizeNum) {
      setPositions((prev) => [...prev, role]);
    } else {
      alert(
        `You can only select up to ${teamSizeNum} roles based on your team size.`
      );
    }
    if (errors.positions) setErrors((prev) => ({ ...prev, positions: null }));
  };

  const handleTeamSizeChange = (ev) => {
    const newSize = ev.target.value;
    setTeamSize(newSize);

    const num = parseInt(newSize) || 0;
    if (positions.length > num) {
      setPositions(positions.slice(0, num));
    }

    if (errors.teamSize) setErrors((prev) => ({ ...prev, teamSize: null }));
  };

  return (
    <div className="edit-post-container">
      <div className="edit-post-form">
        <div className="edit-post-header">
          <h1>Edit Project</h1>
          <div className="edit-post-info">
            <FaInfoCircle />
            <span>All fields marked with * are required</span>
          </div>
        </div>

        <form onSubmit={updatePost}>
          <div className="form-section">
            <h2 className="section-title">
              <FaCode /> Basic Information *
            </h2>

            <div className="form-group floating-label">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder=" "
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: null }));
                  }}
                />
                <label className="label-text">Project Title</label>
              </div>
              {errors.title && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.title}
                </div>
              )}
            </div>

            <div className="form-group floating-label">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder=" "
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    if (errors.summary)
                      setErrors((prev) => ({ ...prev, summary: null }));
                  }}
                />
                <label className="label-text">Summary</label>
              </div>
              {errors.summary && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.summary}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <FaChartLine /> Project Description *
            </h2>
            <div className="editor-container">
              <Editor
                value={content}
                onChange={(value) => {
                  setContent(value);
                  if (errors.content)
                    setErrors((prev) => ({ ...prev, content: null }));
                }}
              />
              {errors.content && (
                <div className="error-message">
                  <FaExclamationCircle /> {errors.content}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <FaTags /> Project Tags *
            </h2>
            <div className={`filter-bar ${errors.tags ? "error" : ""}`}>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${tags.includes(tag) ? "active" : ""}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            {errors.tags && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.tags}
              </div>
            )}
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <FaUsers /> Team Requirements *
            </h2>
            <label>Team Size</label>
            <input
              type="number"
              min="1"
              value={teamSize}
              onChange={handleTeamSizeChange}
              className={`team-size-input ${
                errors.teamSize ? "error" : ""
              }`}
              placeholder="Enter team size"
            />
            {errors.teamSize && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.teamSize}
              </div>
            )}

            <label>Looking For</label>
            <div className="role-buttons">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-btn ${
                    positions.includes(role) ? "active" : ""
                  }`}
                  onClick={() => handleRoleToggle(role)}
                  disabled={
                    !teamSize || positions.length >= parseInt(teamSize)
                  }
                >
                  {role}
                </button>
              ))}
            </div>
            {errors.positions && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.positions}
              </div>
            )}
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <FaChartLine /> Project Stage *
            </h2>
            <div className={`stage-buttons ${errors.status ? "error" : ""}`}>
              {stages.map((stageOpt) => (
                <button
                  type="button"
                  key={stageOpt}
                  className={`stage-btn ${
                    status === stageOpt ? "active" : ""
                  }`}
                  onClick={() => {
                    setStatus(stageOpt);
                    if (errors.status)
                      setErrors((prev) => ({ ...prev, status: null }));
                  }}
                >
                  {stageOpt}
                </button>
              ))}
            </div>
            {errors.status && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.status}
              </div>
            )}
          </div>

          <button
            className={`update-btn ${isSubmitting ? "submitting" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loader"></span>
                Updating Project...
              </>
            ) : (
              <>
                <FaSave /> Update Project
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
