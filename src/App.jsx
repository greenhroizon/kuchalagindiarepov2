import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import WebRoutes from "./WebRoutes";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { ToastProvider } from "./components/common/Toast";
import useFadeInOnScroll from "./components/common/useFadeInOnScroll";

const Layout = () => {
  const location = useLocation();
  useFadeInOnScroll();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", 
    });
  }, [location.pathname]);

  return (
    <>
      <Header />
      <WebRoutes />
      {location.pathname !== "/not-found" && <Footer />}
    </>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout />
      </Router>
    </ToastProvider>
  );
}

export default App;
