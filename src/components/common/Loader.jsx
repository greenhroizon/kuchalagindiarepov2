import React from "react";

const Loader = ({ fullScreen = true, size = "medium", text = "" }) => {
  const sizes = {
    small: { spinner: 30, border: 3 },
    medium: { spinner: 50, border: 4 },
    large: { spinner: 70, border: 5 },
  };

  const currentSize = sizes[size] || sizes.medium;

  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.inlineContainer;

  return (
    <div style={containerStyle}>
      <div style={styles.loaderWrapper}>
        {/* Outer ring */}
        <div
          style={{
            ...styles.outerRing,
            width: currentSize.spinner + 20,
            height: currentSize.spinner + 20,
            borderWidth: currentSize.border - 1,
          }}
        ></div>
        {/* Main spinner */}
        <div
          style={{
            ...styles.spinner,
            width: currentSize.spinner,
            height: currentSize.spinner,
            borderWidth: currentSize.border,
          }}
        ></div>
        {/* Inner dot */}
        <div
          style={{
            ...styles.innerDot,
            width: currentSize.spinner / 4,
            height: currentSize.spinner / 4,
          }}
        ></div>
      </div>
      {text && <p style={styles.loadingText}>{text}</p>}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spinReverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  fullScreenContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    animation: "fadeIn 0.3s ease-in-out",
  },
  inlineContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    width: "100%",
  },
  loaderWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  outerRing: {
    position: "absolute",
    border: "3px solid transparent",
    borderTopColor: "#17587c",
    borderBottomColor: "#17587c",
    borderRadius: "50%",
    animation: "spinReverse 1.5s linear infinite",
  },
  spinner: {
    border: "4px solid #f0f0f0",
    borderTop: "4px solid #17587c",
    borderRight: "4px solid #c9a86c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  innerDot: {
    position: "absolute",
    backgroundColor: "#c9a86c",
    borderRadius: "50%",
    animation: "pulse 1s ease-in-out infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
};

export default Loader;
