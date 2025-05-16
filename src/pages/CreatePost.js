import { useEffect, useState } from "react";
import useAuthGuard from "../hooks/useAuthGuard";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FaTags,
  FaUsers,
  FaProjectDiagram,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function CreatePost() {
  useAuthGuard();
  const navigate = useNavigate();

  // const [authChecked, setAuthChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [selectedCover, setSelectedCover] = useState(null);
  const [tags, setTags] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teamSize, setTeamSize] = useState("");
  const [stage, setStage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   const token = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("token="))
  //     ?.split("=")[1];

  //   if (!token) {
  //     navigate("/login");
  //   } else {
  //     setAuthChecked(true);
  //   }
  // }, [navigate]);


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
  const coverImages = Array.from(
    { length: 12 },
    (_, i) => `/assets/${i + 1}.png`
  );

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Project title is required";
    if (!summary.trim()) newErrors.summary = "Project summary is required";
    if (!content.trim()) newErrors.content = "Project description is required";
    if (!selectedCover) newErrors.cover = "Please select a cover image";
    if (tags.length === 0) newErrors.tags = "Please select at least one tag";
    if (roles.length === 0) newErrors.roles = "Please select at least one role";
    if (!teamSize || teamSize < 1) {
      newErrors.teamSize = "Please enter a valid team size";
    } else if (roles.length > parseInt(teamSize)) {
      newErrors.roles = `You can only select up to ${teamSize} roles based on your team size`;
    }
    if (!stage) newErrors.stage = "Please select a project stage";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      title,
      summary,
      content,
      tags,
      positions: roles,
      teamSize,
      status: stage,
      cover: selectedCover,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/ideas");
      } else {
        const err = await response.json();
        alert(err.message || "Post creation failed");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    if (errors.tags) setErrors((prev) => ({ ...prev, tags: null }));
  };

  const handleRoleToggle = (role) => {
    const teamSizeNum = parseInt(teamSize) || 0;
    if (roles.includes(role)) {
      setRoles((prev) => prev.filter((r) => r !== role));
    } else if (roles.length < teamSizeNum) {
      setRoles((prev) => [...prev, role]);
    } else {
      alert(
        `You can only select up to ${teamSizeNum} roles based on your team size.`
      );
    }

    if (errors.roles) setErrors((prev) => ({ ...prev, roles: null }));
  };

  const handleCoverSelect = (coverPath) => {
    setSelectedCover(coverPath);
    if (errors.cover) setErrors((prev) => ({ ...prev, cover: null }));
  };

  const handleTeamSizeChange = (ev) => {
    const newTeamSize = ev.target.value;
    setTeamSize(newTeamSize);

    const teamSizeNum = parseInt(newTeamSize) || 0;
    if (roles.length > teamSizeNum) {
      setRoles(roles.slice(0, teamSizeNum));
    }

    if (errors.teamSize) setErrors((prev) => ({ ...prev, teamSize: null }));
  };

  return (
    <div className="create-post-section">
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="create-post-header">
          <h1 className="create-post-title">Create a Project</h1>
          <div className="create-post-info">
            <FaInfoCircle />
            <span>All fields marked with * are required</span>
          </div>
        </div>

        <div className="form-sections">
          {/* Title + Summary */}
          <div className="form-section">
            <h2 className="section-title">Basic Information *</h2>
            <div className="form-group floating-label">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder=" "
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label className="label-text">Project Title</label>
              </div>
            </div>

            <div className="form-group floating-label">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder=" "
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
                <label className="label-text">Summary</label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2 className="section-title">Project Description *</h2>
            <ReactQuill
              value={content}
              onChange={(val) => setContent(val)}
              className="custom-quill"
            />
            {errors.content && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.content}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="form-section">
            <h2 className="section-title">Cover Image *</h2>
            <div className="cover-grid">
              {coverImages.map((path, i) => (
                <div
                  key={i}
                  className={`cover-option ${
                    selectedCover === path ? "selected" : ""
                  }`}
                  onClick={() => handleCoverSelect(path)}
                >
                  <img src={path} alt={`Cover ${i + 1}`} />
                </div>
              ))}
            </div>
            {errors.cover && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.cover}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-section">
            <h2 className="section-title">Project Tags *</h2>
            <div className="filter-bar">
              {availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
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

          {/* Team Info */}
          <div className="form-section">
            <h2 className="section-title">Team Requirements *</h2>
            <label>Team Size</label>
            <input
              type="number"
              min="1"
              value={teamSize}
              onChange={handleTeamSizeChange}
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
                  className={`role-btn ${roles.includes(role) ? "active" : ""}`}
                  onClick={() => handleRoleToggle(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            {errors.roles && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.roles}
              </div>
            )}
          </div>

          {/* Stage */}
          <div className="form-section">
            <h2 className="section-title">Project Stage *</h2>
            <div className="stage-buttons">
              {stages.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`stage-btn ${stage === s ? "active" : ""}`}
                  onClick={() => setStage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.stage && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.stage}
              </div>
            )}
          </div>
        </div>

        <button
          className={`create-btn ${isSubmitting ? "submitting" : ""}`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loader"></span>
              Creating Project...
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </form>
    </div>
  );
}
