import React, { useEffect, useState } from "react";
import useFadeInOnScroll from "./common/useFadeInOnScroll";
import {
  getAllCategoriesApi,
  getAllProductesApi,
  getAllBanners,
  addUserInfoApi,
} from "../apis/service";
import { useNavigate } from "react-router-dom";
import Reels from "./Reels";
import { addToCartApi } from "../apis/service";
import CategoryCard from "./common/CategoryCard";
import Loader from "./common/Loader";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";
import ProductGrid from "./common/ProductGrid";
import { addGuestCartItem, dispatchCartUpdated } from "../utils/cart";
// import { showConsole } from "../apis/env";
const inputStyle = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px 12px",
  fontSize: "14px",
  outline: "none",
  background: "#fafafa",
};

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const homePageBackgroundStyle = {
  backgroundImage:
    'linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)), url("/images/slider.png")',
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundAttachment: isIOS ? "scroll" : "fixed", 
  minHeight: "100vh",
};
const POPUP_SUBMITTED_KEY = "user_info_popup_submitted";
const POPUP_LAST_CLOSED_KEY = "user_info_popup_last_closed";
const POPUP_INTERVAL_MS = 30 *100;

const Index = () => {
  useFadeInOnScroll();

  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allBanners, setAllBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [showUserInfoPopup, setShowUserInfoPopup] = useState(false);
  const [submittingUserInfo, setSubmittingUserInfo] = useState(false);
const [userInfoForm, setUserInfoForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  location: "",
});

  const navigate = useNavigate();
  const toast = useToast();

  const fetchAllBanners = async () => {
    try {
      const response = await getAllBanners();

      return await response.data;
    } catch (error) {
      return [];
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategoriesApi();

      return await response.data;
    } catch (error) {
      return [];
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProductesApi();

      return await response.data.products;
    } catch (error) {
      return [];
    }
  };

  const addToCart = async (productId, product) => {
    try {
      if (sessionStorage.getItem("userLoggedIn") === null) {
        addGuestCartItem(product || { _id: productId });
        dispatchCartUpdated({ productId, guest: true });
        toast.success("Item added to cart");
        return;
      }
      const data = {
        productId: productId,
      };
      setAddingProductId(productId);
      const response = await addToCartApi(data);
      console.log("ress", response);
      dispatchCartUpdated({ productId, guest: false });
    } catch (error) {
      console.log(error.message);
    } finally {
      setAddingProductId(null);
    }
  };

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      const [categories, allProducts, allBanners] = await Promise.all([
        fetchAllCategories(),
        fetchAllProducts(),
        fetchAllBanners(),
      ]);

      const sortedProducts = [...allProducts].sort((a, b) => {
        const aBest = a.bestSeller === true;
        const bBest = b.bestSeller === true;

        return bBest - aBest;
      });

      setAllBanners(allBanners);
      setAllCategories(categories);
      setAllProducts(sortedProducts); 

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  // Don't show popup on first load; start 2-min timer. If logged in, never show.
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("userLoggedIn") != null;
    const hasSubmitted = localStorage.getItem(POPUP_SUBMITTED_KEY) === "true";

    if (isLoggedIn || hasSubmitted) return;

    // Start 2-minute countdown from this visit (so popup shows after 2 min)
    localStorage.setItem(POPUP_LAST_CLOSED_KEY, Date.now().toString());
  }, []);

  // Show popup after 2 minutes if user is not logged in and has not submitted
  useEffect(() => {
    const intervalId = setInterval(() => {
      const isLoggedIn = sessionStorage.getItem("userLoggedIn") != null;
      const hasSubmitted = localStorage.getItem(POPUP_SUBMITTED_KEY) === "true";
      if (isLoggedIn || hasSubmitted) return;

      const lastClosed = parseInt(localStorage.getItem(POPUP_LAST_CLOSED_KEY) || "0", 10);
      if (Date.now() - lastClosed >= POPUP_INTERVAL_MS) {
        setShowUserInfoPopup(true);
      }
    }, 30000); // check every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleProductNavigate = (id) => {
    navigate(`/product-detail/${id}`);
  };

const handleUserInfoChange = (event) => {
  const { name, value } = event.target;

  setUserInfoForm((prev) => {
    const updated = { ...prev, [name]: value };

    // Concatenate firstName and lastName into fullName
    updated.fullName = `${updated.firstName} ${updated.lastName}`.trim();

    return updated;
  });
};

const submitUserInfo = async (event) => {
  event.preventDefault();
  try {
    setSubmittingUserInfo(true);

    const payload = {
      name:         userInfoForm.fullName,
      email:        userInfoForm.email,
      mobileNumber: userInfoForm.mobileNumber,
      location:     userInfoForm.location,
    };

    const response = await addUserInfoApi(payload);
    if (response?.success) {
      localStorage.setItem(POPUP_SUBMITTED_KEY, "true");
      setShowUserInfoPopup(false);
      setUserInfoForm({
        firstName: "",
        lastName:  "",
        fullName:  "",
        email:     "",
        mobileNumber: "",
        location:  "",
      });
      toast.success("Thank you! We'll be in touch.");
    }
  } catch (error) {
    console.log(error?.message || "Failed to submit user info");
  } finally {
    setSubmittingUserInfo(false);
  }
};

  const closeUserInfoPopup = () => {
    localStorage.setItem(POPUP_LAST_CLOSED_KEY, Date.now().toString());
    setShowUserInfoPopup(false);
  };

  console.log("allBanners", allBanners);

  return (
    <>
      {loading && <Loader />}
      {showUserInfoPopup && (
        <div
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "420px",
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      position: "relative",
      fontFamily: "Inter, sans-serif",
    }}
  >
    {/* Close Button */}
    <button
      type="button"
      onClick={closeUserInfoPopup}
      style={{
        position: "absolute",
        right: "12px",
        top: "12px",
        border: "none",
        background: "rgba(255,255,255,0.8)",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "18px",
        zIndex: 1,
      }}
    >
      ×
    </button>

    {/* Image Header */}
    <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
      <img
        src="/images/popupImage.jpeg"
        alt="popup"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>

    {/* Content */}
    <div style={{ padding: "24px 22px 28px" }}>
<h3 style={{ textAlign: "center", marginBottom: "4px", fontSize: "20px", fontWeight: 600 }}>
  Welcome To <span style={{ color: "#c8a97e" }}>KuchalagIndia</span>
</h3>
<p style={{ textAlign: "center", fontSize: "13px", color: "#666", marginBottom: "18px" }}>
  <span style={{ fontStyle: "italic", letterSpacing: "1px" }}>5% off on your 1st order after you subscribe to us</span> 
</p>

      <form onSubmit={submitUserInfo}>

        {/* Row 1 — First & Last Name */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userInfoForm.firstName}
            onChange={handleUserInfoChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userInfoForm.lastName}
            onChange={handleUserInfoChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Row 2 — Email & Mobile */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userInfoForm.email}
            onChange={handleUserInfoChange}
            required
            style={inputStyle}
          />
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={userInfoForm.mobileNumber}
            onChange={handleUserInfoChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Row 3 — Location (full width) */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={userInfoForm.location}
          onChange={handleUserInfoChange}
          required
          style={{ ...inputStyle, width: "100%", marginBottom: "16px" }}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={submittingUserInfo}
          style={{
            width: "100%",
            background: "#000",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            cursor: submittingUserInfo ? "not-allowed" : "pointer",
            opacity: submittingUserInfo ? 0.7 : 1,
          }}
        >
          {submittingUserInfo ? "Submitting..." : "SUBMIT"}
        </button>
      </form>
    </div>
  </div>
</div>
      )}
      <div style={{ ...homePageBackgroundStyle, paddingBottom: "40px" }}>
        <div className="index-slider">
          <div className="slider-container">
            <div className="slider" id="slider">
              <div className="slide">
                <img
                  src={`${image_url}/${allBanners?.[0]?.imageUrl}`}
                  alt=""
                  className=""
                />
                {/* <div className="slide-content">
                <h2>Shadi</h2>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div> */}
              </div>
            </div>

            {/* <button className="nav-button prev" onclick="prevSlide()">
            &#10094;
          </button>
          <button className="nav-button next" onclick="nextSlide()">
            &#10095;
          </button> */}

            <div className="dots" id="dots"></div>
          </div>
        </div>
        <div className="signature-grid">
          <div className="container">
            <div className="common-sec">
              <h2 className="title">
                Our <span>Signature Collection</span>
              </h2>
              <br />
              <p className="sub">
                A curated line of handcrafted jewellery innovations, redefining
                how adornment is worn and experienced.
                <br /> Each piece is conceived with a design-led philosophy,
                merging aesthetic distinction with thoughtful functionality
              </p>
            </div>
            <div className="row-4">
              <div className="iinner">
                <img src="/images/Index.jpg" className="jew1" />
                {/* <div className="explore-2">
                <a href="">Explore</a>
              </div> */}
              </div>
              <div className="col-md-5">
                <div className="row-inner">
                  <div className="iinner">
                    <img src="/images/Index1.jpg" className="jew" />
                    {/* <div className="explore-2">
                    <a href="">Explore</a>
                  </div> */}
                  </div>
                  <div className="iinner">
                    <img src="/images/Inde2.jpg" className="jew" />
                    {/* <div className="explore-2">
                    <a href="">Explore</a>
                  </div> */}
                  </div>
                  <div className="iinner">
                    <img src="/images/Index3.jpg" className="jew" />
                    {/* <div className="explore-2">
                    <a href="">Explore</a>
                  </div> */}
                  </div>
                  <div className="iinner">
                    <img src="/images/Index4.jpg" className="jew" />
                    {/* <div className="explore-2">
                    <a href="">Explore</a>
                  </div> */}
                  </div>
                </div>
              </div>
              <div className="iinner">
                <img src="/images/Index5.jpeg" className="jew1" />
                {/* <div className="explore-2">
                <a href="">Explore</a>
              </div> */}
              </div>
              <div className="stacked-jew-column">
                <div className="iinner">
                  <img src="/images/Index6.JPG" className="jew" />
                  {/* <div className="explore-2">
                  <a href="">Explore</a>
                </div> */}
                </div>
                <div className="iinner">
                  <img src="/images/Index7.png" className="jew" />
                  {/* <div className="explore-2">
                  <a href="">Explore</a>
                </div> */}
                </div>
              </div>
            </div>
          </div>
          <CategoryCard />
        </div>

        <div style={{ marginBottom: "10%" }}>
          <div className="product-sec">
            {allProducts.length > 0 && (
              <ProductGrid
                title=" best sellers "
                subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
                products={allProducts}
                loading={loading}
                limit={4}
                addingProductId={addingProductId}
                onAddToCart={addToCart}
                onProductClick={handleProductNavigate}
                imageBaseUrl={image_url}
                showViewAll={true}
                onViewAll={() => navigate("/categories")}
              />
            )}
          </div>

          <Reels />
        </div>
      </div>
    </>
  );
};

export default Index;
