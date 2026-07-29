/**
 * Bloom Hand Made Gift — Cloud Product Database Service
 * Uses JSONBin.io as free, real-time cross-device JSON storage.
 * Admin uploads instantly publish to all connected devices.
 *
 * HOW IT WORKS:
 *  - All products are stored in a private JSONBin bin (cloud JSON store).
 *  - Admin CRUD operations POST/PUT to the bin via REST API.
 *  - Every customer device polls the bin every 30 seconds.
 *  - BroadcastChannel still handles same-browser real-time sync instantly.
 *  - On first load, products are fetched from cloud (fallback: localStorage seeds).
 */

const BIN_ID  = import.meta.env.VITE_JSONBIN_BIN_ID  || '';
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY  || '';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
  'X-Bin-Versioning': 'false', // overwrite instead of version
};

/** Fetch the full product array from the cloud bin */
export async function fetchCloudProducts() {
  if (!BIN_ID || !API_KEY) return null;
  try {
    const res = await fetch(`${BASE_URL}/latest`, { headers: { 'X-Master-Key': API_KEY } });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.record?.products) ? json.record.products : null;
  } catch {
    return null;
  }
}

/** Overwrite the full product array in the cloud bin */
export async function saveCloudProducts(products) {
  if (!BIN_ID || !API_KEY) return false;
  try {
    const res = await fetch(BASE_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify({ products }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Create the bin for the first time (run once from admin panel) */
export async function initCloudBin(products) {
  if (!API_KEY) return { success: false, error: 'No API key' };
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: { ...HEADERS, 'X-Bin-Name': 'bloom-products', 'X-Bin-Private': 'true' },
      body: JSON.stringify({ products }),
    });
    const json = await res.json();
    return { success: res.ok, binId: json?.metadata?.id };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
