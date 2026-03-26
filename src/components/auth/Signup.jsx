import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerApi } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();

  // 👁 password visibility states (commented out - OTP signup, no password at signup)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },

    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Minimum 2 characters")
        .required("First name is required"),

      lastName: Yup.string()
        .min(2, "Minimum 2 characters")
        .required("Last name is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      phone: Yup.string()
        .matches(/^[0-9]{7,15}$/, "Invalid phone number")
        .required("Phone number is required"),

      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[A-Z]/, "One uppercase required")
        .matches(/[0-9]/, "One number required")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),

      termsAccepted: Yup.boolean().oneOf(
        [true],
        "You must accept terms & conditions",
      ),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          countryCode: values.countryCode,
          phone: values.phone,
          password: values.password,
        };

        const response = await registerApi(payload);

        sessionStorage.setItem("email", values.email);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("otpSentTo", "phone"); // OTP sent to mobile via Twilio

        navigate("/otp");
      } catch (error) {
        console.error("Signup error", error);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="contact-page pt-100 bg-index" style={{ paddingBottom: "120px" }}>
        <div className="container pt-100">
          <div className="contact-flex" style={{ marginBottom: "40px"}}>
            <div className="image-section">
              <img src="/images/Horse jacket .JPG" alt="Contact" />
            </div>

            <div className="form-section">
              <div className="form-header">
                <h2>Sign Up</h2>
                <p>Stay Connected for exquisite design and exclusive offers</p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                {/* First & Last Name */}
                <div className="form-group form-row">
                  <div>
                    <label>
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="underline-input"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <small className="erro-text text-color">
                        {formik.errors.firstName}
                      </small>
                    )}
                  </div>

                  <div>
                    <label>
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="underline-input"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <small className="erro-text text-color">
                        {formik.errors.lastName}
                      </small>
                    )}
                  </div>
                </div>

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

                {/* Phone */}
                <div className="form-group">
                  <label>Country</label>
                  <div className="phone-group">
                    <select
                      name="countryCode"
                      value={formik.values.countryCode}
                      onChange={formik.handleChange}
                    >
                      <option value="+91">+91</option>
                      {/* <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                      <option value="+86">+86</option> */}
                    </select>

                    <input
                      type="tel"
                      name="phone"
                      className="underline-input"
                      placeholder="Phone Number *"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <small className="erro-text text-color">
                      {formik.errors.phone}
                    </small>
                  )}
                </div>

                {/* Password - commented out: OTP sent to mobile via Twilio, no password at signup */}
               <div className="form-group" style={{ position: "relative" }}>
                  <label>
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="underline-input"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
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
                    <small className="erro-text text-color">
                      {formik.errors.password}
                    </small>
                  )}
                </div> 

                {/* Confirm Password - commented out */}
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

                {/* Terms */}
                <p className="tc">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                  />{" "}
                  I agree to be contacted by Kuch Alag Jewels via phone, SMS,
                  WhatsApp or email. <Link to="/terms-and-conditions">T&C</Link>{" "}
                  and <Link to="/privacy-policy">Privacy Policy</Link>
                </p>
                {formik.touched.termsAccepted &&
                  formik.errors.termsAccepted && (
                    <small className="erro-text text-color">
                      {formik.errors.termsAccepted}
                    </small>
                  )}

                <div style={{ marginTop: "44px" }}>
                  <button
                    type="submit"
                    className="btn btn-submit"
                    disabled={loading}
                  >
                    {loading ? <>Creating account...</> : "Get OTP to signup"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-whatsapp"
                    onClick={() => navigate("/signin")}
                  >
                    Already a member? Log In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
