import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addAddressApi,
  getAddressApi,
  updateAddressApi,
  placeOrderApi,
  applyCouponApi,
} from "../apis/service";
import Loader from "./common/Loader";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";

const NewCheckOutForm = () => {
  const { state } = useLocation();
  console.log("state", state);
  const navigate = useNavigate();
  const selectedProducts = state?.selectedProducts || [];

  // ---------------- ADDRESS STATE ----------------
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // ---------------- COUPON STATE ----------------
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [prodStatus, setProdStatus] = useState(false);

  const [form, setForm] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const fillAddress = (addr) => {
    console.log("Fill Address:", addr);
    setForm({
      country: addr.country || "India",
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      email: "",
      address: addr.address || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      phone: addr.contactNumber || "",
    });
  };

  const fetchAddresses = async () => {
    if (sessionStorage.getItem("userLoggedIn") === null) {
      return;
    }

    try {
      setLoading(true);
      const res = await getAddressApi();
      if (res?.success) {
        console.log("Addresses:", res);
        setSelectedAddressId(res?.data?._id);
        fillAddress(res.data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedProducts.length) {
      navigate("/", { replace: true });
    }
  }, [selectedProducts, navigate]);

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- INPUT HANDLER ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- SAVE / UPDATE ADDRESS & PLACE ORDER ----------------
  const handleSaveAndContinue = async () => {
    const isLoggedIn = sessionStorage.getItem("userLoggedIn") !== null;

    // Validate required fields
    if (
      !form.firstName ||
      !form.lastName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.phone
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    if (!isLoggedIn && !form.email.trim()) {
      toast.warning("Please enter your email address");
      return;
    }

    const payload = {
      label: "Home",
      country: form.country,
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      apartment: form.apartment,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      contactNumber: form.phone,
      isDefault: true,
    };

    try {
      let addressId = selectedAddressId;

      console.log("payload", selectedAddressId);
      setProdStatus(true);

      if (isLoggedIn) {
        if (selectedAddressId) {
          const updateRes = await updateAddressApi(selectedAddressId, payload);
          if (updateRes?.success) {
            console.log("updateRes", updateRes);
            addressId = updateRes?.data?.data._id;
          }
        } else {
          const addRes = await addAddressApi(payload);
          if (addRes?.success) {
            addressId = addRes.data._id;
            setSelectedAddressId(addressId);
          }
        }
      }

      console.log("addressId", selectedProducts, addressId);

      // Place order if products exist
      if (selectedProducts.length > 0 && (isLoggedIn ? addressId : true)) {
        const checkoutPayload = {
          items: selectedProducts.map((item) => ({
            productId: item.productId || item._id,
            quantity: item.quantity || 1,
          })),
          ...(isLoggedIn
            ? { addressId }
            : {
                shippingAddress: {
                  country: form.country,
                  firstName: form.firstName,
                  lastName: form.lastName,
                  contactNumber: form.phone,
                  address: form.address,
                  apartment: form.apartment,
                  city: form.city,
                  state: form.state,
                  pincode: form.pincode,
                },
                guestContact: {
                  email: form.email.trim(),
                },
              }),
        };

        // Add coupon code if applied
        if (appliedCoupon?.code) {
          checkoutPayload.couponCode = appliedCoupon.code;
        }

        const orderRes = await placeOrderApi(checkoutPayload);
        if (orderRes?.success) {
          navigate("/payment", {
            state: {
              orderId: orderRes.data._id,
              selectedProducts: selectedProducts,
              appliedCoupon: appliedCoupon,
              discount: discount,
              subtotal: subtotal,
              finalAmount: finalAmount,
              email: form.email.trim(),
              isGuestCheckout: !isLoggedIn,
            },
          });
        } else {
          toast.error(orderRes?.message || "Failed to place order");
        }
      } else {
        toast.success("Address saved successfully!");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error saving address/placing order:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setProdStatus(false);
    }
  };

  // ---------------- PRICE CALCULATION ----------------
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const finalAmount = subtotal - discount;

  // const tax = subtotal * 0.18;
  // const total = subtotal + tax;

  // ---------------- COUPON HANDLERS ----------------
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const payload = {
        code: couponCode.trim(),
        amount: subtotal,
      };

      const res = await applyCouponApi(payload);

      if (res?.success) {
        setAppliedCoupon(res.data.coupon);
        setDiscount(res.data.discount);
        setCouponError("");
      } else {
        setCouponError(res?.message || "Invalid coupon code");
        setAppliedCoupon(null);
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError(
        error?.response?.data?.message || "Failed to apply coupon",
      );
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError("");
  };

  return (
    <>
      {loading && <Loader text="Loading..." />}
      <div>
        <div className="checkout-page pt-100 bg-index">
          <div className="container">
            <div className="checkout-container">
              <div className="checkout-form-section">
                <h2 className="mb-30">Shipping Address</h2>

                <label className="section-heading">Delivery</label>
                <div className="form-input-wrapper">
                  <select
                    className="select-dropdown"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  >
                    <option>India</option>
                  </select>
                </div>

                <div className="form-input-wrapper name-fields-row">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="First name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Last name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>

                {sessionStorage.getItem("userLoggedIn") === null && (
                  <div className="form-input-wrapper">
                    <input
                      type="email"
                      className="text-input"
                      placeholder="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="form-input-wrapper address-field-wrapper">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                  <span className="address-search-icon">
                    {" "}
                    <i className="fa-solid fa-magnifying-glass"></i>{" "}
                  </span>
                </div>

                <div className="form-input-wrapper">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Apartment, suite, etc. (optional)"
                    name="apartment"
                    value={form.apartment}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-input-wrapper location-fields-row">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="text-input"
                    placeholder="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="text-input"
                    placeholder="PIN code"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-input-wrapper phone-field-wrapper">
                  <input
                    type="tel"
                    className="phone-input-field"
                    placeholder="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <span className="phone-info-icon">
                    <i className="fa-regular fa-circle-question"></i>
                  </span>
                </div>
              </div>

              <div className="order-summary-section">
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((item) => (
                    <div
                      className="product-display-card"
                      key={item.productId || item._id}
                    >
                      <div className="product-image-wrapper">
                        {console.log("rajuu", item)}
                        <img
                          src={
                            Array.isArray(item.imageUrl) &&
                            item.imageUrl.length > 0
                              ? `${image_url}/${item.imageUrl[0]}`
                              : item.imageUrl
                                ? `${image_url}/${item.imageUrl}`
                                : "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=200&h=200&fit=crop"
                          }
                          alt={item.name || "Product"}
                          className="product-thumbnail"
                        />

                        <span className="quantity-badge">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <div className="product-info-wrapper">
                        <div className="product-title-text">
                          {item.name || "Product"}
                        </div>
                      </div>
                      <div className="product-price-text">
                        ₹{(item.price || 0) * (item.quantity || 1)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="product-display-card">
                    <div className="product-image-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1515688594390-b649af70d282?w=200&h=200&fit=crop"
                        alt="Product"
                        className="product-thumbnail"
                      />
                      <span className="quantity-badge">1</span>
                    </div>
                    <div className="product-info-wrapper">
                      <div className="product-title-text">
                        No products selected
                      </div>
                    </div>
                    <div className="product-price-text">₹0.00</div>
                  </div>
                )}

                <div className="discount-code-section">
                  {appliedCoupon ? (
                    <div className="applied-coupon-wrapper">
                      <div className="applied-coupon-info">
                        <span className="coupon-tag">
                          <i className="fa-solid fa-tag"></i>{" "}
                          {appliedCoupon.code}
                        </span>
                        <span className="coupon-discount-text">
                          {appliedCoupon.type === "PERCENTAGE"
                            ? `${appliedCoupon.value}% off`
                            : `₹${appliedCoupon.value} off`}
                        </span>
                      </div>
                      <button
                        className="remove-coupon-btn"
                        onClick={handleRemoveCoupon}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="discount-code-input"
                        placeholder="Discount code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError("");
                        }}
                      />
                      <button
                        className="apply-discount-btn"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </>
                  )}
                </div>
                {couponError && (
                  <div className="coupon-error-message">{couponError}</div>
                )}

                <div className="price-summary-row">
                  <span className="price-row-label">Subtotal</span>
                  <span className="price-row-value">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="price-summary-row discount-row">
                    <span
                      className="price-row-label"
                      style={{ color: "#28a745" }}
                    >
                      Discount
                      {appliedCoupon && (
                        <span style={{ fontSize: "12px", marginLeft: "5px" }}>
                          ({appliedCoupon.code})
                        </span>
                      )}
                    </span>
                    <span
                      className="price-row-value"
                      style={{ color: "#28a745" }}
                    >
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="price-summary-row">
                  <span className="price-row-label">
                    Shipping{" "}
                    <span style={{ fontSize: "12px" }}>
                      <i className="fa-regular fa-circle-question"></i>
                    </span>
                  </span>
                  <span className="price-row-value" style={{ color: "#999" }}>
                    {form.address
                      ? "Calculated at next step"
                      : "Enter shipping address"}
                  </span>
                </div>

                <div className="total-price-row">
                  <span className="total-label-text">Total</span>
                  <div style={{ textAlign: "right" }}>
                    <div className="total-amount-value">
                      <span className="currency-label">INR</span>₹{" "}
                      {finalAmount.toFixed(2)}
                    </div>
                    {discount > 0 && (
                      <div
                        className="savings-info"
                        style={{ color: "#28a745", fontSize: "12px" }}
                      >
                        You save ₹{discount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="signin-button">
                  <div
                    className="product-sec"
                    style={{ marginTop: "50px", marginBottom: "0" }}
                  >
                    <button
                      className="add-to-cart-btn"
                      onClick={handleSaveAndContinue}
                    >
                      {prodStatus ? "Adding details ..." : "Save & Continue"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCheckOutForm;
