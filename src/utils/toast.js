// Standalone toast utility for use outside React components

const TOAST_TYPES = {
  success: {
    icon: "✓",
    bgColor: "#10b981",
  },
  error: {
    icon: "✕",
    bgColor: "#ef4444",
  },
  warning: {
    icon: "⚠",
    bgColor: "#f59e0b",
  },
  info: {
    icon: "ℹ",
    bgColor: "#3b82f6",
  },
};

// Create toast container if it doesn't exist
const getToastContainer = () => {
  let container = document.getElementById("standalone-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "standalone-toast-container";
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  return container;
};

// Create and show a toast
const showToast = (type, message, duration = 3000) => {
  const container = getToastContainer();
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;

  // Create toast element
  const toast = document.createElement("div");
  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-left: 4px solid ${config.bgColor};
    min-width: 300px;
    animation: toastSlideIn 0.3s ease-out forwards;
  `;

  toast.innerHTML = `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: ${config.bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    ">
      <span style="color: #fff; font-size: 16px; font-weight: bold;">${config.icon}</span>
    </div>
    <div style="flex: 1;">
      <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.4;">${message}</p>
    </div>
    <button style="
      background: none;
      border: none;
      font-size: 20px;
      color: #999;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      margin-left: 8px;
    ">×</button>
  `;

  // Add animation styles if not already added
  if (!document.getElementById("toast-animation-styles")) {
    const style = document.createElement("style");
    style.id = "toast-animation-styles";
    style.textContent = `
      @keyframes toastSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Close button handler
  const closeBtn = toast.querySelector("button");
  closeBtn.onclick = () => removeToast(toast);

  // Add to container
  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => removeToast(toast), duration);
};

const removeToast = (toast) => {
  toast.style.animation = "toastSlideOut 0.3s ease-in forwards";
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
};

// Export toast methods
const toast = {
  success: (message, duration) => showToast("success", message, duration),
  error: (message, duration) => showToast("error", message, duration),
  warning: (message, duration) => showToast("warning", message, duration),
  info: (message, duration) => showToast("info", message, duration),
};

export default toast;
