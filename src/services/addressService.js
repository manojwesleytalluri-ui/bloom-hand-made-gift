/**
 * addressService.js - Service layer for user persistent address management.
 * Simulates REST API endpoints for addresses backed by per-user localStorage storage.
 */

const STORAGE_PREFIX = 'bloom_addresses_';

/** Get storage key for a specific user email */
const getStorageKey = (userEmail) => {
  if (!userEmail) return null;
  return `${STORAGE_PREFIX}${userEmail.trim().toLowerCase()}`;
};

/**
 * GET /addresses
 * Fetch all saved addresses for current user
 */
export const getAddresses = (userEmail) => {
  const key = getStorageKey(userEmail);
  if (!key) return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error fetching user addresses:', e);
    return [];
  }
};

/**
 * GET /addresses/default
 * Get default address for current user
 */
export const getDefaultAddress = (userEmail) => {
  const addresses = getAddresses(userEmail);
  if (!addresses.length) return null;
  const defaultAddr = addresses.find((a) => a.isDefault);
  return defaultAddr || addresses[0];
};

/**
 * POST /addresses
 * Save new address for current user
 */
export const saveAddress = (userEmail, addressData) => {
  const key = getStorageKey(userEmail);
  if (!key) throw new Error('User authentication required');

  const addresses = getAddresses(userEmail);
  const now = new Date().toISOString();

  // If this is the first address, or isDefault is true, set it as default
  const isFirst = addresses.length === 0;
  const shouldBeDefault = addressData.isDefault || isFirst;

  const newAddress = {
    addressId: addressData.addressId || `addr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId: userEmail,
    fullName: (addressData.fullName || '').trim(),
    phone: (addressData.phone || addressData.mobileNumber || '').trim(),
    alternatePhone: (addressData.alternatePhone || '').trim(),
    houseNumber: (addressData.houseNumber || addressData.houseNo || '').trim(),
    street: (addressData.street || '').trim(),
    landmark: (addressData.landmark || '').trim(),
    area: (addressData.area || addressData.locality || '').trim(),
    city: (addressData.city || '').trim(),
    district: (addressData.district || '').trim(),
    state: (addressData.state || '').trim(),
    country: addressData.country || 'India',
    pinCode: (addressData.pinCode || '').trim(),
    addressType: addressData.addressType || 'Home', // Home | Office | Other
    isDefault: shouldBeDefault,
    createdAt: now,
    updatedAt: now,
  };

  let updatedList = addresses;
  if (shouldBeDefault) {
    // Unset default flag on all existing addresses
    updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
  }

  updatedList = [newAddress, ...updatedList];
  localStorage.setItem(key, JSON.stringify(updatedList));
  return { success: true, address: newAddress, addresses: updatedList };
};

/**
 * PUT /addresses/:id
 * Update existing address
 */
export const updateAddress = (userEmail, addressId, updatedFields) => {
  const key = getStorageKey(userEmail);
  if (!key) throw new Error('User authentication required');

  const addresses = getAddresses(userEmail);
  const now = new Date().toISOString();

  let updatedAddress = null;

  let updatedList = addresses.map((addr) => {
    if (addr.addressId === addressId) {
      const isDefault = updatedFields.isDefault !== undefined ? updatedFields.isDefault : addr.isDefault;
      updatedAddress = {
        ...addr,
        fullName: updatedFields.fullName !== undefined ? updatedFields.fullName.trim() : addr.fullName,
        phone: updatedFields.phone !== undefined ? updatedFields.phone.trim() : (updatedFields.mobileNumber ? updatedFields.mobileNumber.trim() : addr.phone),
        alternatePhone: updatedFields.alternatePhone !== undefined ? updatedFields.alternatePhone.trim() : addr.alternatePhone,
        houseNumber: updatedFields.houseNumber !== undefined ? updatedFields.houseNumber.trim() : (updatedFields.houseNo ? updatedFields.houseNo.trim() : addr.houseNumber),
        street: updatedFields.street !== undefined ? updatedFields.street.trim() : addr.street,
        landmark: updatedFields.landmark !== undefined ? updatedFields.landmark.trim() : addr.landmark,
        area: updatedFields.area !== undefined ? updatedFields.area.trim() : (updatedFields.locality ? updatedFields.locality.trim() : addr.area),
        city: updatedFields.city !== undefined ? updatedFields.city.trim() : addr.city,
        district: updatedFields.district !== undefined ? updatedFields.district.trim() : addr.district,
        state: updatedFields.state !== undefined ? updatedFields.state.trim() : addr.state,
        country: updatedFields.country !== undefined ? updatedFields.country : addr.country,
        pinCode: updatedFields.pinCode !== undefined ? updatedFields.pinCode.trim() : addr.pinCode,
        addressType: updatedFields.addressType || addr.addressType,
        isDefault: isDefault,
        updatedAt: now,
      };
      return updatedAddress;
    }
    return addr;
  });

  if (updatedFields.isDefault) {
    // Make sure other addresses are not default
    updatedList = updatedList.map((a) =>
      a.addressId === addressId ? a : { ...a, isDefault: false }
    );
  }

  localStorage.setItem(key, JSON.stringify(updatedList));
  return { success: true, address: updatedAddress, addresses: updatedList };
};

/**
 * DELETE /addresses/:id
 * Delete address for current user
 */
export const deleteAddress = (userEmail, addressId) => {
  const key = getStorageKey(userEmail);
  if (!key) throw new Error('User authentication required');

  const addresses = getAddresses(userEmail);
  const target = addresses.find((a) => a.addressId === addressId);
  let updatedList = addresses.filter((a) => a.addressId !== addressId);

  // If deleted address was default and remaining addresses exist, set first remaining as default
  if (target?.isDefault && updatedList.length > 0) {
    updatedList[0] = { ...updatedList[0], isDefault: true, updatedAt: new Date().toISOString() };
  }

  localStorage.setItem(key, JSON.stringify(updatedList));
  return { success: true, addresses: updatedList };
};

/**
 * PATCH /addresses/:id/default
 * Set address as default
 */
export const setDefaultAddress = (userEmail, addressId) => {
  const key = getStorageKey(userEmail);
  if (!key) throw new Error('User authentication required');

  const addresses = getAddresses(userEmail);
  const now = new Date().toISOString();

  const updatedList = addresses.map((a) => ({
    ...a,
    isDefault: a.addressId === addressId,
    updatedAt: a.addressId === addressId ? now : a.updatedAt,
  }));

  localStorage.setItem(key, JSON.stringify(updatedList));
  return { success: true, addresses: updatedList };
};
