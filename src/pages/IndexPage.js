import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../userContext";
import Post from "../Post";
import {
  FaRocket,
  FaUsers,
  FaLightbulb,
  FaChartLine,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeCollaborations: 0,
    successStories: 0,
    communityMembers: 0,
  });
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`)
      .then((response) => response.json())
      .then((data) => {
        const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      const latestSix = sorted.slice(0, 6);

        setPosts(latestSix);
        setStats({
          totalProjects: data.length,
          activeCollaborations: data.filter(
            (post) => post.status === "In Progress"
          ).length,
          successStories: data.filter((post) => post.status === "Completed")
            .length,
          communityMembers: Math.floor(data.length * 2.5),
        });
      });
  }, []);

  const projectsPerSlide = 3;
  const totalSlides = Math.ceil(posts.length / projectsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleViewAll = () => {
    if (!userInfo) {
      navigate("/login", {
        state: { from: "ideas" },
        replace: true,
      });
    } else {
      navigate("/ideas");
    }
  };

  const handleCollaborate = () => {
    if (!userInfo) {
      navigate("/login", {
        state: { from: "collaboration" },
        replace: true,
      });
    } else {
      navigate("/collaboration");
    }
  };

  const getCurrentProjects = () => {
    const start = currentSlide * projectsPerSlide;
    return posts.slice(start, start + projectsPerSlide);
  };

  return (
    <div className="index-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Welcome to Colyze</span>
          </h1>
          <p className="hero-subtitle">Catalyzing Collaborations, Fueling Innovation</p>
          <p className="hero-description">
            Colyze bridges the gap between ideas and execution. Whether you're a visionary with a 
            project or a skilled developer seeking purpose, our community connects you 
            to build, learn, and grow—together.
          </p>
          <div className="hero-cta">
            {userInfo ? (
              <button
                onClick={handleCollaborate}
                className="hero-button primary"
              >
                Start Collaborating <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleCollaborate}
                className="hero-button primary"
              >
                Start Collaborating <FaArrowRight />
              </button>
            )}
            <a href="/about-us" className="hero-button secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.totalProjects}+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.communityMembers}+</span>
            <span className="stat-label">Members</span>
          </div>
          {/* <div className="stat-item">
            <span className="stat-number">{stats.successStories}+</span>
            <span className="stat-label">Success Stories</span>
          </div> */}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="featured-projects">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p>Discover innovative ideas and join exciting collaborations</p>
        </div>
        <div className="featured-projects-carousel">
          <button
            className="carousel-nav prev"
            onClick={prevSlide}
            aria-label="Previous projects"
          >
            <FaChevronLeft />
          </button>
          <div className="carousel-container">
            {getCurrentProjects().length > 0 ? (
              getCurrentProjects().map((post) => (
                <Post key={post._id} {...post} isLoggedIn={!!userInfo} />
              ))
            ) : (
              <p className="no-projects">No projects available.</p>
            )}
          </div>
          <button
            className="carousel-nav next"
            onClick={nextSlide}
            aria-label="Next projects"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="section-footer">
          <button onClick={handleViewAll} className="view-all-button">
            View All Projects <FaArrowRight />
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Innovate your ideas in some simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Have an Idea</h3>
            <p>
              Share your innovative idea and define your project requirements
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Find Collaborators</h3>
            <p>Connect with skilled professionals who share your vision</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Build Together</h3>
            <p>Collaborate, innovate, and bring your project to life</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our community of innovators and creators</p>
          <div className="cta-buttons">
            {userInfo ? (
              <a href="/create" className="cta-button primary">
                Create Project <FaArrowRight />
              </a>
            ) : (
              <a href="/register" className="cta-button primary">
                Get Started <FaArrowRight />
              </a>
            )}
            <a href="/about-us" className="cta-button secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
