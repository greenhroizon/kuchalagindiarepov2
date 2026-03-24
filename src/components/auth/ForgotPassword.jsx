import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgotPasswordApi } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { useToast } from "../common/Toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          email: values.email,
        };

        const response = await forgotPasswordApi(payload);

        if (response) {
          toast.success("OTP sent to your email");
          sessionStorage.setItem("email", values.email);
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("isForgotPassword", "true");
          navigate("/otp");
        }
      } catch (error) {
        console.error("Forgot password error", error);
        toast.error(error?.response?.data?.message || "Failed to send OTP");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      {/* {loading && <Loader text="Sending OTP..." />} */}
      <div className="contact-page pt-100">
        <div className="container">
          <div className="contact-flex" style={{ marginBottom: "40px" }}>
            <div className="image-section">
              <img src="/images/contact.png" alt="Contact" />
            </div>

            <div className="form-section">
              <div className="form-content-wrapper">
                <div className="form-header">
                  <h2>Forgot Password</h2>
                  <p>Enter your email to receive an OTP</p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  {/* Email */}
                  <div className="form-group">
                    <label>
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="underline-input"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <small className="erro-text text-color">
                        {formik.errors.email}
                      </small>
                    )}
                  </div>

                  <div style={{ marginTop: "44px" }}>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={formik.isSubmitting}
                    >
                      {loading ? "Sending..." : "Send Otp"}
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

export default ForgotPassword;
