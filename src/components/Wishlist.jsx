import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCartApi, getAllWishlist, getProductByIdApi } from '../apis/service';
import Loader from './common/Loader';
import ProductGrid from './common/ProductGrid';
import { useToast } from './common/Toast';
import { image_url } from '../apis/env';
import {
  getGuestWishlistIds,
  WISHLIST_UPDATED_EVENT,
} from '../utils/wishlist';
import { addGuestCartItem, dispatchCartUpdated } from '../utils/cart';

const Wishlist = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  const normalizeWishlistProducts = (response) => {
    const payload = response?.data ?? response ?? {};
    const rawProducts = payload?.products ?? payload?.wishlist?.products ?? [];

    return rawProducts
      .map((item) => {
        if (!item) return null;
        if (typeof item === 'object' && item._id) return item;
        return null;
      })
      .filter(Boolean);
  };

  const fetchGuestWishlist = useCallback(async () => {
    const guestWishlistIds = getGuestWishlistIds();

    if (guestWishlistIds.length === 0) {
      setProducts([]);
      return;
    }

    const responses = await Promise.allSettled(
      guestWishlistIds.map((productId) => getProductByIdApi(productId)),
    );

    const items = responses
      .map((result) =>
        result.status === 'fulfilled' ? result.value?.data ?? null : null,
      )
      .filter((item) => item?._id);

    setProducts(items);
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('userLoggedIn');

      if (token) {
        const response = await getAllWishlist();
        const items = normalizeWishlistProducts(response);
        setProducts(items);
        return;
      }

      await fetchGuestWishlist();
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchGuestWishlist]);

  useEffect(() => {
    fetchWishlist();

    const handleWishlistUpdated = () => {
      fetchWishlist();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    };
  }, [fetchWishlist]);

  const addToCart = async (productId, product) => {
    try {
      if ( sessionStorage.getItem('userLoggedIn') === null) {
        addGuestCartItem(product || { _id: productId });
        dispatchCartUpdated({ productId, guest: true });
        toast.success('Item added to cart');
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

  const handleProductNavigate = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const handleWishlistUpdate = (productId, added) => {
    if (added) return;
    setProducts((prev) => prev.filter((item) => item?._id !== productId));
  };

  return (
    <>
      {loading && <Loader />}
      <div className="product-sec bg-index pt-80" style={{ paddingBottom: '120px' }}>
        <div className="container">
          <ProductGrid
            title={products.length !== 0 ? 'My Wishlist' : undefined}
            subtitle={
              products.length !== 0
                ? 'All your saved jewellery picks in one place.'
                : undefined
            }
            products={products}
            loading={loading}
            addingProductId={addingProductId}
            onAddToCart={addToCart}
            onProductClick={handleProductNavigate}
            imageBaseUrl={image_url}
            showOfferCodeWhenDiscountOnly={false}
            onWishlistUpdate={handleWishlistUpdate}
            emptyState={
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '60px 20px',
                }}
              >
                <img
                  src="/images/item-not-found.webp"
                  alt="No wishlist products"
                  style={{ width: '220px', marginBottom: '20px', opacity: 0.8 }}
                />
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                  Wishlist is empty
                </h3>
                <p style={{ color: '#777' }}>
                  Save products to your wishlist and they will appear here.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Wishlist;
