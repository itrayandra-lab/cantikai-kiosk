const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.payload = options.payload;
    this.code = options.code || null;
    this.retryAfterMs = options.retryAfterMs || 0;
  }
}

async function parseResponseBody(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(body.error || body.message || `HTTP ${response.status}`, {
      status: response.status,
      payload: body,
      code: body.code,
      retryAfterMs: Number(body.retry_after_ms || 0)
    });
  }

  return body;
}

const kioskApi = {
  startSession(payload) {
    return request('/api/v2/kiosk/sessions/start', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  analyzeSession(sessionUuid, payload) {
    return request(`/api/v2/kiosk/sessions/${encodeURIComponent(sessionUuid)}/analyze`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getSessionResult(sessionUuid) {
    return request(`/api/v2/kiosk/sessions/${encodeURIComponent(sessionUuid)}/result`, {
      method: 'GET'
    });
  },

  closeSession(sessionUuid) {
    return request(`/api/v2/kiosk/sessions/${encodeURIComponent(sessionUuid)}/close`, {
      method: 'POST'
    });
  },

  getSystemHealth(deviceId = '') {
    const suffix = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : '';
    return request(`/api/v2/kiosk/system/health${suffix}`);
  }
};

export { ApiError };
export default kioskApi;
