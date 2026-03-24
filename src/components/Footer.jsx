import React, { useEffect, useState } from "react";
import useFadeInOnScroll from "./common/useFadeInOnScroll";
import {
  subscribeApi,
  getInTouchApi,
  getAllCategoriesApi,
} from "../apis/service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useLocation, matchPath } from "react-router-dom";
import * as Yup from "yup";
import {useToast} from "./common/Toast"
import { image_url } from "../apis/env";

const subscriptionSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const Footer = () => {
  useFadeInOnScroll();
  const location = useLocation();
  const [footerData, setFooterData] = useState(null);
  const [categories, setCategories] = useState([]);
  const toast=useToast()

  const categoryRouteMatch = matchPath("/categories/:id", location.pathname);
  const categoryId = categoryRouteMatch?.params?.id;
  const selectedCategory = categories.find((category) => category._id === categoryId);
  const selectedCategoryLogo = selectedCategory?.logo
    ? `${image_url}/${selectedCategory.logo}`
    : null;

  const fetchDetails = async () => {
    try {
      const response = await getInTouchApi();
      if (response?.success && response?.data?.length > 0) {
        setFooterData(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch footer details", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategoriesApi();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchCategories();
  }, []);

  return (
    <>
      {/* Handicraft section - full-width cream background */}
      <div
        className="handicraft-section"
        style={{
          width: "100%",
          backgroundColor: "#fff9dc",
          paddingTop: "80px",
          paddingBottom: "50px",
          boxSizing: "border-box",
        }}
      >
        <div className="container">
          <div className="common-heading">
            <div className="common-sec">
              <h2 className="title title-2">
                Handcrafted in <span>India.</span> Designed to <span>stand</span> apart.
              </h2>
            </div>
            <div className="logo-2">
              <img
                src={selectedCategoryLogo || "/images/Frame2.png"}
                alt={selectedCategory?.name ? `${selectedCategory.name} logo` : "Frame"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter + Footer - same background edge-to-edge */}
      <div className="footer-bleed" style={{ width: "100%", backgroundColor: "#c9b09a" }}>
      <section className="newsletter-section">
        <div className="newsletter-box">
          {/* <h2>More Beautiful moments awaits...</h2> */}
          <p>
            Join exclusive access to <span className="love">offers & more</span>
          </p>

          <div className="newsletter-form">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={subscriptionSchema}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Email is required";
                  toast.error("Email is required");
                }
                return errors;
              }}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                  await subscribeApi(values);
                  toast.success("Subscribed successfully 🎉");
                  resetForm();
                } catch (error) {
                  toast.error(
                    error?.response?.data?.message || "Subscription failed",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                  />

                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Subscribe"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="">
        <div className="footer-div container">
         
          <div className="footer-box">
          <h3>Occasion</h3>
            <ul>
              {categories.length === 0 ? (
                <li>
                  <span>Loading...</span>
                </li>
              ) : (
                categories.map((category) => (
                  <li key={category._id}>
                    <Link to={`/categories/${category._id}`}>
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="footer-box">
            <h3>Information</h3>
            <ul>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/exchange-policy">Exchange Policy</Link></li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions">Terms of Use</Link>
              </li>
              {/* <li><a href="">Governance</a></li>
              <li><a href="">Careers</a></li>
              <li><a href="">Sitemap</a></li> */}
            </ul>
          </div>

          <div className="footer-box">
            <h3>Visit Us</h3>
            <ul>
              {footerData?.address && (
                <li>
                  <a href="">
                    <i className="fa-solid fa-location-dot"></i>{" "}
                    {footerData.address.street}, {footerData.address.city},{" "}
                    {footerData.address.state} - {footerData.address.zipCode}
                  </a>
                </li>
              )}

              {footerData?.phone && (
                <li>
                  <a href={`tel:${footerData.phone}`}>
                    <i className="fa-solid fa-phone"></i> {footerData.phone}
                  </a>
                </li>
              )}

              {footerData?.email && (
                <li>
                  <a href={`mailto:${footerData.email}`}>
                    <i className="fa-solid fa-envelope"></i> {footerData.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="footer-box">
            <h3>About Us</h3>
            <div className="socialicon">
              {footerData?.socialLinks?.twitter && (
                <a href={footerData.socialLinks.twitter} target="_blank">
                  <i className="fa-brands fa-twitter"></i>
                </a>
              )}

              {footerData?.socialLinks?.facebook && (
                <a href={footerData.socialLinks.facebook} target="_blank">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}

              {footerData?.socialLinks?.instagram && (
                <a href={footerData.socialLinks.instagram} target="_blank">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}

              {footerData?.socialLinks?.linkedin && (
                <a href={footerData.socialLinks.linkedin} target="_blank">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              )}
            </div>
            <img
              src="/images/rubber stamp 1.png"
              className="kuchh-alag"
              alt="Stamp"
            />
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Footer;
