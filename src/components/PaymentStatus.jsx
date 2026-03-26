import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { Card, Result, Button } from "antd";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Push a dummy state so back button triggers popstate
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  /* ================= HARD GUARD ================= */
  if (!status) {
    return <Navigate to="/" replace />;
  }

  /* ================= CONFIG (DERIVED STATE) ================= */
  const configMap = {
    success: {
      status: "success",
      title: "Payment Successful 🎉",
      subTitle: "Thank you! Your payment was completed successfully.",
      icon: <FaCheckCircle size={72} color="#52c41a" />,
      buttonText: "Go to Home",
      buttonAction: () => navigate("/"),
    },
    failed: {
      status: "error",
      title: "Payment Failed ❌",
      subTitle: "Payment failed. Please try again.",
      icon: <FaTimesCircle size={72} color="#ff4d4f" />,
      buttonText: "Try Again",
      buttonAction: () => navigate("/"),
    },
    cancelled: {
      status: "warning",
      title: "Payment Cancelled ⚠️",
      subTitle: "You cancelled the payment process.",
      icon: <FaExclamationTriangle size={72} color="#faad14" />,
      buttonText: "Back to Home",
      buttonAction: () => navigate("/"),
    },
  };

  const config = configMap[status] || {
    status: "info",
    title: "Payment Status Unknown",
    subTitle: "Unable to determine payment status.",
    icon: <FaExclamationTriangle size={72} color="#999" />,
    buttonText: "Go Home",
    buttonAction: () => navigate("/"),
  };

  /* ================= UI ================= */
  return (
    <div style={styles.wrapper} className="bg-index">
      <Card style={styles.card}>
        <Result
          status={config.status}
          icon={config.icon}
          title={config.title}
          subTitle={
            <>
              <div>{config.subTitle}</div>
              {orderId && (
                <div style={styles.orderId}>
                  <strong>Order ID:</strong> {orderId}
                </div>
              )}
            </>
          }
          extra={
            <Button type="primary" size="large" onClick={config.buttonAction}>
              {config.buttonText}
            </Button>
          }
        />
      </Card>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fa",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  orderId: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
  },
};

export default PaymentStatus;
