import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import useAdminGuard from "../hooks/useAdminGuard";
import {
  FaUsers,
  FaProjectDiagram,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheck,
  FaTimes as FaReject,
  FaTrash,
  FaEdit,
  FaEye,
  FaClock,
  FaUser,
  FaInfoCircle,
  FaEnvelope,
  FaUserShield,
  FaCalendarAlt,
  FaTag,
  FaUsers as FaTeam,
} from "react-icons/fa";

export default function AdminPage() {
  const showPopup = useAdminGuard();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingApprovals: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectEditModal, setShowProjectEditModal] = useState(false);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) return;

    fetch(`${process.env.REACT_APP_API_URL}/admin/data`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setPosts(data.posts);
        setStats({
          totalUsers: data.users.length,
          totalProjects: data.posts.length,
          activeProjects: data.posts.filter((p) => p.status === "In Progress")
            .length,
          pendingApprovals: data.users.filter((u) => u.status === "pending")
            .length,
        });
      });

    fetch(`${process.env.REACT_APP_API_URL}/admin/pending-users`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setPendingUsers);
  }, [userInfo]);

  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`${process.env.REACT_APP_API_URL}/admin/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setUsers(users.filter((u) => u._id !== userId));
          setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        }
      });
    }
  };

  const deletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`${process.env.REACT_APP_API_URL}/admin/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setPosts(posts.filter((p) => p._id !== postId));
          setStats((prev) => ({
            ...prev,
            totalProjects: prev.totalProjects - 1,
          }));
        }
      });
    }
  };

  const approveUser = (userId) => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/approve/${userId}`, {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setPendingUsers(pendingUsers.filter((u) => u._id !== userId));
        setStats((prev) => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
        }));
      }
    });
  };

  const rejectUser = (userId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    fetch(`${process.env.REACT_APP_API_URL}/admin/reject/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reason }),
    }).then((res) => {
      if (res.ok) {
        setPendingUsers(pendingUsers.filter((u) => u._id !== userId));
        setStats((prev) => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
        }));
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (post) =>
      (filterStatus === "all" || post.status === filterStatus) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUserView = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setShowUserEditModal(true);
  };

  const handleProjectView = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleProjectEdit = (project) => {
    setSelectedProject(project);
    setShowProjectEditModal(true);
  };

  const updateUser = (updatedUser) => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/user/${updatedUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(users.map((u) => (u._id === data._id ? data : u)));
        setShowUserEditModal(false);
      });
  };

  const updateProject = (updatedProject) => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/post/${updatedProject._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedProject),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(posts.map((p) => (p._id === data._id ? data : p)));
        setShowProjectEditModal(false);
      });
  };

  return (
    <div className="admin-page">
      {showPopup && (
        <div className="popup-notice">
          🚫 Access Denied: You are not an admin.
        </div>
      )}

      {!showPopup && (
        <div className="admin-panel">
          <h1 className="admin-title">Admin Dashboard</h1>

          {/* Quick Stats */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-info">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaProjectDiagram className="stat-icon" />
              <div className="stat-info">
                <h3>Total Projects</h3>
                <p>{stats.totalProjects}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <div className="stat-info">
                <h3>Active Projects</h3>
                <p>{stats.activeProjects}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaCheck className="stat-icon" />
              <div className="stat-info">
                <h3>Pending Approvals</h3>
                <p>{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`tab-btn ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Approvals
              {pendingUsers.length > 0 && (
                <span className="notification-badge">
                  {pendingUsers.length}
                </span>
              )}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="admin-controls">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {activeTab === "projects" && (
              <div className="filter-controls">
                <FaFilter className="filter-icon" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>
            )}
          </div>

          {/* Content Sections */}
          <div className="admin-content">
            {activeTab === "overview" && (
              <div className="overview-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  {posts.slice(0, 5).map((post) => (
                    <div
                      key={post._id}
                      className="activity-item"
                      onClick={() => {
                        setSelectedActivity(post);
                        setShowActivityModal(true);
                      }}
                    >
                      <span className="activity-icon">📝</span>
                      <div className="activity-details">
                        <p>New project created: {post.title}</p>
                        <small>by {post.author?.username}</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Modal */}
                {showActivityModal && selectedActivity && (
                  <div
                    className="modal-overlay"
                    onClick={() => setShowActivityModal(false)}
                  >
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="modal-close"
                        onClick={() => setShowActivityModal(false)}
                      >
                        <FaTimes />
                      </button>
                      <h3>Activity Details</h3>
                      <div className="activity-details-grid">
                        <div className="detail-item">
                          <FaInfoCircle className="detail-icon" />
                          <div>
                            <label>Activity Type</label>
                            <p>Project Creation</p>
                          </div>
                        </div>
                        <div className="detail-item">
                          <FaClock className="detail-icon" />
                          <div>
                            <label>Timestamp</label>
                            <p>
                              {new Date(
                                selectedActivity.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="detail-item">
                          <FaUser className="detail-icon" />
                          <div>
                            <label>Created By</label>
                            <p>{selectedActivity.author?.username}</p>
                          </div>
                        </div>
                        <div className="detail-item">
                          <FaProjectDiagram className="detail-icon" />
                          <div>
                            <label>Project Title</label>
                            <p>{selectedActivity.title}</p>
                          </div>
                        </div>
                        <div className="detail-item full-width">
                          <FaInfoCircle className="detail-icon" />
                          <div>
                            <label>Project Summary</label>
                            <p>{selectedActivity.summary}</p>
                          </div>
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button
                          className="view-project-btn"
                          onClick={() => {
                            setShowActivityModal(false);
                            navigate(`/post/${selectedActivity._id}`);
                          }}
                        >
                          <FaEye /> View Project
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="users-section">
                <h2>User Management</h2>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`status-badge ${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view"
                                title="View Profile"
                                onClick={() => handleUserView(user)}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn edit"
                                title="Edit User"
                                onClick={() => handleUserEdit(user)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete"
                                title="Delete User"
                                onClick={() => deleteUser(user._id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="projects-section">
                <h2>Project Management</h2>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post) => (
                        <tr key={post._id}>
                          <td>{post.title}</td>
                          <td>{post.author?.username}</td>
                          <td>
                            <span
                              className={`status-badge ${post.status.toLowerCase()}`}
                            >
                              {post.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view"
                                title="View Project"
                                onClick={() => handleProjectView(post)}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn edit"
                                title="Edit Project"
                                onClick={() => handleProjectEdit(post)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete"
                                title="Delete Project"
                                onClick={() => deletePost(post._id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "pending" && (
              <div className="pending-section">
                <h2>Pending Approvals</h2>
                {pendingUsers.length === 0 ? (
                  <p className="no-data">No pending approvals</p>
                ) : (
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Username</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingUsers.map((user) => (
                          <tr
                            key={user._id}
                            onClick={() => handleUserView(user)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn approve"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  approveUser(user._id);
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="action-btn reject"
                                onClick={(e) => {
                                e.stopPropagation();
                                rejectUser(user._id);
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User View Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowUserModal(false)}
            >
              <FaTimes />
            </button>
            <h3>User Details</h3>
            <div className="activity-details-grid">
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div>
                  <label>Username</label>
                  <p>{selectedUser.username}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaUserShield className="detail-icon" />
                <div>
                  <label>Status</label>
                  <p>{selectedUser.status}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <label>Joined</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="view-project-btn"
                onClick={() => {
                  setShowUserModal(false);
                  handleUserEdit(selectedUser);
                }}
              >
                <FaEdit /> Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showUserEditModal && selectedUser && (
        <div
          className="modal-overlay"
          onClick={() => setShowUserEditModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowUserEditModal(false)}
            >
              <FaTimes />
            </button>
            <h3>Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUser(selectedUser);
              }}
            >
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="view-project-btn">
                  <FaCheck /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project View Modal */}
      {showProjectModal && selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setShowProjectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowProjectModal(false)}
            >
              <FaTimes />
            </button>
            <h3>Project Details</h3>
            <div className="activity-details-grid">
              <div className="detail-item">
                <FaProjectDiagram className="detail-icon" />
                <div>
                  <label>Title</label>
                  <p>{selectedProject.title}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div>
                  <label>Author</label>
                  <p>{selectedProject.author?.username}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaTag className="detail-icon" />
                <div>
                  <label>Status</label>
                  <p>{selectedProject.status}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaTeam className="detail-icon" />
                <div>
                  <label>Team Size</label>
                  <p>{selectedProject.teamSize}</p>
                </div>
              </div>
              <div className="detail-item full-width">
                <FaInfoCircle className="detail-icon" />
                <div>
                  <label>Summary</label>
                  <p>{selectedProject.summary}</p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="view-project-btn"
                onClick={() => {
                  setShowProjectModal(false);
                  handleProjectEdit(selectedProject);
                }}
              >
                <FaEdit /> Edit Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Edit Modal */}
      {showProjectEditModal && selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setShowProjectEditModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowProjectEditModal(false)}
            >
              <FaTimes />
            </button>
            <h3>Edit Project</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProject(selectedProject);
              }}
            >
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={selectedProject.title}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedProject.status}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Team Size</label>
                <input
                  type="number"
                  value={selectedProject.teamSize}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      teamSize: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={selectedProject.summary}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      summary: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="view-project-btn">
                  <FaCheck /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={() => setShowUserModal(false)}
        >
          ✖
        </button>
        <h3>Pending User Details</h3>
        <div className="activity-details-grid">
        <div className="detail-item">
          <label>Name</label>
          <p>{selectedUser.name}</p>
        </div>
        <div className="detail-item">
          <label>Username</label>
          <p>{selectedUser.username}</p>
        </div>
        <div className="detail-item">
          <label>Email</label>
          <p>{selectedUser.email}</p>
        </div>
        <div className="detail-item">
          <label>Phone</label>
          <p>{selectedUser.phoneNumber || "Not provided"}</p>
        </div>
        <div className="detail-item">
          <label>LinkedIn</label>
          <p>
            {selectedUser.linkedin ? (
              <a
                href={selectedUser.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {selectedUser.linkedin}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
        </div>
        <div className="detail-item">
          <label>Status</label>
          <p>{selectedUser.status}</p>
        </div>
        <div className="detail-item">
          <label>Joined</label>
          <p>
            {selectedUser.createdAt
              ? new Date(selectedUser.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
