import React, { useEffect, useState } from "react";
import useAdminGuard from "../hooks/useAdminGuard";
import { FaClipboardList } from "react-icons/fa";

export default function AdminUpdatesPage() {
  useAdminGuard();

  const [allProjects, setAllProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedUpdates, setSelectedUpdates] = useState([]);
  const [githubLink, setGithubLink] = useState("");
  const [selectedProjectData, setSelectedProjectData] = useState(null); // 🆕

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/updates`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch updates");
        return res.json();
      })
      .then(data => setAllProjects(data))
      .catch(err => {
        console.error("Failed to load admin updates:", err);
        setAllProjects([]);
      });
  }, []);

  const handleSelect = (projectId) => {
    setSelectedProjectId(projectId);
    const selected = allProjects.find(p => p._id === projectId);
    setSelectedUpdates(selected?.updates || []);
    setGithubLink(selected?.githubLink || "");
    setSelectedProjectData(selected);
  };

  // 🔽 Add this right below
  const handleExportCSV = () => {
  if (!selectedProjectData) return;

  const author = selectedProjectData.author?.username || "Unknown";
  const github = selectedProjectData.githubLink || "None";
  const collaborators = selectedProjectData.project?.collaborators?.map(c => c.username || c.email || "Unknown").join(", ") || "None";

  const headers = ["Author", "GitHub Link", "Collaborators", "Summary", "Created At"];
  const rows = selectedUpdates.map(u => [
    `"${author}"`,
    `"${github}"`,
    `"${collaborators}"`,
    `"${u.summary.replace(/"/g, '""')}"`,
    new Date(u.createdAt).toLocaleString()
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  const title = selectedProjectData.project?.title || "project-updates";
  link.setAttribute("download", `${title.replace(/\s+/g, "_")}_updates.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <main className="collaborations-page">
      <div className="collab-header">
        <h1>Admin: Project Updates</h1>
        <p>View updates submitted by users for any project</p>
      </div>

      <div className="collab-content">
        <section className="collab-section collaborations-section">
          <div className="section-header">
            <h2>📂 Project Selection</h2>
            <p>Select a project to view all associated updates</p>
          </div>

          <div className="form-section">
            <label htmlFor="adminProjectSelect">Select Project</label>
            <select
              id="adminProjectSelect"
              value={selectedProjectId}
              onChange={(e) => handleSelect(e.target.value)}
            >
              <option value="">-- Choose a project --</option>
              {allProjects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.project?.title || "Untitled"} (by {p.author?.username || "Unknown"})
                </option>
              ))}
            </select>
            
            {selectedUpdates.length > 0 && (
            <div className="text-center my-4">
              <button className="csv-export-btn" onClick={handleExportCSV}>
                📥 Export Updates as CSV
              </button>
            </div>
            )}


            {selectedProjectId && (
              <div className="github-badge-wrapper">
                {githubLink ? (
                  <a
                    href={githubLink.startsWith("http") ? githubLink : `https://${githubLink}`}
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
            )}

            {selectedUpdates.length === 0 ? (
              <div className="empty-state">
                <FaClipboardList className="empty-icon" />
                <p>No updates found for this project.</p>
              </div>
            ) : (
              <ul className="update-list">
                {selectedUpdates.map((update, idx) => (
                  <li key={idx} className="update-item">
                    <div
                      className="summary"
                      dangerouslySetInnerHTML={{ __html: update.summary }}
                    />
                    <p className="update-time">{new Date(update.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
