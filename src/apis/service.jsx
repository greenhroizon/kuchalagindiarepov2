import { http } from './http';
import endpoints from './endpoints';


export const loginApi = async (data) => {
  return http.post(`${endpoints.login}`, data);
};

export const googleLoginApi = async (data) => {
  return http.post(`${endpoints.googleLogin}`, data);
};

export const registerApi = async (data) => {
  return http.post(`${endpoints.register}`, data);
};

export const sendOtp = async (data) => {
  return http.post(`${endpoints.sendOtp}`, data);
};

export const forgotPasswordApi = async (data) => {
  return http.post(`${endpoints.forgotPassword}`, data);
};

export const resendSignupOtpApi = async () => {
  return http.post(endpoints.resendSignupOtp);
};

// export const verifyOtp = async (data, token) => {
//   return http.post(`${endpoints.verifyOtp}`, data, {
//     headers: {
//       Authorization: `Bearer ${token}`, 
//     },
//   });
// };

export const verifyResetOtpApi = async (data) => {
  return http.post(`${endpoints.verifyResetOtp}`, data);
};

export const resetPassword = async (data) => {
  return http.patch(`${endpoints.resetPassword}`, data);
};

export const changePasswordApi = async (data) => {
  return http.patch(`${endpoints.changePassword}`, data);
};

export const getUserProfile = async () => {
  return http.get(`${endpoints.getProfile}`);
};

export const customOrderApi = async (data) => {
  return http.post(endpoints.customOrder, data);
};

export const getCustomOrderHistory = async () => {
  return http.get(`${endpoints.customOrder}`);
};

export const aboutUsApi = async () => {
  return http.get(`${endpoints.aboutUs}`);
};

export const getAllBanners = async () => {
  return http.get(`${endpoints.banner}`);
};




export const getAllWishlist = async () => {
  return http.get(`${endpoints.wishlist}`);
};

export const addWishlist = async (productId) => {
  return http.post(`${endpoints.wishlist}`, { productId });
};

export const removeWishlist = async (productId) => {
  return http.delete(`${endpoints.wishlist}`, { productId });
};

export const getInTouchApi = async () => {
  return http.get(`${endpoints.getInTouch}`);
}



export const updateUserProfile = async (data) => {
  return http.patchFormData(`${endpoints.updateProfile}`, data);
};
export const deleteProfile = async () => {
  return http.delete(`${endpoints.deleteProfile}`);
};

export const getAllCategoriesApi = async () => {
  return http.get(`${endpoints.getAllCategories}`);
};

export const getShopByProductpi = async () => {
  return http.get(`${endpoints.shopByProd}`);
};

export const getAllOrdersApi = async () => {
  return http.get(`${endpoints.allOrders}`);
};

export const getAllProductesApi = async (queryString = '') => {
  const url = queryString
    ? `${endpoints.getAllProducts}?${queryString}`
    : endpoints.getAllProducts;

  return http.get(url);
};

export const getProductByIdApi = async (id) => {
  return http.get(`${endpoints.getProductById}/${id}`);
};

export const subscribeApi = (email) => {
  return http.post(`${endpoints.subscribe}`, email);
};

export const addUserInfoApi = async (data) => {
  return http.post(`${endpoints.addUserInfo}`, data);
};

export const getAllReelsApi = async () => {
  return http.get(`${endpoints.getAllReels}`);
};

export const addToCartApi = async (data) => {
  return http.post(`${endpoints.addToCart}`, data);
};

export const removeFromCartApi = async (id) => {
  return http.delete(`${endpoints.removeCart}/${id}`);
};

export const getCartItemsApi = async () => {
  return http.get(`${endpoints.getCartItems}`);
};

export const updateCartItemApi = async (data) => {
  return http.patch(`${endpoints.updateCart}`, data);
};

export const clearCartApi = async () => {
  return http.delete(`${endpoints.clearCart}`);
};

export const addAddressApi = async (data) => {
  return http.post(`${endpoints.address}`, data);
};

export const getAddressApi = async () => {
  return http.get(`${endpoints.address}`);
};

export const updateAddressApi = async (id, data) => {
  return http.patch(`${endpoints.address}/${id}`, data);
};

export const placeOrderApi = async (data) => {
  return http.post(`${endpoints.placeOrder}`, data);
};

export const verifyOrderApi = async (data) => {
  return http.post(`${endpoints.verifyPayment}`, data);
};

export const makePaymentApi = async (orderId, data = {}) => {
  return http.post(`${endpoints.makePayment}/${orderId}`, data);
};

export const addQueryApi = async (data) => {
  return http.post(`${endpoints.addQuery}`, data);
};



export const getProfileApi = async (id) => {
  return http.get(`${endpoints.profile}/${id}`);
};



export const applyCouponApi = async (data) => {
  return http.post(`${endpoints.applyCoupon}`, data);
};


export const updateUserProfileApi = async (id, data) => {
  return http.patch(`${endpoints.updateUserProfile}/${id}`, data);
};


export const getOffers = async () => {
  return http.get(`${endpoints.getAllOffer}`);
};

export const deleteOffer = async (id) => {
  return http.delete(`${endpoints.deleteOffer}/${id}`);
};

export const addOffer = async (data) => {
  return http.post(`${endpoints.addOffer}`, data);
};

export const updateOffer = async (id, data) => {
  return http.patch(`${endpoints.updateOffer}/${id}`, data);
};


export const staticContent = async (data) => {
  return http.get(`${endpoints.allContent}`, data);
};
