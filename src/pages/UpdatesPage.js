import React, { useState, useEffect, useContext } from "react";
import useAuthGuard from "../hooks/useAuthGuard";
import ReactQuill from "react-quill";
import { FaRocket, FaClipboardList } from "react-icons/fa";
import { UserContext } from "../userContext";
import "react-quill/dist/quill.snow.css";

export default function UpdatesPage() {
  useAuthGuard();
  const { userInfo } = useContext(UserContext);

  const [authoredProjects, setAuthoredProjects] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [summary, setSummary] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [updates, setUpdates] = useState([]);
  const [tab, setTab] = useState("submit");

  useEffect(() => {
    if (!userInfo) return;

    fetch(`${process.env.REACT_APP_API_URL}/post`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const authored = data.filter((p) => p.author?._id === userInfo.id);
        const collab = data.filter((p) =>
          p.collaborators?.some((c) => c.user === userInfo.id)
        );
        setAuthoredProjects(authored);
        const combined = [...new Map([...authored, ...collab].map((p) => [p._id, p])).values()];
        setCollabProjects(combined);
      });
  }, [userInfo]);

  const handleSubmit = async () => {
    if (!selectedProject || !summary.trim()) {
      alert("Please fill in the update details.");
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/updates/submit`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: selectedProject, summary, githubLink }),
    });

    if (res.ok) {
      setSummary("");
      setGithubLink("");
      alert("Update submitted!");
    } else {
      alert("Failed to submit update.");
    }
  };

  const fetchUpdates = async (projectId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/updates/${projectId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setUpdates(data?.updates || []);
    setGithubRepo(data?.githubLink || "");
  };

  return (
    <main className="collaborations-page">
      <div className="collab-header">
        <h1>Project Updates</h1>
        <p>Post and view your ongoing progress with collaborators</p>
      </div>

      <div className="collab-tabs">
        <button
          className={`tab-btn ${tab === "submit" ? "active" : ""}`}
          onClick={() => setTab("submit")}
        >
          <FaRocket /> Submit Update
        </button>
        <button
          className={`tab-btn ${tab === "view" ? "active" : ""}`}
          onClick={() => setTab("view")}
        >
          <FaClipboardList /> View Updates
        </button>
      </div>

      <div className="collab-content">
        {tab === "submit" ? (
          <section className="collab-section collaborations-section">
            <div className="section-header">
              <h2>🚀 Submit Project Update</h2>
              <p>Select a project and add your update</p>
            </div>

            <div className="form-section">
              <div>
                <label htmlFor="projectSelect">Select Project</label>
                <select
                  id="projectSelect"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Select your project</option>
                  {authoredProjects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="summary">Update Summary</label>
                <ReactQuill value={summary} onChange={setSummary} />
              </div>

              <div>
                <label htmlFor="github">GitHub Link</label>
                <input
                  id="github"
                  type="url"
                  placeholder="https://github.com/yourrepo"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                />
              </div>

              <div className="text-center mt-4">
                <button className="collab-request-btn small-btn" onClick={handleSubmit}>
                  Submit Update
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="collab-section collaborations-section">
            <div className="section-header">
              <h2>📜 View Project Updates</h2>
              <p>Select a project to view all updates</p>
            </div>

            <div className="form-section">
              <select
                className="w-full border p-2 mb-4"
                value={selectedProject}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedProject(id);
                  fetchUpdates(id);
                }}
              >
                <option value="">Select a project</option>
                {collabProjects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              {updates.length === 0 ? (
                <div className="empty-state">
                  <FaClipboardList className="empty-icon" />
                  <p>No updates available for this project yet.</p>
                </div>
              ) : (
                <div className="update-wrapper">
                  <div className="github-badge-wrapper">
                    {githubRepo ? (
                      <a
                        href={githubRepo.startsWith("http") ? githubRepo : `https://${githubRepo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="github-badge"
                      >
                        🔗 View GitHub Repo
                      </a>
                    ) : (
                      <p className="github-fallback">No GitHub repo added for this project.</p>
                    )}
                  </div>
                  <ul className="update-list">
                    {updates.map((u, idx) => (
                      <li key={idx} className="update-item">
                        <div dangerouslySetInnerHTML={{ __html: u.summary }} />
                        <p className="update-time">
                          {new Date(u.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
