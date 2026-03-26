import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomOrder from "./components/CustomOrder";
import CustomOrderHistory from "./components/CustomOrderHistory";

const isLoggedIn = () => {
  return !!sessionStorage.getItem("userLoggedIn");
};

const isOtpFlowAllowed = () => {
  return !!sessionStorage.getItem("email");
};

const isResetPasswordAllowed = () => {
  return sessionStorage.getItem("isForgotPassword") === "true";
};


const ProtectedRoute = ({ children }) =>
  isLoggedIn() ? children : <Navigate to="/signin" replace />;

const PublicRoute = ({ children }) =>
  isLoggedIn() ? <Navigate to="/" replace /> : children;

const OtpRoute = ({ children }) =>
  isOtpFlowAllowed() ? children : <Navigate to="/signin" replace />;

const ResetPasswordRoute = ({ children }) =>
  isResetPasswordAllowed() ? children : <Navigate to="/signin" replace />;



const Index = lazy(() => import("./components/Index"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const Categories = lazy(() => import("./components/Categories"));
const AboutUs = lazy(() => import("./components/About"));
const NotFound = lazy(() => import("./components/NotFound"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Wishlist = lazy(() => import("./components/Wishlist"));

const Otp = lazy(() => import("./components/auth/Otp"));
const Signup = lazy(() => import("./components/auth/Signup"));
const Signin = lazy(() => import("./components/auth/Signin"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));

const Terms = lazy(() => import("./components/Terms"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("./components/ShippingPolicy"));
const ExchangePolicy = lazy(() => import("./components/ExchangePolicy"));

const NewCheckOutForm = lazy(() => import("./components/NewCheckOutForm"));
const PaymentForm = lazy(() => import("./components/PaymentForm"));
const OrderHistory = lazy(() => import("./components/OrderHistory"));
const Profile = lazy(() => import("./components/Profile"));
const PaymentStatus = lazy(() => import("./components/PaymentStatus"));


const WebRoutes = () => {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
      }
    >
      <Routes basename="/">
        <Route path="/" element={<Index />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<Categories />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/exchange-policy" element={<ExchangePolicy />} />

        <Route path="/custom-orders" element={<CustomOrder />} />
        <Route path="/custom-order-history" element={<CustomOrderHistory />} />

        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/otp"
          element={
            <OtpRoute>
              <Otp />
            </OtpRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPasswordRoute>
              <ResetPassword />
            </ResetPasswordRoute>
          }
        />

        <Route
          path="/checkout"
          element={<NewCheckOutForm />}
        />

        <Route
          path="/payment"
          element={<PaymentForm />}
        />

        <Route
          path="/payment-result"
          element={<PaymentStatus />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
};

export default WebRoutes;
