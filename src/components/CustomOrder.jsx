import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { customOrderApi } from "../apis/service";
import { useToast } from "./common/Toast";
import { googleClientId } from "../apis/env";
import { googleLoginApi, loginApi } from "../apis/service";
import { useNavigate } from "react-router-dom";
const CustomOrder = () => {
  const [loading, setLoading] = useState(false);
  const toast=useToast();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);
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

  return (
    <div style={{ paddingTop: "200px", paddingBottom: "80px" }} className="bg-index">
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >

<h2 className="title" style={{ textAlign: "center" , marginBottom:"15px"}}>
  <span>Custom Order</span>
</h2>
        {/* CARD */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#FFF9F1",
            borderRadius: "16px",
            overflow: "hidden",
            minHeight: "520px", // 👈 required for vertical centering
          }}
        >
          {/* LEFT IMAGE - hidden on mobile, visible on web */}
          <div className="custom-order-image-wrap" style={{ width: "45%" }}>
            <img
              src="/images/Horse jacket .JPG"
              alt="Order"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>


          {/* <div className="form-header">
                  <h2>Contact Us</h2>
                 
                </div> */}

          {/* RIGHT FORM (VERTICALLY CENTERED) - full width on mobile when image hidden */}
          <div
            className="custom-order-form-wrap"
            style={{
              width: "55%",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >

            
            <Formik
              initialValues={{
                type: "",
                date: "",
                address: "",
              }}
              onSubmit={async (values, { resetForm }) => {
                try {
                  setLoading(true);
                  await customOrderApi({
                    type: values.type,
                    date: values.date,
                    address: values.address,
                  });
                  resetForm();
                  toast.success("Order placed successfully");
                } catch (error) {
                  console.error("Custom order failed", error);
                  toast.error("Failed to place order");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {() => (
                <Form>
                  {/* TYPE OF ORDER */}
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        marginBottom: "8px",
                      }}
                    >
                      Type of Order
                    </label>
                    <Field
                      as="select"
                      name="type"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#fff",
                      }}
                    >
                      <option value="">Select</option>
                      <option value="BULK">Bulk</option>
                      <option value="BRIDESMAID">Bridesmaid</option>
                      <option value="BESTMAN">Best Man</option>
                      <option value="SINGLE">Single</option>
                    </Field>
                  </div>

                  {/* DATE + LOCATION */}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          marginBottom: "8px",
                        }}
                      >
                        Date of Delivery
                      </label>
                      <Field
                        type="date"
                        name="date"
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "#fff",
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          marginBottom: "8px",
                        }}
                      >
                        Location of Delivery
                      </label>
                      <Field
                        type="text"
                        name="address"
                        placeholder="Enter delivery address"
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "#fff",
                        }}
                      />
                    </div>
                  </div>

                  {/* NOTE */}
                  <div
                    style={{
                      backgroundColor: "#0B4A6F",
                      color: "#fff",
                      padding: "10px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    Note: Order confirmation will be made within 3 working days
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "14px",
                      backgroundColor: loading ? "#bdbdbd" : "#9E9E9E",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
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
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
