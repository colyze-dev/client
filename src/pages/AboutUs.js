import { Link } from "react-router-dom";

export default function AboutUsPage() {
  return (
    <div className="about-us-container page-transition fade-in">
      {/* Hero Section */}
      <section className="about-hero">
        {/* <img
          src="/colyze-icon-white.png"
          alt="Colyze Logo"
          className="about-hero-logo"
        /> */}
        <h1 className="about-title">About Colyze</h1>
        <p className="about-intro">
          <srong>Colyze</srong> is a collaboration-first platform connecting idea-driven innovators and skilled builders to bring real-world tech projects to life—no hiring, just building.
        </p>
      </section>

      {/* Story Section */}
      <section className="about-section">
        <h2 className="about-section-title">Our Story</h2>
        <div className="about-story-timeline">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <p>
              Born in 2024 from a shared frustration to find like-minded innovators and collaborators; Colyze was imagined as a place where anyone could plug in, find projects, contribute instantly, and grow together. That future is now.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section">
        <h2 className="about-section-title">Meet the Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="/team/derick.png" alt="Derick" className="team-avatar" />
            <div>
              <h3>Derick Johnson</h3>
              {/* <p>Co-Founder & CEO</p> */}
            </div>
          </div>
          <div className="team-card">
            <img src="/team/prateek.png" alt="Prateek" className="team-avatar" />
            <div>
              <h3>Prateek Kumar</h3>
              {/* <p>Co-Founder & CFO</p> */}
            </div>
          </div>
        </div>  
        <p className="team-desc">
          We’re a small team of developers, designers, and dreamers building the space we wish existed. Passionate, nerdy, and proud of it.
        </p>
      </section>

      {/* Values Section */}
      <section className="about-section">
        <h2 className="about-section-title">Our Values</h2>
        <div className="about-values">
          <div className="value-card value-card-hover">
            <h3>🛠 Skill Over Status</h3>
            <p>We believe talent isn’t proven by titles or years—it's proven by initiative and craft. Everyone deserves a shot.</p>
          </div>
          <div className="value-card value-card-hover">
            <h3>🔒 Authenticated Anonymity</h3>
            <p>Safety meets credibility. Share your work and connect without compromising identity, verified by Colyze’s own trust system.</p>
          </div>
          <div className="value-card value-card-hover">
            <h3>👥 Collaboration</h3>
            <p>We believe the best work is built together. Collaboration is about mutual growth, not transactional value.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-section about-cta-section">
        <h2 className="about-section-title">Get in Touch</h2>
        <p>
          Want to learn more or collaborate? <Link className="about-cta-link" to="/contact">Contact us</Link> - we’d love to hear from you!
        </p>
      </section>
    </div>
  );
}
