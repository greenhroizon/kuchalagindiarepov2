import React, { useState, useEffect } from 'react';
import {
  removeFromCartApi,
  getCartItemsApi,
  updateCartItemApi,
  getAllCategoriesApi,
  getShopByProductpi,
  getAllWishlist,
} from '../apis/service';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutModal from './auth/LogoutModal';
import { useToast } from './common/Toast';
import { image_url } from '../apis/env';
import {
  getGuestWishlistIds,
  WISHLIST_UPDATED_EVENT,
} from '../utils/wishlist';
import {
  CART_UPDATED_EVENT,
  dispatchCartUpdated,
  getGuestCartItems,
  removeGuestCartItem,
  updateGuestCartItemQuantity,
} from '../utils/cart';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [isShopByProductOpen, setIsShopByProductOpen] = useState(false);
  const [shopbyProduct, setShopByProduct] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();

  const isLoggedIn = () => {
    return !!(
      sessionStorage.getItem('userLoggedIn') ||
      sessionStorage.getItem('token')
    );
  };

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const location = useLocation();

  useEffect(() => {
    setIsNavOpen(false);
    setIsCustomOrderOpen(false);
    setIsShopByProductOpen(false);
  }, [location.pathname]);

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleCart = async () => {
    setIsCartOpen((prev) => !prev);

    if (!isCartOpen) {
      fetchCart();
    }
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleNavClick = () => {
    setIsNavOpen(false);
  };

  const fetchCart = async () => {
    if (!isLoggedIn()) {
      setCartItems(getGuestCartItems());
      return;
    }
    const res = await getCartItemsApi();
    console.log('fetching cart', res);
    if (res?.success) {
      setCartItems(res.data.items || []);
    }
  };

  const fetchWishlistCount = async () => {
    if (!isLoggedIn()) {
      setWishlistCount(getGuestWishlistIds().length);
      return;
    }

    try {
      const response = await getAllWishlist();
      const payload = response?.data ?? response ?? {};
      const products = payload?.products ?? payload?.wishlist?.products ?? [];
      const count = products.filter(Boolean).length;
      setWishlistCount(count);
    } catch {
      setWishlistCount(0);
    }
  };

  const updateQty = async (productId, action) => {
    if (!isLoggedIn()) {
      const nextItems = updateGuestCartItemQuantity(productId, action);
      setCartItems(nextItems);
      dispatchCartUpdated({ productId, action, guest: true });
      return;
    }

    let data = {
      productId: productId,
      action: action,
    };
    await updateCartItemApi(data);
    fetchCart();
  };

  const removeItem = async (productId) => {
    if (!isLoggedIn()) {
      const nextItems = removeGuestCartItem(productId);
      setCartItems(nextItems);
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      dispatchCartUpdated({ productId, guest: true });
      return;
    }

    await removeFromCartApi(productId);
    fetchCart();
  };

  const subtotal = cartItems
    .filter((item) => selectedItems.includes(item?.productId?._id))
    .reduce(
      (sum, item) => sum + item.productId.sellingPrice * item.quantity,
      0,
    );

  // const removeItem = async (productId) => {
  //   await removeFromCartApi(productId);

  //   setSelectedItems((prev) => prev.filter((id) => id !== productId));

  //   fetchCart();
  // };
  const goToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select at least one product');
      return;
    }

    const selectedProducts = cartItems
      .filter((item) => selectedItems.includes(item.productId._id))
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.sellingPrice,
        imageUrl: item.productId.imageUrl,
        quantity: item.quantity,
      }));

    setIsCartOpen(false);

    navigate('/checkout', {
      state: { selectedProducts },
    });
  };

  // -------------- LOGOUT HANDLERS --------------
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsNavOpen(false);
    setOpenLogoutModal(true);
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    setOpenLogoutModal(false);
    setCartItems(getGuestCartItems());
    setSelectedItems([]);
    setWishlistCount(getGuestWishlistIds().length);
    navigate('/signin');
  };

  const cancelLogout = () => {
    setOpenLogoutModal(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategoriesApi();
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchShopByProduct = async () => {
    try {
      const res = await getShopByProductpi();
      if (res?.data) {
        setShopByProduct(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlistCount();
    fetchCategories();
    fetchShopByProduct();
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      setWishlistCount(getGuestWishlistIds().length);
      setCartItems(getGuestCartItems());
      return;
    }

    fetchCart();
    fetchWishlistCount();
  }, [location.pathname]);

  useEffect(() => {
    const handleWishlistUpdated = () => {
      fetchWishlistCount();
    };

    const handleCartUpdated = () => {
      fetchCart();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, []);

  const toggleCustomOrderDropdown = (e) => {
    e.preventDefault();
    setIsCustomOrderOpen(!isCustomOrderOpen);
    // Close the other dropdown to mimic exclusive behavior
    if (!isCustomOrderOpen) setIsShopByProductOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    setIsCustomOrderOpen(false);
    setIsShopByProductOpen(false);
    setIsNavOpen(false);
    navigate(`/categories/${categoryId}`);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0,
  );
  const announcementText =
    'Get 5% off on your 1st order, after you subscribe with us | WE SUGGEST- FOR FAMILY WEDDINGS, BRIDESMAID OR BESTMAN GIFTING, CUSTOM ORDERS, CONTACT US DIRECTLY';

  return (
    <>
      <header className="royal__header__wrapper">
        <div className="royal__announcement__bar" aria-hidden="true">
          <div className="royal__announcement__track">
            <span>{announcementText}</span>
            <span>{announcementText}</span>
            <span>{announcementText}</span>
            <span>{announcementText}</span>
          </div>
        </div>
        <div className="royal__top__bar">
          <button
            className={`royal__menu__button ${isNavOpen ? 'active' : ''}`}
            id="menuBtn"
            onClick={toggleNav}
          >
            <svg
              className="royal__chevron__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="royal__logo__center">
            <div className="logo">
              <Link to="/">
                <img src="/images/logo.png" alt="Logo" />
              </Link>
            </div>
          </div>

          <div className="royal__right__icons">
            <button
              className="royal__icon__btn"
              id="heartBtn"
              onClick={handleWishlistClick}
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="royal__icon__count">{wishlistCount}</span>
              )}
            </button>

            <button
              className="royal__icon__btn"
              id="cartBtn"
              onClick={toggleCart}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="royal__icon__count">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      <nav
        className={`royal__nav__sidebar ${isNavOpen ? 'active' : ''}`}
        id="navSidebar"
      >
        <ul className="royal__nav__menu">
          <Link
            to="/"
            className={`royal__nav__link ${isActive('/') ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            Home
          </Link>

          {/* {isLoggedIn() && ( */}
            <Link
              to="/custom-orders"
              className={`royal__nav__link ${
                location.pathname.startsWith('/custom-orders') ? 'active' : ''
              }`}
              onClick={handleNavClick}
            >
              Custom Order
            </Link>
          {/* )} */}

          <li className="royal__nav__item royal__nav__dropdown">
            <a
              href="#"
              className="royal__nav__link royal__dropdown__toggle"
              onClick={toggleCustomOrderDropdown}
            >
              Shop By Function
              <svg
                className={`royal__dropdown__arrow ${isCustomOrderOpen ? 'open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
            {isCustomOrderOpen && (
              <ul className="royal__dropdown__menu">
                {categories.length === 0 ? (
                  <li className="royal__dropdown__item">
                    <span className="royal__dropdown__link">Loading...</span>
                  </li>
                ) : (
                  categories.map((category) => (
                    <li key={category._id} className="royal__dropdown__item">
                      <a
                        href="#"
                        className="royal__dropdown__link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(category._id);
                        }}
                      >
                        {category.name}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            )}
          </li>

          <li className="royal__nav__item royal__nav__dropdown">
            <a
              href="#"
              className="royal__nav__link royal__dropdown__toggle"
              onClick={(e) => {
                e.preventDefault();
                setIsShopByProductOpen(!isShopByProductOpen);
                if (!isShopByProductOpen) setIsCustomOrderOpen(false);
              }}
            >
              Shop By Product
              <svg
                className={`royal__dropdown__arrow ${isShopByProductOpen ? 'open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
            {isShopByProductOpen && (
              <ul className="royal__dropdown__menu">
                {shopbyProduct.length === 0 ? (
                  <li className="royal__dropdown__item">
                    <span className="royal__dropdown__link">Loading...</span>
                  </li>
                ) : (
                  shopbyProduct.map((product) => (
                    <li key={product._id} className="royal__dropdown__item">
                      <a
                        href="#"
                        className="royal__dropdown__link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(product._id);
                        }}
                      >
                        {product.name}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            )}
          </li>

          {isLoggedIn() && (
            <>
              <Link
                to="/order-history"
                className={`royal__nav__link ${isActive('/order-history') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                Order History
              </Link>

              <Link
                to="/custom-order-history"
                className={`royal__nav__link ${isActive('/custom-order-history') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                Custom Order History
              </Link>

              <Link
                to="/profile"
                className={`royal__nav__link ${isActive('/profile') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                Profile
              </Link>
            </>
          )}

          <Link
            to="/about-us"
            className={`royal__nav__link ${isActive('/about-us') ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            About Us
          </Link>

          <Link
            to="/contact-us"
            className={`royal__nav__link ${isActive('/contact-us') ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            Contact
          </Link>

          {isLoggedIn() ? (
            <li className="royal__nav__item">
              <Link
                to=""
                className="royal__nav__link"
                onClick={handleLogoutClick}
              >
                Logout
              </Link>
            </li>
          ) : (
            <li className="royal__nav__item">
              <Link
                to="/signin"
                className="royal__nav__link"
                onClick={handleNavClick}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <aside
        className={`royal__cart__sidebar ${isCartOpen ? 'active' : ''} `}
        id="cartSidebar"
      >
        <div className="royal__cart__header">
          <h2 className="royal__cart__title">Your Cart</h2>
          <button
            className="royal__cart__close"
            id="cartCloseBtn"
            onClick={toggleCart}
          >
            ×
          </button>
        </div>

        <div className="royal__cart__items">
          {cartItems.length === 0 && (
            <div className="royal__empty__cart">
              <img
                src="/images/cart.jpg"
                alt="Empty Cart"
                className="royal__empty__cart__image"
              />

              <h3>Your cart is empty</h3>
              <p>Looks like you haven’t added anything yet</p>

              <button
                className="royal__empty__cart__btn"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/categories');
                }}
              >
                Start Shopping
              </button>
            </div>
          )}

          {cartItems.map((item) => {
            const product = item?.productId;

            return (
              <div className="royal__cart__item" key={product?._id}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(product?._id)}
                  onChange={() => toggleSelectItem(product?._id)}
                  style={{ marginRight: '10px' }}
                />

                <img
                  src={`${image_url}/${product?.imageUrl?.[0]}`}
                  alt={product?.name}
                  className="royal__item__image"
                />

                <div className="royal__item__details">
                  <div className="royal__item__name">{product?.name}</div>

                  {/* PRICE SECTION */}
                  <div className="royal__item__price">
                    {product?.mrp && product?.mrp > product?.sellingPrice ? (
                      <>
                        <span style={{ fontWeight: 'bold' }}>
                          Rs {product?.sellingPrice}
                        </span>

                        <span
                          style={{
                            marginLeft: '6px',
                            textDecoration: 'line-through',
                            color: '#888',
                            fontSize: '13px',
                          }}
                        >
                          Rs {product?.mrp}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 'bold' }}>
                        Rs {product?.sellingPrice}
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="royal__item__actions">
                    <button
                      className="royal__qty__btn"
                      onClick={() => updateQty(product._id, 'decrease')}
                    >
                      −
                    </button>

                    <span className="royal__qty__number">{item.quantity}</span>

                    <button
                      className="royal__qty__btn"
                      onClick={() => updateQty(product._id, 'increase')}
                    >
                      +
                    </button>

                    <button
                      className="royal__delete__btn"
                      onClick={() => removeItem(product._id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="royal__cart__footer"
          style={{ display: subtotal === 0 ? 'none' : 'block' }}
        >
          <p className="royal__promo__text">
            {/* Add 1 Product from Day & Night combo to unlock Buy 2 @ 798 */}
          </p>
          <div className="royal__subtotal">
            <span className="royal__subtotal__label">Subtotal :</span>
            <span className="royal__subtotal__amount" id="subtotalAmount">
              RS {subtotal}
            </span>
          </div>
          <button className="royal__checkout__btn" onClick={goToCheckout}>
            <span className="royal__checkout__icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0c4a6e"
                strokeWidth="3"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            Slide to Checkout Now | Rs {subtotal}
          </button>
        </div>
      </aside>
      <LogoutModal
        open={openLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default Header;
