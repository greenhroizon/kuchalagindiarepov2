import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { googleLoginApi, loginApi } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import { googleClientId } from "../../apis/env";
import { useToast } from "../common/Toast";

const Signin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    let isMounted = true;

    const initializeGoogleButton = () => {
      if (!isMounted || !googleButtonRef.current || !window.google?.accounts?.id) {
        return false;
      }

      googleButtonRef.current.innerHTML = "";
      const buttonWidth = Math.min(
        360,
        googleButtonRef.current.parentElement?.offsetWidth || 360,
      );

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (credentialResponse) => {
          const idToken = credentialResponse?.credential;
          if (!idToken) {
            toast.error("Google login failed. Please try again.");
            return;
          }

          try {
            setGoogleLoading(true);
            const response = await googleLoginApi({ idToken });

            sessionStorage.setItem("userLoggedIn", response.data.token);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("email");
            navigate("/");
          } catch (error) {
            console.error("Google login error", error);
          } finally {
            setGoogleLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: buttonWidth,
      });

      setGoogleReady(true);
      return true;
    };

    if (initializeGoogleButton()) {
      return () => {
        isMounted = false;
      };
    }

    setGoogleReady(false);

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    const script = existingScript || document.createElement("script");
    const handleLoad = () => {
      initializeGoogleButton();
    };
    const handleError = () => {
      if (!isMounted) return;
      setGoogleReady(false);
      toast.error("Unable to load Google login. Please try again.");
    };

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [navigate, toast]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const payload = {
          email: values.email,
          password: values.password,
        };

        const response = await loginApi(payload);

        if (!response?.data?.isVerified) {
          sessionStorage.setItem("email", values.email);
          sessionStorage.setItem("token", response.data.token);
          navigate("/otp");
          return;
        }

        sessionStorage.setItem("userLoggedIn", response.data.token);
        sessionStorage.removeItem("token")
        navigate("/");
      } catch (error) {
        console.error("Login error", error);
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
           

          <div className="contact-flex" style={{ marginBottom: "40px" }}>
            <div className="image-section">
              <img src="/images/signupPage.jpg" alt="Contact" />
            </div>

            <div className="form-section">
              <div className="form-content-wrapper">
                <div className="form-header">
                  <h2>Sign In</h2>
                  <p>Welcome back! Please login to your account</p>
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

                  {/* Password */}
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
                    />

                    <span
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

                  {/* Forgot Password */}
                  {/* <div style={{ textAlign: "right", marginTop: "8px" }}>
                    <span
                      onClick={() => navigate("/forgot-password")}
                      style={{
                        cursor: "pointer",
                        color: "#1d4ed8",
                        fontSize: "14px",
                      }}
                    >
                      Forgot password?
                    </span>
                  </div> */}

                  <div style={{ marginTop: "44px" }}>
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={loading || googleLoading}
                    >
                      {loading ? (
                        <>
                        Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-whatsapp"
                      disabled={googleLoading}
                      onClick={() => navigate("/signup")}
                    >
                      New here? Sign Up
                    </button>
                  </div>

                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                      Or
                    </p>
                    {googleClientId ? (
                      <div
                        ref={googleButtonRef}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          minHeight: "44px",
                          opacity: googleLoading ? 0.7 : 1,
                          pointerEvents: googleLoading ? "none" : "auto",
                        }}
                      />
                    ) : (
                      <small className="erro-text text-color">
                        Google login is not configured yet.
                      </small>
                    )}
                    {googleClientId && !googleReady && !googleLoading ? (
                      <small
                        style={{
                          display: "block",
                          marginTop: "10px",
                          color: "#666",
                        }}
                      >
                        Loading Google sign-in...
                      </small>
                    ) : null}
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

export default Signin;
