/**
 * Configurable Bhimavaram Town & Surroundings Delivery Validation Engine
 * Exclusively serves Bhimavaram Town and approved nearby localities in West Godavari, Andhra Pradesh.
 */

// Configurable List of Approved Delivery PIN Codes in Bhimavaram & Surroundings
export const BHIMAVARAM_SERVICEABLE_PINS = [
  '534201', // Bhimavaram Main Town, One Town, Two Town, Mavullamma Temple, Gunupudi, P.P. Road, Balusumoodi
  '534202', // Jnanapuram, SRKR Engineering College Road, DIR & YN College Area
  '534203', // Bhimavaram Railway Station Area, Kumudavalli
  '534204', // China Amiram, Vishnu College Campus & Bypass Road
  '534208', // Rayalam, Kovvada
  '534199', // Undi & Undi Road Area
  '534245', // Veeravasaram & Matsyapuri
];

// Configurable List of Approved Locality / Area Keywords in Bhimavaram
export const BHIMAVARAM_LOCALITIES = [
  'bhimavaram',
  'one town',
  'two town',
  'mavullamma',
  'gunupudi',
  'srkr',
  'jnanapuram',
  'china amiram',
  'amiram',
  'rayalam',
  'undi',
  'veeravasaram',
  'balusumoodi',
  'p.p. road',
  'pp road',
  'rest house road',
  'vishnu',
  'kovvada',
  'kumudavalli',
  'someswaram',
  'town hall',
  'dir & yn',
  'yn college',
  'grandhi',
  'matsyapuri',
  'bypass road'
];

/**
 * Validates whether an address or PIN code is strictly within Bhimavaram Town and approved surroundings.
 * @param {string} pinCode - 6-digit Indian PIN Code
 * @param {string} areaLocality - Customer entered area/locality name
 * @param {string} [city] - City input
 * @returns {object} Validation result with status, message, and details
 */
export function validateBhimavaramDelivery(pinCode = '', areaLocality = '', city = '') {
  const cleanPin = String(pinCode || '').trim();
  const cleanLocality = String(areaLocality || '').toLowerCase().trim();
  const cleanCity = String(city || '').toLowerCase().trim();

  // 1. PIN Code Format check (must be 6 digits)
  if (!cleanPin) {
    return {
      isEligible: false,
      message: 'PIN Code is required.',
      city: 'Bhimavaram',
      state: 'Andhra Pradesh',
      estimatedTime: ''
    };
  }

  if (!/^\d{6}$/.test(cleanPin)) {
    return {
      isEligible: false,
      message: 'PIN Code must be exactly 6 digits.',
      city: 'Bhimavaram',
      state: 'Andhra Pradesh',
      estimatedTime: ''
    };
  }

  // 2. Check if PIN Code is in Bhimavaram serviceable list
  const isPinSupported = BHIMAVARAM_SERVICEABLE_PINS.includes(cleanPin);

  // 3. Check if Locality keyword matches Bhimavaram area
  const isLocalitySupported = BHIMAVARAM_LOCALITIES.some((loc) =>
    cleanLocality.includes(loc) || cleanCity.includes(loc)
  );

  // If PIN is supported OR city/locality explicitly mentions Bhimavaram area
  if (isPinSupported || isLocalitySupported || cleanCity.includes('bhimavaram')) {
    return {
      isEligible: true,
      message: 'Great! Delivery is available at your address.',
      city: 'Bhimavaram',
      state: 'Andhra Pradesh',
      estimatedTime: 'Same-Day Hand Delivery (45–90 Mins)',
      pinCode: cleanPin || '534201'
    };
  }

  // Address is outside Bhimavaram Town & Surroundings
  return {
    isEligible: false,
    message: 'Sorry! We currently deliver only in Bhimavaram Town and nearby service areas. Delivery is not available at the entered address.',
    city: 'Outside Delivery Zone',
    state: 'Non-serviceable Region',
    estimatedTime: ''
  };
}
