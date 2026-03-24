import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger | primary
  icon,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        {icon && (
          <div className={`confirm-icon ${type}`}>
            <i className={icon}></i>
          </div>
        )}

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onClose}>
            {cancelText}
          </button>

          <button
            className={`btn-confirm ${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
