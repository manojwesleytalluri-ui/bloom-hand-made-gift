/**
 * Indian Postal PIN Code Lookup & Strict Bhimavaram Delivery Area Validation
 */
import { validateBhimavaramDelivery } from './bhimavaramDeliveryData';

/**
 * Validates PIN Code and checks strict Bhimavaram delivery eligibility
 * @param {string} pin - 6-digit Indian PIN Code
 * @param {string} locality - Locality / Area entered by user
 * @param {string} city - City name
 */
export function validatePinCode(pin, locality = '', city = '') {
  const result = validateBhimavaramDelivery(pin, locality, city);
  return {
    isValid: /^\d{6}$/.test(String(pin || '').trim()),
    isDeliverable: result.isEligible,
    message: result.message,
    city: result.city,
    state: result.state,
    estimatedDays: result.estimatedTime
  };
}
