import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { useToast } from "../common/Toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // 👁 password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[A-Z]/, "One uppercase required")
        .matches(/[0-9]/, "One number required")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          password: values.password,
          confirmPassword: values.confirmPassword,
        };

        const response = await resetPassword(payload);

        if (response) {
          toast.success("Password reset successfully");
          sessionStorage.removeItem("verifyToken");
          sessionStorage.removeItem("email");
          sessionStorage.removeItem("isForgotPassword");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Reset password error", error);
        toast.error(error?.response?.data?.message || "Failed to reset password");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      {loading && <Loader text="Resetting password..." />}
      <div className="contact-page pt-100">
        <div className="container">
          

          <div className="contact-flex" style={{ marginBottom: "40px" }}>
            <div className="image-section">
              <img src="/images/contact.png" alt="Contact" />
            </div>

            <div className="form-section">
              <div className="form-content-wrapper">
                <div className="form-header">
                  <h2>Reset Password</h2>
                  <p>Set a new password for your account</p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  {/* New Password */}
                  <div className="form-group" style={{ position: "relative" }}>
                    <label>
                      New Password <span className="required">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="underline-input"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "38px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                    {formik.touched.password && formik.errors.password && (
                      <small className="error-text">{formik.errors.password}</small>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group" style={{ position: "relative" }}>
                    <label>
                      Confirm Password <span className="required">*</span>
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="underline-input"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "38px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </span>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <small className="error-text">
                          {formik.errors.confirmPassword}
                        </small>
                      )}
                  </div>

                  <div style={{ marginTop: "44px" }}>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={formik.isSubmitting || loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-whatsapp"
                      onClick={() => navigate("/signin")}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
