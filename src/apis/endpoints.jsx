const endpoints = {
  auth: "login",

  register: "register",

  login: "login",
  googleLogin: "google-login",
  sendOtp: "sendOtp",
  forgotPassword: "forgot-password",
  resendSignupOtp: "resend-signup-otp",
  verifyOtp: "/verify-otp",
  resetPassword: "reset-password",
  verifyResetOtp: "/verify-reset-otp",

  banner:"get-all-banners",

  getProfile: "get-profile",
  updateProfile: "upadate-profile",

  customOrder:"/custom-order",


  aboutUs:"about-us",
  
  deleteProfile: "delete-account",

  changePassword: "change-password",

  allContent: "get-all-content",

  applyCoupon: "validate-coupon",
 

  getFaqs: "get-all-faq",
  editFaqs: "update-faq",
  deleteFaqs: "delete-faq",
  addFaq: "add-faq",

  getDetails: "get-detail",
  updateDetails: "update-detail",
  addDetails: "add-detail",

  getQueries: "get-all-queries",

  getAllCategories: "get-shop-by-func-categories",


  shopByProd:"get-shop-by-prod-categories",

  wishlist:"wishlist",




  getAllProducts: "get-all-products",
  getProductById: "get-product-by-id",

  allOrders: "orders/me",

  subscribe: "add-newsletter",
  addUserInfo: "add-user-info",

  addQuery: "add-query",

  getAllReels: "get-all-reels",

  getInTouch:"get-in-touch",

  addToCart: "cart/add",
  removeCart: "cart/remove",
  clearCart: "cart/clear",
  updateCart: "cart/update",
  getCartItems: "cart",

  address: "address",
  placeOrder: "order/create",
  verifyPayment: "verify-payment",
  makePayment: "payment/create",


  addProject: "add-product",
  deleteProject: "delete-product",
  updateProject: "update-product",
  getAllProjects: "get-all-product",

  

  getAllUser: "get-all-users",
  deactivate: "delete-user",
  updateUserProfile: "update-user",


  getAllOffer: "get-all-offer",
  addOffer: "create-offer",
  deleteOffer: "delete-offer",
  updateOffer: "update-offer",

 
 

  getAllPayments: "get-all-payments",




  getSupportTickets: "get-support-ticket",
  updateStatus: "update-support-ticket",
};

export default endpoints;
