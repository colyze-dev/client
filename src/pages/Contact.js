import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    const res = await fetch(`${process.env.REACT_APP_CONTACT_FORM}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setLoading(false);
    if (res.ok) {
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="input-group">
          <label htmlFor="name">
            <span role="img" aria-label="User">👤</span> Name
          </label>
          <input 
            type="text" 
            name="name" 
            id="name"
            value={formData.name} 
            onChange={handleInputChange} 
            required 
            placeholder="Your name"
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">
            <span role="img" aria-label="Email">📧</span> Email
          </label>
          <input 
            type="email" 
            name="email" 
            id="email"
            value={formData.email} 
            onChange={handleInputChange} 
            required 
            placeholder="you@example.com"
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <label htmlFor="message">
            <span role="img" aria-label="Message">💬</span> Message
          </label>
          <textarea 
            name="message" 
            id="message"
            value={formData.message} 
            onChange={handleInputChange} 
            required 
            placeholder="Type your message here..."
            rows={5}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner" aria-label="Sending..."></span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
      {status && (
        <p className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>
          {status}
        </p>
      )}
    </div>
  );
}
