import { useEffect } from "react";

const useFadeInOnScroll = () => {
  useEffect(() => {
    const handleScroll = () => {
      const pageBottom = window.scrollY + window.innerHeight;
      const elements = document.querySelectorAll(".fadein");

      elements.forEach((el) => {
        if (el.getBoundingClientRect().top + window.scrollY < pageBottom) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

export default useFadeInOnScroll;
