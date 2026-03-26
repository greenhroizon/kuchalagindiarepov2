const GUEST_WISHLIST_KEY = 'guestWishlistProductIds';
const WISHLIST_UPDATED_EVENT = 'wishlist-updated';

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage;

export const getGuestWishlistIds = () => {
  if (!canUseStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(GUEST_WISHLIST_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter((item) => typeof item === 'string' && item.trim());
  } catch {
    return [];
  }
};

export const saveGuestWishlistIds = (productIds) => {
  if (!canUseStorage()) return [];

  const uniqueIds = Array.from(
    new Set(
      (Array.isArray(productIds) ? productIds : []).filter(
        (item) => typeof item === 'string' && item.trim(),
      ),
    ),
  );

  window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(uniqueIds));
  return uniqueIds;
};

export const addGuestWishlistId = (productId) => {
  const nextIds = saveGuestWishlistIds([...getGuestWishlistIds(), productId]);
  return nextIds;
};

export const removeGuestWishlistId = (productId) => {
  const nextIds = saveGuestWishlistIds(
    getGuestWishlistIds().filter((item) => item !== productId),
  );
  return nextIds;
};

export const dispatchWishlistUpdated = (detail = {}) => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(WISHLIST_UPDATED_EVENT, {
      detail,
    }),
  );
};

export { GUEST_WISHLIST_KEY, WISHLIST_UPDATED_EVENT };
