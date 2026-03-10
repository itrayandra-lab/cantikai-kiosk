/**
 * Token System for Analysis & Chat
 * Guest: 3 analysis/day, 5 chat messages/day
 * Logged in: Unlimited
 */

const TOKEN_LIMITS = {
    guest: {
        analysis: 3,        // 3 analisis per hari
        chat: 5,            // 5 chat messages per hari
        resetHours: 24      // Reset setiap 24 jam
    },
    user: {
        analysis: Infinity, // Unlimited
        chat: Infinity      // Unlimited
    }
};

// Get token key for today
const getTodayKey = (type) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `token_${type}_${today}`;
};

// Get token usage for today
export const getTokenUsage = (type = 'analysis') => {
    const key = getTodayKey(type);
    const data = localStorage.getItem(key);
    
    if (!data) {
        return { count: 0, lastReset: new Date().toISOString() };
    }
    
    try {
        return JSON.parse(data);
    } catch {
        return { count: 0, lastReset: new Date().toISOString() };
    }
};

// Increment token usage
export const useToken = (type = 'analysis') => {
    const key = getTodayKey(type);
    const usage = getTokenUsage(type);
    
    const newUsage = {
        count: usage.count + 1,
        lastReset: usage.lastReset || new Date().toISOString()
    };
    
    localStorage.setItem(key, JSON.stringify(newUsage));
    return newUsage;
};

// Check if user has tokens available
export const hasTokensAvailable = (type = 'analysis', isGuest = true) => {
    // Logged in users have unlimited tokens
    if (!isGuest) {
        return { available: true, remaining: Infinity, limit: Infinity };
    }
    
    const usage = getTokenUsage(type);
    const limit = TOKEN_LIMITS.guest[type];
    const remaining = Math.max(0, limit - usage.count);
    
    return {
        available: remaining > 0,
        remaining,
        limit,
        used: usage.count
    };
};

// Get token info for display
export const getTokenInfo = (type = 'analysis', isGuest = true) => {
    if (!isGuest) {
        return {
            available: true,
            remaining: '∞',
            limit: '∞',
            used: 0,
            message: 'Unlimited'
        };
    }
    
    const info = hasTokensAvailable(type, isGuest);
    
    return {
        ...info,
        message: info.available 
            ? `${info.remaining} dari ${info.limit} tersisa hari ini`
            : `Limit tercapai. Reset dalam ${getHoursUntilReset()} jam`
    };
};

// Get hours until token reset
export const getHoursUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    
    return hours;
};

// Clean old token data (run on app start)
export const cleanOldTokens = () => {
    const today = new Date().toISOString().split('T')[0];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
        if (key.startsWith('token_') && !key.includes(today)) {
            localStorage.removeItem(key);
        }
    });
};

// Check and use token (combined check + use)
export const checkAndUseToken = (type = 'analysis', isGuest = true) => {
    const info = hasTokensAvailable(type, isGuest);
    
    if (!info.available) {
        return {
            success: false,
            message: `Limit ${type} tercapai untuk hari ini. ${isGuest ? 'Login untuk unlimited access!' : 'Coba lagi besok.'}`,
            info
        };
    }
    
    // Use token
    const newUsage = useToken(type);
    const newInfo = hasTokensAvailable(type, isGuest);
    
    return {
        success: true,
        message: `Token digunakan. ${newInfo.remaining} tersisa.`,
        info: newInfo,
        usage: newUsage
    };
};

export default {
    getTokenUsage,
    useToken,
    hasTokensAvailable,
    getTokenInfo,
    checkAndUseToken,
    cleanOldTokens,
    TOKEN_LIMITS
};
