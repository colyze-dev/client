import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";
import Post from "../Post";
import FilterBar from "../components/FilterBar";
import useAuthGuard from "../hooks/useAuthGuard";
import { FaSearch, FaSort, FaFilter, FaTimes } from "react-icons/fa";

export default function IdeasPage() {
  useAuthGuard();
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStage, setSelectedStage] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo === undefined) return; 
    if (!userInfo) navigate("/login");
  }, [userInfo, navigate]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/post`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleSort = (e) => setSortBy(e.target.value);
  const clearFilters = () => {
    setSelectedTag("All");
    setSelectedStage("All");
    setSearchQuery("");
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchesTag = selectedTag === "All" || post.tags?.includes(selectedTag);
      const matchesStage = selectedStage === "All" || post.stage === selectedStage;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesStage && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

  if (userInfo === undefined) {
    // Still checking authentication
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="ideas-page">
      <div className="ideas-header">
        <h1 className="ideas-title">Explore Project Ideas</h1>
        <p className="ideas-subtitle">
          Discover and collaborate on innovative projects
        </p>
      </div>

      <div className="ideas-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="controls-right">
          <select value={sortBy} onChange={handleSort} className="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>

          <button
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-section">
            <h3>Project Stage</h3>
            <div className="stage-buttons">
              {["All", "Ideation", "Planning", "Development", "Testing", "Deployment"].map((stage) => (
                <button
                  key={stage}
                  className={`stage-btn ${selectedStage === stage ? "active" : ""}`}
                  onClick={() => setSelectedStage(stage)}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Tags</h3>
            <FilterBar selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading projects...</p>
        </div>
      ) : (
        <>
          <div className="results-info">
            <p>{filteredPosts.length} projects found</p>
            {(selectedTag !== "All" || selectedStage !== "All" || searchQuery) && (
              <button className="clear-filters-mobile" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          <div className="post-grid">
            {filteredPosts.length ? (
              filteredPosts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  isLoggedIn={!!userInfo}
                  disablePopup
                />
              ))
            ) : (
              <div className="empty-state">
                <FaSearch className="empty-icon" />
                <p>No projects found matching your criteria</p>
                <button className="browse-all" onClick={clearFilters}>
                  Browse All Projects
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
