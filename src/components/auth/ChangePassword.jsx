import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changePasswordApi } from "../../apis/service";
import { useToast } from "../common/Toast";
import { Spin } from "antd";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // 👁 password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),

      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const payload = {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };

        const response = await changePasswordApi(payload);
        console.log("Change password response:", response);

        toast.success("Password updated successfully");
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message || "Failed to change password",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <div className="signin-page-1">
        <form className="signin-form-page" onSubmit={formik.handleSubmit}>
          <div className="signin-head">
            <h2>Change Password</h2>
          </div>

          <div className="detail-grid-1">
            <div className="details-flex-2">
              {/* Old Password */}
              <div className="form-group" style={{ position: "relative" }}>
                <label className="lab">
                  <i className="fa-solid fa-lock t-2"></i>&nbsp;&nbsp;Old
                  Password
                </label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter old password"
                  className="detail-btn"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "38px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  {showOldPassword ? "🙈" : "👁️"}
                </span>
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <small className="erro-text text-color">
                    {formik.errors.oldPassword}
                  </small>
                )}
              </div>

              {/* New Password */}
              <div className="form-group" style={{ position: "relative" }}>
                <label className="lab">
                  <i className="fa-solid fa-lock t-2"></i>&nbsp;&nbsp;Create New
                  Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  className="detail-btn"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "38px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </span>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <small className="erro-text text-color">
                    {formik.errors.newPassword}
                  </small>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group" style={{ position: "relative" }}>
                <label className="lab">
                  <i className="fa-solid fa-lock t-2"></i>&nbsp;&nbsp;Confirm
                  Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="detail-btn"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    <small className="erro-text text-color">
                      {formik.errors.confirmPassword}
                    </small>
                  )}
              </div>
            </div>
          </div>

          <div className="box-center-pro">
            <a
              href="#"
              className={`update-btn ${loading ? "disabled" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (!loading) {
                  formik.handleSubmit();
                }
              }}
              aria-disabled={loading}
            >
              {loading ? (
                <>
                  <Spin size="small" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
