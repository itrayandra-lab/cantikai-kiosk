const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || err.message || `HTTP ${response.status}`);
  }

  return response.json();
}

const desktopApi = {
  getBanners() {
    return request('/api/v2/banners');
  },

  getProducts() {
    return request('/api/v2/products');
  },

  getArticles() {
    return request('/api/v2/articles');
  },

  analyzeImage(imageBase64) {
    return request('/api/v2/public/analyze', {
      method: 'POST',
      body: JSON.stringify({ image_base64: imageBase64, mode: 'desktop' })
    });
  },

  async getOrCreateDesktopUser() {
    const storedId = localStorage.getItem('cantik_desktop_user_id');
    if (storedId) {
      return Number(storedId);
    }

    const stamp = Date.now();
    const user = await request('/api/v2/users/create', {
      method: 'POST',
      body: JSON.stringify({
        email: `desktop_${stamp}@cantik.ai`,
        name: `Desktop ${stamp}`,
        gender: 'other',
        skin_type: 'normal'
      })
    });

    localStorage.setItem('cantik_desktop_user_id', String(user.id));
    return Number(user.id);
  },

  saveAnalysis(payload) {
    return request('/api/v2/analysis/save', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export default desktopApi;
