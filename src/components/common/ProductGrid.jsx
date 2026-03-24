import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { addWishlist, getAllWishlist, removeWishlist } from '../../apis/service';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  addGuestWishlistId,
  dispatchWishlistUpdated,
  getGuestWishlistIds,
  removeGuestWishlistId,
  WISHLIST_UPDATED_EVENT,
} from '../../utils/wishlist';

const ProductGrid = ({
  title,
  subtitle,
  products = [],
  loading = false,
  limit,
  addingProductId = null,
  onAddToCart,
  onProductClick,
  imageBaseUrl = '',
  emptyState,
  showOfferCodeWhenDiscountOnly = true,
  showViewAll = false,
  onViewAll,
  onWishlistUpdate,
  layout = 'grid',
  carouselBreakpoints,
  wrapInContainer = true,
}) => {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistActionIds, setWishlistActionIds] = useState([]);

  const list = Array.isArray(products)
    ? typeof limit === 'number' && limit > 0
      ? products.slice(0, limit)
      : products
    : [];
    // console.log("title", title)
  const shouldShowOfferCode = (item) => {
    if (!showOfferCodeWhenDiscountOnly) return true;
    return item?.mrp && item?.mrp > item?.sellingPrice;
  };

  const getProductId = (item) =>
    item?._id || item?.productId?._id || item?.productId || '';

  useEffect(() => {
    const syncWishlistIds = async () => {
      const token = sessionStorage.getItem('userLoggedIn');
      if (!token) {
        setWishlistIds(getGuestWishlistIds());
        return;
      }

      try {
        const response = await getAllWishlist();
        const payload = response?.data ?? response ?? {};
        const products = payload?.products ?? payload?.wishlist?.products ?? [];
        // console.log(products);
        const ids = products
          .map((item) => (typeof item === 'string' ? item : item?._id))
          .filter(Boolean);
        setWishlistIds(ids);
      } catch {
        setWishlistIds([]);
      }
    };

    syncWishlistIds();

    const handleWishlistUpdated = () => {
      syncWishlistIds();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    };
  }, []);

  const toggleWishlist = async (id) => {
    const token = sessionStorage.getItem('userLoggedIn');

    if (wishlistActionIds.includes(id)) return;

    const isWishlisted = wishlistIds.includes(id);
    setWishlistActionIds((prev) => [...prev, id]);

    if (!token) {
      const updatedIds = isWishlisted
        ? removeGuestWishlistId(id)
        : addGuestWishlistId(id);

      setWishlistIds(updatedIds);
      onWishlistUpdate && onWishlistUpdate(id, !isWishlisted);
      dispatchWishlistUpdated({ productId: id, added: !isWishlisted, guest: true });
      setWishlistActionIds((prev) => prev.filter((item) => item !== id));
      return;
    }

    setWishlistIds((prev) =>
      isWishlisted ? prev.filter((item) => item !== id) : [...prev, id],
    );

    try {
      if (isWishlisted) {
        await removeWishlist(id);
        onWishlistUpdate && onWishlistUpdate(id, false);
        dispatchWishlistUpdated({ productId: id, added: false, guest: false });
      } else {
        await addWishlist(id);
        onWishlistUpdate && onWishlistUpdate(id, true);
        dispatchWishlistUpdated({ productId: id, added: true, guest: false });
      }
    } catch {
      setWishlistIds((prev) =>
        isWishlisted ? [...prev, id] : prev.filter((item) => item !== id),
      );
    } finally {
      setWishlistActionIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const defaultCarouselBreakpoints = {
    576: { slidesPerView: 2 },
    768: { slidesPerView: 2.2 },
    992: { slidesPerView: 3 },
    1200: { slidesPerView: 4 },
  };

  const renderProductCard = (item) => {
    const productId = getProductId(item);
    if (!productId) return null;

    return (
      <div className="product-card" key={productId}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(productId);
          }}
          aria-label={
            wishlistIds.includes(productId)
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
          style={{
            top: '10px',
            right: '10px',
            background: '#fff',
            borderRadius: '50%',
            padding: '8px',
            cursor: wishlistActionIds.includes(productId) ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'end',
            opacity: wishlistActionIds.includes(productId) ? 0.6 : 1,
          }}
        >
          {wishlistIds.includes(productId) ? (
            <FaHeart color="red" size={18} />
          ) : (
            <FaRegHeart size={18} />
          )}
        </div>

        <img
          src={`${imageBaseUrl}/${item.imageUrl?.[0]}`}
          alt={item.name}
          className="product-image"
          style={{ cursor: onProductClick ? 'pointer' : 'default' }}
          onClick={() => onProductClick && onProductClick(productId)}
        />

        <div className="product-info">
          <h3
            className="product-name"
            style={{ cursor: onProductClick ? 'pointer' : 'default' }}
            onClick={() => onProductClick && onProductClick(productId)}
          >
            {item.name}
          </h3>
          <hr />

          <div className="offer-flex">
            <div>
              <div className="price-section">
                {item.mrp && item.mrp > item.sellingPrice ? (
                  <>
                    <span className="current-price">
                      Rs {item.sellingPrice}
                    </span>
                    <span className="original-price">
                      Rs {item.mrp}
                    </span>
                    {item.discountPercent > 0 && (
                      <span className="discount-badge">
                        {item.discountPercent}% OFF
                      </span>
                    )}
                  </>
                ) : (
                  <span className="current-price">
                    Rs {item.sellingPrice}
                  </span>
                )}
              </div>

              {shouldShowOfferCode(item) && (
                <div className="offer-code">
                  <span className="offer-icon">🏷️</span>
                  <span>OFFER CODE</span>
                </div>
              )}
            </div>

            {onAddToCart && (
              <button
                className="add-to-cart-btn"
                onClick={() => onAddToCart(productId, item)}
                disabled={addingProductId === productId}
              >
                {addingProductId === productId
                  ? 'Adding...'
                  : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const content =
    !loading && list.length === 0
      ? (emptyState ?? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <img
              src="/images/item-not-found.webp"
              alt="No products"
              style={{ width: '220px', marginBottom: '20px', opacity: 0.8 }}
            />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
              Product Not Found
            </h3>
            <p style={{ color: '#777' }}>
              No products are available right now.
            </p>
          </div>
        ))
      : layout === 'carousel'
        ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={1.15}
              breakpoints={carouselBreakpoints || defaultCarouselBreakpoints}
              style={{ padding: '8px 4px 16px' }}
            >
              {list.map((item) => {
                const productId = getProductId(item);
                if (!productId) return null;

                return (
                  <SwiperSlide key={productId} style={{ height: 'auto' }}>
                    {renderProductCard(item)}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )
        : (
            <div className="product-grid">
              {list.map((item) => renderProductCard(item))}
            </div>
          );

  const WrapperTag = wrapInContainer ? 'div' : React.Fragment;
  const wrapperProps = wrapInContainer ? { className: 'container' } : {};

  return (
    <WrapperTag {...wrapperProps}>
      {title && (
        <div className="common-sec">
          <h2 className="title">
            <span>{title}</span>
          </h2>
          {subtitle && <p className="sub">{subtitle}</p>}
        </div>
      )}

      {content}

      {showViewAll && onViewAll && (
        <div className="view-all-section">
          <button className="view-all-btn" onClick={onViewAll}>
            View All Products
          </button>
        </div>
      )}
    </WrapperTag>
  );
};

export default ProductGrid;
