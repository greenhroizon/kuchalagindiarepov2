const GUEST_CART_KEY = 'guestCartItems';
const CART_UPDATED_EVENT = 'cart-updated';

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage;

const getSnapshotId = (product) =>
  product?._id || product?.productId?._id || product?.productId || '';

export const getGuestCartItems = () => {
  if (!canUseStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(GUEST_CART_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(
      (item) => item?.productId?._id && Number(item?.quantity || 0) > 0,
    );
  } catch {
    return [];
  }
};

export const saveGuestCartItems = (items) => {
  if (!canUseStorage()) return [];

  const sanitizedItems = (Array.isArray(items) ? items : []).filter(
    (item) => item?.productId?._id && Number(item?.quantity || 0) > 0,
  );

  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(sanitizedItems));
  return sanitizedItems;
};

export const addGuestCartItem = (product, quantity = 1) => {
  const productId = getSnapshotId(product);
  if (!productId) return getGuestCartItems();

  const currentItems = getGuestCartItems();
  const existingItem = currentItems.find((item) => item.productId._id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    return saveGuestCartItems([...currentItems]);
  }

  return saveGuestCartItems([
    ...currentItems,
    {
      productId: {
        ...product,
        _id: productId,
      },
      quantity,
    },
  ]);
};

export const updateGuestCartItemQuantity = (productId, action) => {
  const nextItems = getGuestCartItems()
    .map((item) => {
      if (item.productId._id !== productId) return item;

      const nextQuantity =
        action === 'increase' ? item.quantity + 1 : item.quantity - 1;

      return {
        ...item,
        quantity: nextQuantity,
      };
    })
    .filter((item) => item.quantity > 0);

  return saveGuestCartItems(nextItems);
};

export const removeGuestCartItem = (productId) =>
  saveGuestCartItems(
    getGuestCartItems().filter((item) => item.productId._id !== productId),
  );

export const clearGuestCartItems = () => saveGuestCartItems([]);

export const dispatchCartUpdated = (detail = {}) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail,
    }),
  );
};

export { CART_UPDATED_EVENT, GUEST_CART_KEY };
