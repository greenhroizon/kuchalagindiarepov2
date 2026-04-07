import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  addToCartApi,
  getProductByIdApi,
  getAllProductesApi,
} from "../apis/service";
import Loader from "./common/Loader";
import Reels from "./Reels";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";
import ProductGrid from "./common/ProductGrid";
import { addGuestCartItem, dispatchCartUpdated } from "../utils/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [productDetail, setProductDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [switchingProduct, setSwitchingProduct] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingProductId, setAddingProductId] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const hasLoadedProductRef = useRef(false);
  const imageContainerRef = useRef(null);
  const [magnifier, setMagnifier] = useState({
    show: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const LENS_SIZE = 160;
  const ZOOM_LEVEL = 2.5;

  const handleImageMouseMove = (e) => {
    if (!imageContainerRef.current || images.length === 0) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    setMagnifier({
      show: true,
      x: relX,
      y: relY,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleImageMouseLeave = () => {
    setMagnifier((prev) => ({ ...prev, show: false }));
  };

  /* 🔥 FIX: force page to top on navigation */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (hasLoadedProductRef.current) {
          setSwitchingProduct(true);
        } else {
          setLoading(true);
        }

        const res = await getProductByIdApi(id);
        setProductDetail(res?.data || {});
        setMainImageIndex(0);
        hasLoadedProductRef.current = true;
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
        setSwitchingProduct(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  useEffect(() => {
    const categoryId = productDetail?.categoryId?._id;

    if (!categoryId || !productDetail?._id) {
      setRelatedProducts([]);
      return;
    }

    const fetchRelatedProducts = async () => {
      try {
        const params = new URLSearchParams({
          categoryId,
          limit: "12",
        });

        const res = await getAllProductesApi(params.toString());
        const products = res?.data?.products || [];

        setRelatedProducts(
          products.filter(
            (item) => item?._id && item._id !== productDetail._id,
          ),
        );
      } catch (error) {
        console.error(error);
        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [productDetail]);

  const toggleAccordion = (key) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        selectedProducts: [
          {
            productId: productDetail._id,
            name: productDetail.name,
            price: productDetail.sellingPrice,
            imageUrl: productDetail.imageUrl?.[0],
            quantity: 1,
          },
        ],
      },
    });
  };

  const addToCart = async (productId, product) => {
    try {
      if (sessionStorage.getItem("userLoggedIn") === null) {
        addGuestCartItem(product || { _id: productId });
        dispatchCartUpdated({ productId, guest: true });
        toast.success("Item added to cart");
        return;
      }

      setAddingProductId(productId);
      await addToCartApi({ productId });
      dispatchCartUpdated({ productId, guest: false });
    } catch (error) {
      console.log(error?.message);
    } finally {
      setAddingProductId(null);
    }
  };

  /* ✅ FULL PAGE LOADER */
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  const images = productDetail?.imageUrl || [];
  const mrp = Number(productDetail?.mrp);
  const sellingPrice = Number(productDetail?.sellingPrice);
  const hasDiscount = mrp > sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : 0;

  const hasValue = (val) => val != null && String(val).trim() !== "";
  const hasBenefits = hasValue(productDetail?.benefits);
  const hasUse = hasValue(productDetail?.use);
  const hasAdditionalInfo = hasValue(productDetail?.additionalInfo);
  const hasFaqs =
    Array.isArray(productDetail?.faqs) && productDetail.faqs.length > 0;

  return (
    <div
      style={{ marginTop: "80px", paddingBottom: "40px" }}
      className="bg-index pt-80"
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "0 16px",
          transition: "opacity 0.2s ease",
          opacity: switchingProduct ? 0.92 : 1,
        }}
      >
        {/* Breadcrumb */}
        <div style={{ marginBottom: "16px" }}>
          <Link to="/">Home</Link> &gt; {productDetail?.name}
        </div>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          {/* IMAGE SECTION with magnifier */}
          <div style={{ width: "520px", maxWidth: "100%" }}>
            <div
              ref={imageContainerRef}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              style={{
                position: "relative",
                width: "100%",
                height: "515px",
                overflow: "hidden",
                borderRadius: "12px",
                cursor: magnifier.show ? "none" : "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  transform: `translateX(-${mainImageIndex * 100}%)`,
                  transition: "transform 0.4s ease",
                }}
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={`${image_url}/${img}`}
                    alt="product"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      flexShrink: 0,
                      pointerEvents: "none",
                    }}
                  />
                ))}
              </div>

              {/* Magnifier lens - shows zoomed area under cursor */}
              {magnifier.show &&
                images[mainImageIndex] &&
                (() => {
                  const lensLeft = Math.max(
                    0,
                    Math.min(
                      magnifier.width - LENS_SIZE,
                      magnifier.x - LENS_SIZE / 2,
                    ),
                  );
                  const lensTop = Math.max(
                    0,
                    Math.min(
                      magnifier.height - LENS_SIZE,
                      magnifier.y - LENS_SIZE / 2,
                    ),
                  );
                  const bgX = LENS_SIZE / 2 - magnifier.x * ZOOM_LEVEL;
                  const bgY = LENS_SIZE / 2 - magnifier.y * ZOOM_LEVEL;
                  return (
                    <div
                      style={{
                        position: "absolute",
                        left: lensLeft,
                        top: lensTop,
                        width: LENS_SIZE,
                        height: LENS_SIZE,
                        borderRadius: "50%",
                        border: "3px solid rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                        overflow: "hidden",
                        pointerEvents: "none",
                        backgroundImage: `url(${image_url}/${images[mainImageIndex]})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${magnifier.width * ZOOM_LEVEL}px ${magnifier.height * ZOOM_LEVEL}px`,
                        backgroundPosition: `${bgX}px ${bgY}px`,
                        zIndex: 10,
                      }}
                    />
                  );
                })()}
            </div>

            {/* Thumbnails */}
            <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    marginLeft: "65px",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
  }}
>
  {images.map((img, index) => (
    <button
      key={index}
      onClick={() => setMainImageIndex(index)}
      style={{
        flex: "0 0 calc(33.33% - 7px)", // 3 items visible
        maxWidth: "70px",
        scrollSnapAlign: "start",
        border:
          mainImageIndex === index
            ? "2px solid #e60023"
            : "1px solid #ddd",
        borderRadius: "8px",
        padding: 0,
        background: "none",
        cursor: "pointer",
      }}
    >
      <img
        src={`${image_url}/${img}`}
        alt="thumb"
        style={{
          width: "100%",
          height: "70px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
    </button>
  ))}
</div>
          </div>

          {/* DETAILS */}
          <div class="product-details" style={{ flex: 1 }}>
            <h1>
              <span class="product-name">{productDetail?.name}</span> -
              <span class="sub-name"> {productDetail?.categoryId?.name} </span>
            </h1>
            {/* <p class="product-description">
              Donec ut rhoncus ex. Suspendisse ac rhoncus nislg |{" "}
              <span class="volume">50ml</span>
            </p> */}

            <div class="price-section" style={{ marginTop: "3%" }}>
              {hasDiscount && (
                <span style={{ marginRight: "8px", color: "#888" }}>
                  MRP {mrp} ({discountPercent}% OFF)
                </span>
              )}
              <span class="current-price">Rs {sellingPrice}</span>
            </div>

            <div class="tax-info">
              <span class="info-icon">
                <img src="/images/Vector.png" />{" "}
              </span>
              <span>Tax Included. Shipping calculated at Checkout</span>
            </div>

            <p class="product-text">{productDetail?.description}</p>

            <div class="features">
              {productDetail?.shipmentType === "order" ? (
                <div class="feature">
                  <div class="feature-icon">💳</div>
                  <div class="feature-text">
                    <div class="feature-title">Made to order</div>
                    <div class="feature-subtitle">Orders</div>
                  </div>
                </div>
              ) : (
                <div class="feature">
                  <div class="feature-icon">🚚</div>
                  <div class="feature-text">
                    <div class="feature-title">Free Shipping On Orders</div>
                    <div class="feature-subtitle">Rs 999+</div>
                  </div>
                </div>
              )}
            </div>

            <div className="accordion">
              {hasBenefits && (
                <div className="accordion-item">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion("benefits")}
                  >
                    <span>Returns & Help</span>
                    <span
                      className={`accordion-icon ${
                        activeAccordion === "benefits" ? "active" : ""
                      }`}
                    >
                      <i className="fa-solid fa-angle-down"></i>
                    </span>
                  </div>
                  <div
                    className={`accordion-content ${
                      activeAccordion === "benefits" ? "active" : ""
                    }`}
                  >
                    <p className="accordion-text">{productDetail?.benefits}</p>
                  </div>
                </div>
              )}

              {hasUse && (
                <div className="accordion-item">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion("usage")}
                  >
                    <span>How to Use</span>
                    <span
                      className={`accordion-icon ${
                        activeAccordion === "usage" ? "active" : ""
                      }`}
                    >
                      <i className="fa-solid fa-angle-down"></i>
                    </span>
                  </div>
                  <div
                    className={`accordion-content ${
                      activeAccordion === "usage" ? "active" : ""
                    }`}
                  >
                    <p className="accordion-text">{productDetail?.use}</p>
                  </div>
                </div>
              )}

              {hasAdditionalInfo && (
                <div className="accordion-item">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion("info")}
                  >
                    <span>Additional Information</span>
                    <span
                      className={`accordion-icon ${
                        activeAccordion === "info" ? "active" : ""
                      }`}
                    >
                      <i className="fa-solid fa-angle-down"></i>
                    </span>
                  </div>
                  <div
                    className={`accordion-content ${
                      activeAccordion === "info" ? "active" : ""
                    }`}
                  >
                    <p className="accordion-text">
                      {productDetail?.additionalInfo}
                    </p>
                  </div>
                </div>
              )}

              {hasFaqs && (
                <div className="accordion-item">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion("faqs")}
                  >
                    <span>FAQs</span>
                    <span
                      className={`accordion-icon ${
                        activeAccordion === "faqs" ? "active" : ""
                      }`}
                    >
                      <i className="fa-solid fa-angle-down"></i>
                    </span>
                  </div>

                  <div
                    className={`accordion-content ${
                      activeAccordion === "faqs" ? "active" : ""
                    }`}
                    style={{ paddingTop: "8px" }}
                  >
                    {productDetail?.faqs?.map((faq, index) => (
                      <div
                        key={index}
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "12px 0",
                        }}
                      >
                        <p
                          className="accordion-text"
                          style={{
                            fontWeight: "600",
                            marginBottom: "6px",
                          }}
                        >
                          Q. {faq?.question}
                        </p>

                        <p
                          className="accordion-text"
                          style={{
                            color: "#555",
                            lineHeight: "1.6",
                          }}
                        >
                          {faq?.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleBuyNow}
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  width: "100%",
                  background: "#e60023",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div
          className="product-sec"
          style={{
            maxWidth: "1200px",
            margin: "56px auto 0",
            padding: "0 16px",
          }}
        >
          <div className="common-sec">
            <h2 className="title">
              Related <span>Products</span>
            </h2>
            <p className="sub">Explore more pieces from the same category.</p>
          </div>

          <ProductGrid
            products={relatedProducts}
            addingProductId={addingProductId}
            onAddToCart={addToCart}
            onProductClick={(productId) =>
              navigate(`/product-detail/${productId}`)
            }
            imageBaseUrl={image_url}
            showOfferCodeWhenDiscountOnly={false}
            layout="carousel"
            wrapInContainer={false}
            carouselBreakpoints={{
              576: { slidesPerView: 2 },
              768: { slidesPerView: 2.2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          />
        </div>
      )}
      <div style={{ marginTop: "5%" }}>
        <Reels />
      </div>
    </div>
  );
};

export default ProductDetail;
