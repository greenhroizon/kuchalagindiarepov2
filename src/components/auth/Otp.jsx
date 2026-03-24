import React, { useEffect, useRef, useState } from "react";
import { forgotPasswordApi, verifyResetOtpApi, resendSignupOtpApi } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { useToast } from "../common/Toast";
import axios from "axios";
const OTP_LENGTH = 5;
const RESEND_TIME = 170; // seconds (02:50)

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const toast = useToast();

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const min = String(Math.floor(timer / 60)).padStart(2, "0");
    const sec = String(timer % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  /* ---------------- OTP Input Handling ---------------- */
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasteData) return;

    const newOtp = pasteData.split("");
    while (newOtp.length < OTP_LENGTH) newOtp.push("");
    setOtp(newOtp);

    const lastIndex = Math.min(pasteData.length - 1, OTP_LENGTH - 1);
    inputRefs.current[lastIndex].focus();
  };

  /* ---------------- Verify OTP ---------------- */
  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== OTP_LENGTH) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      const email = sessionStorage.getItem("email");
      const isForgotPassword = sessionStorage.getItem("isForgotPassword") === "true";
      if (isForgotPassword) {
        const response = await verifyResetOtpApi({ email, otp: enteredOtp });
        if (response) {
          toast.success("OTP verified successfully");
          sessionStorage.setItem("token", response?.data);
          navigate("/reset-password");
        }
      } else {
          const token1 = sessionStorage.getItem("token");
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/verify-otp`,
            { otp: enteredOtp },
            {
              headers: {
                authorization: `Bearer ${token1}`,
              },
            }
          );
          if (response) {
            toast.success("OTP verified successfully");
            navigate("/signin");
          }
        }
      }
      catch (error) {
      console.error("OTP verification failed", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Resend OTP ---------------- */
  const handleResend = async () => {
    if (timer > 0) return;

    try {
      setIsResending(true);
      const email = sessionStorage.getItem("email");
      const otpSentTo = sessionStorage.getItem("otpSentTo");

      if (!email) {
        toast.error("Email not found. Please sign up again.");
        return;
      }

      // Signup: resend OTP to phone via Twilio; Forgot password: resend to email
      const response =
        otpSentTo === "phone"
          ? await resendSignupOtpApi()
          : await forgotPasswordApi({ email });

      if (response?.data?.token) {
        sessionStorage.setItem("token", response.data.token);
      }
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(RESEND_TIME);
      inputRefs.current[0].focus();
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error("Resend OTP failed", error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <div className="contact-page pt-100 bg-index" style={{ paddingBottom: "120px" }}>
        <div className="container">
        

          <div className="contact-flex" style={{ marginBottom: "40px" }}>
            <div className="image-section">
              <img src="/images/Horse jacket .JPG" alt="Contact" />
            </div>

            <div className="form-section">
              <div className="form-content-wrapper">
                <div className="form-header">
                  <h2>Verify your Number</h2>
                  <p>
                    An OTP has been sent to{" "}
                    <span style={{ color: "#b01616" }}>
                      {sessionStorage.getItem("otpSentTo") === "phone"
                        ? "your mobile number"
                        : sessionStorage.getItem("email") || "your email"}
                    </span>
                  </p>
                </div>

                <div>
                  <div
                    className="form-group form-row-5 pt-50"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={digit}
                          ref={(el) => (inputRefs.current[index] = el)}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="tc pt-50">
                    Don&apos;t receive OTP?{" "}
                    {timer > 0 ? (
                      <span>Resend in {formatTime()} s</span>
                    ) : (
                      <a
                        href="#"
                        onClick={handleResend}
                        style={{ pointerEvents: isResending ? "none" : "auto" }}
                      >
                        Resend
                      </a>
                    )}
                  </p>

                  <div style={{ marginTop: "30px" }}>
                    <button
                      className="btn btn-submit"
                      onClick={handleVerify}
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Otp;
