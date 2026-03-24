import React from "react";

const NotFound = () => {
  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      background:
        "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
    },
    content: {
      textAlign: "center",
      color: "#ffffff",
      padding: "40px",
      borderRadius: "16px",
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      maxWidth: "420px",
      width: "90%",
      MarginTop: "60px",
    },
    errorCode: {
      fontSize: "120px",
      fontWeight: 800,
      margin: 0,
      letterSpacing: "-4px",
    },
    title: {
      fontSize: "28px",
      margin: "10px 0",
      fontWeight: 600,
    },
    text: {
      fontSize: "16px",
      opacity: 0.9,
      margin: "16px 0 32px",
      lineHeight: 1.6,
    },
    button: {
      padding: "12px 28px",
      fontSize: "14px",
      fontWeight: 600,
      borderRadius: "30px",
      border: "none",
      cursor: "pointer",
      background: "#ffffff",
      color: "#203a43",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.text}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <button
          style={styles.button}
          onClick={() => (window.location.href = "/")}
          onMouseOver={(e) => {
            e.target.style.background = "#d20303";
            e.target.style.color = "#ffffff";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#ffffff";
            e.target.style.color = "#203a43";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
