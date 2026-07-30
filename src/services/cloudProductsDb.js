/**
 * Bloom Hand Made Gift — Universal Real-Time Cloud Product Database Service
 * Zero-config, zero-key global cloud REST storage powered by JSONBlob.
 * Ensures instant real-time synchronization between Admin Portal (Laptop) and Website (Phones, Tablets, Laptops).
 */

// Shared global cloud endpoint for Bloom luxury catalog
const GLOBAL_CLOUD_BLOB_ID = '019fb38d-708d-792f-a202-d546ff6869a5';

function getCloudUrl() {
  const customId = typeof localStorage !== 'undefined' ? localStorage.getItem('bloom_custom_blob_id') : null;
  const blobId = customId || GLOBAL_CLOUD_BLOB_ID;
  return `https://jsonblob.com/api/jsonBlob/${blobId}`;
}

/** Fetch the full product array from the global cloud database */
export async function fetchCloudProducts() {
  try {
    const url = getCloudUrl();
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.products) ? json.products : null;
  } catch (err) {
    console.warn('[CloudSync] Fetch failed, using local storage cache:', err.message);
    return null;
  }
}

/** Overwrite and publish the full product array to the global cloud database */
export async function saveCloudProducts(products) {
  if (!Array.isArray(products)) return false;

  try {
    const url = getCloudUrl();
    const payload = {
      products,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin Portal',
    };

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // If endpoint returns 404, auto-heal by initializing a fresh cloud blob
      if (res.status === 404) {
        return await initFreshCloudBlob(products);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('[CloudSync] Save failed:', err.message);
    return false;
  }
}

/** Auto-heal: Initialize a fresh global cloud blob if primary endpoint is missing */
async function initFreshCloudBlob(products) {
  try {
    const res = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ products, updatedAt: new Date().toISOString() }),
    });

    if (!res.ok) return false;
    const location = res.headers.get('location');
    if (location) {
      const parts = location.split('/');
      const newBlobId = parts[parts.length - 1];
      if (newBlobId && typeof localStorage !== 'undefined') {
        localStorage.setItem('bloom_custom_blob_id', newBlobId);
      }
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
