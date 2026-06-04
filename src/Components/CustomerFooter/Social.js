import React from "react";

const SocialLink = ({ href, icon: Icon, label, color = "inherit" }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        color: color,
        transition: "transform 0.2s ease",
      }}
      className="social-icon-link"
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Icon size={24} />
    </a>
  );
};

export default SocialLink;
