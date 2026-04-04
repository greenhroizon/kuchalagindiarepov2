import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addQueryApi, getInTouchApi } from "../apis/service";
import Loader from "./common/Loader";
import { message } from "antd";
import { useToast } from "./common/Toast";

const contactSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  message: Yup.string().required("Message is required"),
});

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState();
  const toast=useToast();

  const fetchDetails = async () => {
    try {
      const response = await getInTouchApi();
      if (response?.success && response?.data?.length > 0) {
        setNumber(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch footer details", error);
    }
  };

  const handleWhatsApp = () => {
    if (!number?.phone) return;

    window.open(`https://wa.me/${number.phone}`, "_blank");
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      <div className="bg-index" style={{ paddingBottom: "120px" }}>
        <div className="contact-page pt-100">
          <div className="container">
            <div className="common-sec">
              <h2 className="title">
                <span> Contact Us </span>
              </h2>
              <p className="sub">
               Send us your custom order request/ query/ emergency info on order/ message
              </p>
            </div>

            <div className="contact-flex">
              <div className="image-section">
                <img src="/images/contact (1).jpg" alt="Contact" />
              </div>

              <div className="form-section">


                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    countryCode: "+91",
                    phone: "",
                    message: "",
                  }}
                  validationSchema={contactSchema}
                  onSubmit={async (values, { resetForm, setSubmitting }) => {
                    try {
                      if (message.length > 250) {
                        toast.error(
                          "Message cannot be more than 250 characters",
                        );
                        return;
                      }
                      setLoading(true);
                      await addQueryApi({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phone: `${values.countryCode}${values.phone}`,
                        message: values.message,
                      });
                      resetForm();
                    } catch (error) {
                      console.error("Query submission failed", error);
                    } finally {
                      setLoading(false);
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group form-row">
                        <div>
                          <label>
                            First Name <span className="required">*</span>
                          </label>
                          <Field type="text" name="firstName" />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="error"
                            style={{
                              color: "#e60023",
                              fontSize: "13px",
                              marginTop: "6px",
                            }}
                          />
                        </div>

                        <div>
                          <label>
                            Last Name <span className="required">*</span>
                          </label>
                          <Field type="text" name="lastName" />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="error"
                            style={{
                              color: "#e60023",
                              fontSize: "13px",
                              marginTop: "6px",
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          Email <span className="required">*</span>
                        </label>
                        <Field type="email" name="email" />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                          style={{
                            color: "#e60023",
                            fontSize: "13px",
                            marginTop: "6px",
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Phone <span className="required">*</span>
                        </label>
                        <div className="phone-group">
                          <Field as="select" name="countryCode">
                            <option value="+91">+91</option>
                          </Field>

                          <Field
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="error"
                          style={{
                            color: "#e60023",
                            fontSize: "13px",
                            marginTop: "6px",
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Message <span className="required">*</span>
                        </label>
                        <Field as="textarea" rows="4" name="message" />
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="error"
                          style={{
                            color: "#e60023",
                            fontSize: "13px",
                            marginTop: "6px",
                          }}
                        />
                      </div>

                      <div style={{ marginTop: "44px" }}>
                        <button
                          type="submit"
                          className="btn btn-submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "SUBMIT"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-whatsapp"
                          onClick={handleWhatsApp}
                        >
                          Chat on WhatsApp
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
