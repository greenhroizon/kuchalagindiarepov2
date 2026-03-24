import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addAddressApi,
  getAddressApi,
  updateAddressApi,
  placeOrderApi,
  makePaymentApi,
  verifyOrderApi,
} from "../apis/service";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";

const Checkout = () => {
  /* ================= ROUTER ================= */
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const state = location.state;

  console.log("state", state);

  /* ================= VALIDATION FLAG ================= */
  const isValidState =
    state &&
    Array.isArray(state.selectedProducts) &&
    state.selectedProducts.length > 0;

  /* ================= ALL HOOKS ================= */
  const [originalAddress, setOriginalAddress] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [form, setForm] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  /* ================= HARD GUARD ================= */
  if (!isValidState) {
    return <Navigate to="/" replace />;
  }

  /* ================= SAFE DATA ================= */
  const selectedProducts = state.selectedProducts;

  /* ================= ADDRESS HELPERS ================= */
  const fillAddress = (addr) => {
    setForm({
      country: addr.country,
      firstName: addr.firstName,
      lastName: addr.lastName || "",
      address: addr.address,
      apartment: addr.apartment || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.contactNumber,
    });
  };

  const hasAddressChanged = () => {
    if (!originalAddress) return true;

    return Object.keys(originalAddress).some(
      (key) => originalAddress[key] !== form[key],
    );
  };

  /* ================= FETCH ADDRESS ================= */
  const fetchAddresses = async () => {
    try {
      const res = await getAddressApi();
      if (res?.success && res.data) {
        setAddresses(res.data);
        setSelectedAddressId(res.data._id);
        fillAddress(res.data);

        setOriginalAddress({
          country: res.data.country,
          firstName: res.data.firstName,
          lastName: res.data.lastName || "",
          address: res.data.address,
          apartment: res.data.apartment || "",
          city: res.data.city,
          state: res.data.state,
          pincode: res.data.pincode,
          phone: res.data.contactNumber,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ADDRESS ================= */
  const handleSaveAddress = async () => {
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
      if (!selectedAddressId) {
        await addAddressApi(payload);
        toast.success("Address added");
        fetchAddresses();
        return;
      }

      if (!hasAddressChanged()) {
        toast.info("Address already up to date");
        return;
      }

      await updateAddressApi(selectedAddressId, payload);
      toast.success("Address updated");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  /* ================= PRICE ================= */
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /* ================= PAY NOW ================= */
  const handlePayNow = async () => {
    if (!selectedAddressId) {
      toast.warning("Please save/select an address");
      return;
    }

    try {
      const orderRes = await placeOrderApi({
        items: selectedProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        addressId: selectedAddressId,
      });

      if (!orderRes?.success) {
        toast.error("Failed to place order");
        return;
      }

      const orderId = orderRes.data._id;

      navigate("/payment", {
        state: {
          orderId,
          selectedProducts,
          userName: `${form.firstName} ${form.lastName}`,
          phone: form.phone,
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="checkout-page" style={{ marginTop: "3%" }}>
      {/* ---------------- LEFT SECTION ---------------- */}
      <div className="checkout-left">
        <h2>Delivery</h2>

        {/* {addresses.length > 0 && (
          <select
            className="input"
            value={selectedAddressId || ""}
            onChange={(e) => {
              const addr = addresses.find((a) => a._id === e.target.value);
              if (addr) {
                setSelectedAddressId(addr._id);
                fillAddress(addr);
              }
            }}
          >
            <option value="">Select saved address</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.address}, {addr.city}
              </option>
            ))}
          </select>
        )} */}

        <select className="input" name="country" value={form.country}>
          <option>India</option>
        </select>

        <div className="row">
          <input
            className="input"
            placeholder="First name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Last name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          className="input"
          placeholder="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          className="input"
          placeholder="Apartment (optional)"
          name="apartment"
          value={form.apartment}
          onChange={handleChange}
        />

        <div className="row">
          <input
            className="input"
            placeholder="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="State"
            name="state"
            value={form.state}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="PIN code"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
          />
        </div>

        <input
          className="input"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <button className="pay-btn" onClick={handleSaveAddress}>
          Save Address
        </button>
      </div>

      {/* ---------------- RIGHT SECTION ---------------- */}
      <div className="checkout-right">
        {selectedProducts.map((item) => (
          <div className="product" key={item.productId}>
            {console.log("itemmashu", item)}
            <img src={`${image_url}/${item.imageUrl}`} alt={item.name} />
            <div>
              <p className="product-name">{item.name}</p>
              <p>
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}

        <div className="summary">
          <div>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
        </div>

        <div className="total">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>
        <button
          className="pay-btn"
          style={{ marginTop: "1rem" }}
          onClick={handlePayNow}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;
