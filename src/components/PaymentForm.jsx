import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Modal } from "antd";
import {
  makePaymentApi,
  verifyOrderApi,
} from "../apis/service";
import Loader from "./common/Loader";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";
import { clearGuestCartItems, dispatchCartUpdated } from "../utils/cart";

const PaymentForm = () => {
  /* ================= ROUTER & STATE ================= */
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const state = location.state;

  /* ================= VALIDATION FLAG (NO RETURN YET) ================= */
  const isValidState =
    state &&
    state.orderId &&
    Array.isArray(state.selectedProducts) &&
    state.selectedProducts.length > 0;

  /* ================= ALL HOOKS (ALWAYS RUN) ================= */
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [showCodSuccess, setShowCodSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(
    state?.appliedCoupon || null,
  );
  const [discount, setDiscount] = useState(state?.discount || 0);
  const [couponError, setCouponError] = useState("");
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  /* ================= HARD RENDER GUARD ================= */
  if (!isValidState) {
    return <Navigate to="/" replace />;
  }

  /* ================= SAFE TO USE STATE ================= */
  const orderId = state.orderId;
  const selectedProducts = state.selectedProducts;

  /* ================= LOAD RAZORPAY ================= */
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  /* ================= PRICE CALCULATION ================= */
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const finalAmount = subtotal - discount;

  /* ================= COUPON REMOVE ================= */
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError("");
  };

  /* ================= PAY NOW ================= */
  const handlePayNow = async () => {
    if (!orderId) {
      toast.error("Order ID missing. Please retry checkout.");
      return;
    }

    try {
      setLoading(true);
      setVerifyingPayment(true);

      const payload = { paymentMethod };

      /* ===== COD ===== */
      if (paymentMethod === "COD") {
        const res = await makePaymentApi(orderId, payload);

        if (res?.success) {
          if (state?.isGuestCheckout) {
            clearGuestCartItems();
            dispatchCartUpdated({ guest: true });
          }
          setShowCodSuccess(true);
        } else {
          toast.error(res?.message || "COD failed");
        }

        setLoading(false);
        return;
      }

      /* ===== ONLINE ===== */
      const paymentRes = await makePaymentApi(orderId, payload);

      if (!paymentRes?.success) {
        toast.error("Payment initiation failed");
        setLoading(false);
        return;
      }

      const { razorpayOrder, payment } = paymentRes.data;

      console.log("paymentt", payment);

      const options = {
        key: "rzp_test_S2wY6Fal2173eK",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Jewellery",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async (response) => {
          try {
            const verifyRes = await verifyOrderApi({
              orderId: payment.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes?.success) {
              if (state?.isGuestCheckout) {
                clearGuestCartItems();
                dispatchCartUpdated({ guest: true });
              }
              navigate(
                `/payment-result?status=success&orderId=${payment.orderId}`,
                { replace: true },
              );
            } else {
              navigate(
                `/payment-result?status=failed&orderId=${payment.orderId}`,
                { replace: true },
              );
            }
          } catch {
            navigate(`/payment-result?status=failed&orderId=${payment.orderId}`);
          }
        },

        prefill: {
          name: state?.userName || "",
          contact: state?.phone || "",
          email: state?.email || "",
        },

        theme: { color: "#3399cc" },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      navigate("/payment-result?status=failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {verifyingPayment && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          <Loader text="Verifying your payment..." />
        </div>
      )}
      <div className="checkout-page pt-100 bg-index">
        <div className="container">
          <div className="checkout-container">
            {/* LEFT PANEL */}
            <div className="checkout-left-panel checkout-form-section">
              <h2 className="payment-section-title">Make Payment</h2>
              <p className="payment-subtitle">
                All transactions are secure and encrypted.
              </p>

              <div className="payment-option-card selected-payment">
                <div className="payment-radio-group mb-15">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="radio"
                      name="payment"
                      className="custom-radio-input"
                      defaultChecked
                      checked={paymentMethod === "ONLINE"}
                      onChange={() => setPaymentMethod("ONLINE")}
                    />
                    <p className="payment-method-label">
                      Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets)
                    </p>
                  </div>

                  <div className="payment-icons-row">
                    <span className="payment-icon-badge">UPI</span>
                    <span className="payment-icon-badge">VISA</span>
                    <span className="payment-icon-badge">MC</span>
                    <span
                      className="payment-icon-badge"
                      style={{ background: "#000", color: "#fff" }}
                    >
                      +18
                    </span>
                  </div>
                </div>

                <hr />

                <div className="redirect-info-box">
                  <div className="redirect-icon">
                    <img src="/images/credit-card.png" alt="Credit Card" />
                  </div>
                  <p className="redirect-text">
                    After clicking "Pay now", you will be redirected to
                    <br />
                    Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets)
                    <br />
                    to complete your purchase securely.
                  </p>
                </div>
              </div>

              <div className="payment-option-card">
                <div className="payment-radio-group">
                  <input
                    type="radio"
                    name="payment"
                    className="custom-radio-input"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <span className="payment-method-label">
                    Cash on Delivery (COD)
                  </span>
                </div>
              </div>

              <button
                className="pay-now-button"
                onClick={handlePayNow}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "COD"
                    ? "Place Order"
                    : `Pay ₹${finalAmount.toFixed(2)}`}
              </button>

              <div className="footer-links-section">
                <a href="" className="footer-policy-link">
                  Refund policy
                </a>
                <a href="" className="footer-policy-link">
                  Shipping
                </a>
                <a href="" className="footer-policy-link">
                  Privacy policy
                </a>
                <a href="" className="footer-policy-link">
                  Terms of service
                </a>
                <a href="" className="footer-policy-link">
                  Contact
                </a>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="order-summary-section">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((item) => (
                  <div
                    className="product-display-card"
                    key={item.productId || item._id}
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={
                          Array.isArray(item.imageUrl) &&
                          item.imageUrl.length > 0
                            ? `${image_url}/${item.imageUrl[0]}`
                            : item.imageUrl
                              ? `${image_url}/${item.imageUrl}`
                              : "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=200&h=200&fit=crop"
                        }
                        alt={item.name || "Product"}
                        className="product-thumbnail"
                      />

                      <span className="quantity-badge">
                        {item.quantity || 1}
                      </span>
                    </div>

                    <div className="product-info-wrapper">
                      <div className="product-title-text">
                        {item.name || "Product"}
                      </div>
                    </div>

                    <div className="product-price-text">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="product-display-card">
                  <div className="product-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1515688594390-b649af70d282?w=200&h=200&fit=crop"
                      alt="Product"
                      className="product-thumbnail"
                    />
                    <span className="quantity-badge">1</span>
                  </div>

                  <div className="product-info-wrapper">
                    <div className="product-title-text">
                      No products selected
                    </div>
                  </div>

                  <div className="product-price-text">₹0.00</div>
                </div>
              )}

              <div className="discount-code-section">
                {appliedCoupon ? (
                  <div className="applied-coupon-wrapper">
                    <div className="applied-coupon-info">
                      <span className="coupon-tag">
                        <i className="fa-solid fa-tag"></i> {appliedCoupon.code}
                      </span>
                      <span className="coupon-discount-text">
                        {appliedCoupon.type === "PERCENTAGE"
                          ? `${appliedCoupon.value}% off`
                          : `₹${appliedCoupon.value} off`}
                      </span>
                    </div>
                    <button
                      className="remove-coupon-btn"
                      onClick={handleRemoveCoupon}
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {couponError && (
                <div className="coupon-error-message">{couponError}</div>
              )}

              <div className="price-summary-row">
                <span className="price-row-label">Subtotal</span>
                <span className="price-row-value">₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="price-summary-row discount-row">
                  <span
                    className="price-row-label"
                    style={{ color: "#28a745" }}
                  >
                    Discount
                    {appliedCoupon && (
                      <span style={{ fontSize: "12px", marginLeft: "5px" }}>
                        ({appliedCoupon.code})
                      </span>
                    )}
                  </span>
                  <span
                    className="price-row-value"
                    style={{ color: "#28a745" }}
                  >
                    -₹{discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="price-summary-row">
                <span className="price-row-label">
                  Shipping{" "}
                  <span style={{ fontSize: "12px" }}>
                    <i className="fa-regular fa-circle-question"></i>
                  </span>
                </span>
                <span className="price-row-value" style={{ color: "#999" }}>
                  Free
                </span>
              </div>

              <div className="total-price-row">
                <span className="total-label-text">Total</span>
                <div style={{ textAlign: "right" }}>
                  <div className="total-amount-value">
                    <span className="currency-label">INR</span> ₹
                    {finalAmount.toFixed(2)}
                  </div>
                  {discount > 0 && (
                    <div
                      className="savings-info"
                      style={{ color: "#28a745", fontSize: "12px" }}
                    >
                      You save ₹{discount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="container">
          <div className="common-heading mt-80 pb-50 fadein">
            <div className="common-sec">
              <h2 className="title title-2">
                Shimmering <span>jewels</span>, like the stars above;
                <br />
                Hear them whisper tales of <span>endless</span> love.
              </h2>
            </div>
            <div className="logo-2">
              <img src="/images/Frame2.png" alt="Frame" />
            </div>
          </div>
        </div>
      </div>

      {showCodSuccess && (
        <Modal
          open={showCodSuccess}
          centered
          footer={null}
          width={480}
          maskClosable={false}
          closable
          onCancel={() => setShowCodSuccess(false)}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {/* Left Icon */}
            <div style={{ marginTop: 4 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#e6f4ea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2e7d32",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                ✓
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1f2937",
                  marginBottom: 6,
                }}
              >
                Order Placed Successfully
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                Your order has been placed with{" "}
                <span style={{ fontWeight: 500, color: "#111827" }}>
                  Cash on Delivery
                </span>
                .
                <br />
                We’ll contact you before delivery.
              </p>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                }}
              >
                <button
                  onClick={() => setShowCodSuccess(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => {
                    setShowCodSuccess(false);
                    navigate(`/payment-result?status=success&orderId=${orderId}`, {
                      replace: true,
                    });
                  }}
                  autoFocus
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#1d2532",
                    color: "#ffffff",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PaymentForm;
