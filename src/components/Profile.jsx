import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import ChangePassword from "./auth/ChangePassword";
import DeleteAccount from "./auth/DeleteAccount";
import { getUserProfile, updateUserProfile } from "../apis/service";
import * as Yup from "yup";
import Loader from "./common/Loader";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";

const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
});

const Profile = () => {
  const [active, setActive] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("/images/avatar.jpg");
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profileImage: null,
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);

        if (values.profileImage) {
          formData.append("image", values.profileImage);
        }

        await updateUserProfile(formData);

        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update profile",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // =====================
  // Fetch User Profile
  // =====================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getUserProfile();
        const user = res.data;

        formik.setValues({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          profileImage: user.profilePic,
        });

        if (user.profilePic) {
          setImagePreview(user.profilePic);
        }
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =====================
  // Image Change Handler
  // =====================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    formik.setFieldValue("profileImage", file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="profile-page pt-80 bg-index">
      {/* {loading && <Loader />} */}
      <div className="checkout-sign">
        <div className="container">
          <div className="signin-form">
            <div className="signin-page">
              <div className="setting">
                <h3>Account Setting</h3>
              </div>

              <div className="myaccount-information">
                <a
                  onClick={() => setActive("profile")}
                  className={`account-box-1 ${
                    active === "profile" ? "active" : ""
                  }`}
                >
                  <h6>Your Profile</h6>
                </a>

                <a
                  onClick={() => setActive("password")}
                  className={`account-box-1 ${
                    active === "password" ? "active" : ""
                  }`}
                >
                  <h6>Reset Password</h6>
                </a>

                <a
                  onClick={() => setActive("delete")}
                  className={`account-box-1 ${
                    active === "delete" ? "active" : ""
                  }`}
                >
                  <h6>Delete</h6>
                </a>
              </div>
            </div>

            {/* ================= PROFILE ================= */}
            {active === "profile" && (
              <div className="signin-image new-img">
                <div className="signin-page-1">
                  <form className="signin-form-page">
                    <div className="signin-head">
                      <h2>Profile</h2>
                    </div>

                    {/* Profile Image */}
                    {/* Profile Image */}
                    <div className="author-profile">
                      <div
                        className="author-media"
                        style={{
                          position: "relative",
                          width: "140px",
                          height: "140px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "2px solid #e5e5e5",
                          cursor: "pointer",
                        }}
                      >
                        {/* Image */}
                        <img
                          src="images/graduate_4465457.png"
                          alt="profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />

                        {/* Pencil Icon */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            right: "15px",
                            width: "34px",
                            height: "34px",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "16px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            pointerEvents: "none", // icon doesn't block click
                          }}
                        >
                          ✏️
                        </div>

                        {/* Invisible File Input (clickable area) */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>

                    <div className="detail-grid-1">
                      <div className="details-flex-2">
                        {/* First Name */}
                        <div className="form-group">
                          <label className="lab">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            className="detail-btn"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.firstName &&
                            formik.errors.firstName && (
                              <small className="error-text">
                                {formik.errors.firstName}
                              </small>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="form-group">
                          <label className="lab">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            className="detail-btn"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.lastName &&
                            formik.errors.lastName && (
                              <small className="error-text">
                                {formik.errors.lastName}
                              </small>
                            )}
                        </div>

                        {/* Email (READ ONLY) */}
                        <div className="form-group">
                          <label className="lab">Email</label>
                          <input
                            type="text"
                            className="detail-btn t-1"
                            value={formik.values.email}
                            disabled
                          />
                        </div>

                        {/* Phone (READ ONLY) */}
                        <div className="form-group">
                          <label className="lab">Phone</label>
                          <input
                            type="text"
                            className="detail-btn t-1"
                            value={formik.values.phone}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="box-center-pro">
                        <a
                          href="#"
                          className={loading ? "disabled" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!loading) formik.handleSubmit();
                          }}
                        >
                          {loading ? "Updating..." : "Update"}
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {active === "password" && <ChangePassword />}
            {active === "delete" && <DeleteAccount />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
