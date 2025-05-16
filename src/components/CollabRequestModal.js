import React, { useEffect, useState } from "react";
import { FaTimes, FaUser, FaInfoCircle, FaCheck } from "react-icons/fa";

export default function CollabRequestModal({
  username,
  roles,
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const handleCheckboxChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      checkboxes: prev.checkboxes.includes(role)
        ? prev.checkboxes.filter((r) => r !== role)
        : [...prev.checkboxes, role],
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="collab-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>Request Collaboration</h2>
          <p className="modal-subtitle">
            Tell us about yourself and your interest in this project
          </p>
        </div>

        <form onSubmit={onSubmit} className="collab-form">
          <div className="form-group">
            <label>
              <FaUser /> Your Username
            </label>
            <input
              type="text"
              value={username}
              disabled
              className="disabled-input"
              placeholder="Your username"
            />
          </div>

          <div className="form-group">
            <label>
              <FaInfoCircle /> Why do you want to collaborate?
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, summary: e.target.value }))
              }
              placeholder="Tell us about your interest in this project and what you can bring to the team..."
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Select your preferred role(s)</label>
            <div className="roles-grid">
              {roles.map((role) => (
                <label
                  key={role}
                  className={`role-option ${
                    formData.checkboxes.includes(role) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.checkboxes.includes(role)}
                    onChange={() => handleCheckboxChange(role)}
                  />
                  <span className="role-name">{role}</span>
                  {formData.checkboxes.includes(role) && (
                    <FaCheck className="check-icon" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
