import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const LogoutModal = ({ open, onConfirm, onCancel }) => {
  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Logout"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      centered
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: "#faad14" }} />
          Confirm Logout
        </span>
      }
    >
      <p>Are you sure you want to logout?</p>
      <p style={{ color: "#888", fontSize: "13px" }}>
        You will need to sign in again to access your account.
      </p>
    </Modal>
  );
};

export default LogoutModal;
