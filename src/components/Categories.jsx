import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import useFadeInOnScroll from "./common/useFadeInOnScroll";
import {
  getAllCategoriesApi,
  getAllProductesApi,
  addToCartApi,
} from "../apis/service";
import CategoryCard from "./common/CategoryCard";
import Loader from "./common/Loader";
import { useToast } from "./common/Toast";
import { image_url } from "../apis/env";
import ProductGrid from "./common/ProductGrid";
import { addGuestCartItem, dispatchCartUpdated } from "../utils/cart";

const PAGE_SIZE = 12;

const Categories = () => {
  useFadeInOnScroll();

  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  /* ---------------- FETCH CATEGORIES (ONCE) ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesApi();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Category Error:", error);
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page,
          limit: PAGE_SIZE,
        });

        if (categoryId) {
          params.append("categoryId", categoryId);
        }

        const res = await getAllProductesApi(params.toString());
        const { products, pagination } = res.data;

        setProducts(products || []);
        setTotalItems(pagination.totalItems);
        setCurrentPage(pagination.currentPage);
      } catch (error) {
        console.error("Product Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [categoryId],
  );

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

  /* ---------------- CATEGORY CHANGE ---------------- */
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [categoryId, fetchProducts]);

  /* ---------------- PAGINATION ---------------- */
  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const handleProductNavigate = (id) => {
    navigate(`/product-detail/${id}`);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="product-sec bg-index pt-80" style={{ paddingBottom: "120px" }}>
        <div className="container">
          <ProductGrid
            title={products.length !== 0 ? "Best Sellers" : undefined}
            subtitle={
              products.length !== 0
                ? "Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
                : undefined
            }
            products={products}
            loading={loading}
            addingProductId={addingProductId}
            onAddToCart={addToCart}
            onProductClick={handleProductNavigate}
            imageBaseUrl={image_url}
            // In categories, always show offer code (previously always rendered)
            showOfferCodeWhenDiscountOnly={false}
          />

          {/* PAGINATION */}
          {totalItems > PAGE_SIZE && (
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>

        <CategoryCard />
      </div>
    </>
  );
};

export default Categories;
