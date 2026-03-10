/**
 * Authentication Utilities
 * Handles user authentication state, token persistence, and guest sessions.
 */

const STORAGE_KEYS = {
    userId: 'cantik_user_id',
    email: 'cantik_user_email',
    name: 'cantik_user_name',
    avatar: 'cantik_user_avatar',
    isGuest: 'cantik_is_guest',
    authToken: 'cantik_auth_token'
};

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.authToken);

export const setAuthToken = (token) => {
    if (!token) return;
    localStorage.setItem(STORAGE_KEYS.authToken, token);
};

// Check if user is logged in
export const isAuthenticated = () => {
    const userId = localStorage.getItem(STORAGE_KEYS.userId);
    const userEmail = localStorage.getItem(STORAGE_KEYS.email);
    const token = getAuthToken();
    return !!(userId && userEmail && userEmail !== 'guest' && token);
};

// Get current user ID (guest or logged in)
export const getCurrentUserId = () => localStorage.getItem(STORAGE_KEYS.userId);

// Get current user email
export const getCurrentUserEmail = () => localStorage.getItem(STORAGE_KEYS.email);

// Check if current session is guest
export const isGuestSession = () => {
    const email = getCurrentUserEmail();
    return !email || email === 'guest' || email.includes('guest_');
};

// Create guest session (temporary, no DB account binding)
export const createGuestSession = () => {
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.userId, guestId);
    localStorage.setItem(STORAGE_KEYS.email, 'guest');
    localStorage.setItem(STORAGE_KEYS.name, 'Guest');
    localStorage.setItem(STORAGE_KEYS.isGuest, 'true');
    localStorage.removeItem(STORAGE_KEYS.authToken);
    return guestId;
};

// Login user using auth payload ({ user, token }) or user object
export const loginUser = (authPayload) => {
    const user = authPayload?.user || authPayload || {};
    const token = authPayload?.token;

    if (user?.id !== undefined && user?.id !== null) {
        localStorage.setItem(STORAGE_KEYS.userId, user.id.toString());
    }
    if (user?.email) {
        localStorage.setItem(STORAGE_KEYS.email, user.email);
    }
    localStorage.setItem(STORAGE_KEYS.name, user?.name || 'User');
    if (user?.avatar_url) {
        localStorage.setItem(STORAGE_KEYS.avatar, user.avatar_url);
    }
    if (token) {
        localStorage.setItem(STORAGE_KEYS.authToken, token);
    }
    localStorage.removeItem(STORAGE_KEYS.isGuest);
};

// Logout user
export const logoutUser = () => {
    const guestData = {
        lastAnalysis: localStorage.getItem('lastAnalysis'),
        lastSkinScore: localStorage.getItem('lastSkinScore')
    };

    localStorage.removeItem(STORAGE_KEYS.userId);
    localStorage.removeItem(STORAGE_KEYS.email);
    localStorage.removeItem(STORAGE_KEYS.name);
    localStorage.removeItem(STORAGE_KEYS.avatar);
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.isGuest);

    if (guestData.lastAnalysis) localStorage.setItem('lastAnalysis', guestData.lastAnalysis);
    if (guestData.lastSkinScore) localStorage.setItem('lastSkinScore', guestData.lastSkinScore);
};

// Get user info
export const getUserInfo = () => ({
    id: getCurrentUserId(),
    email: getCurrentUserEmail(),
    name: localStorage.getItem(STORAGE_KEYS.name) || 'Guest',
    avatar: localStorage.getItem(STORAGE_KEYS.avatar),
    token: getAuthToken(),
    isGuest: isGuestSession(),
    isAuthenticated: isAuthenticated()
});

// Prompt user to login with message
export const promptLogin = (message = 'Silakan login untuk mengakses fitur ini') => {
    return window.confirm(`${message}\n\nLogin sekarang?`);
};

// Store temporary analysis for guest (in sessionStorage)
export const storeGuestAnalysis = (analysisData) => {
    sessionStorage.setItem('guest_analysis', JSON.stringify(analysisData));
};

// Get guest analysis
export const getGuestAnalysis = () => {
    const data = sessionStorage.getItem('guest_analysis');
    return data ? JSON.parse(data) : null;
};

// Clear guest analysis
export const clearGuestAnalysis = () => {
    sessionStorage.removeItem('guest_analysis');
};
