// API Service - Handles all backend API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Helper method for API calls
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // User endpoints
    async createUser(userData) {
        return this.request('/api/v2/users/create', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getUserById(userId) {
        return this.request(`/api/v2/users/${userId}`);
    }

    async getUserByEmail(email) {
        return this.request(`/api/v2/users/email/${encodeURIComponent(email)}`);
    }

    async updateUser(userId, userData) {
        return this.request(`/api/v2/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(userId) {
        return this.request(`/api/v2/users/${userId}`, {
            method: 'DELETE',
        });
    }

    // Analysis endpoints
    async saveAnalysis(analysisData) {
        return this.request('/api/v2/analysis/save', {
            method: 'POST',
            body: JSON.stringify(analysisData),
        });
    }

    async getAnalysisByUserId(userId) {
        return this.request(`/api/v2/analysis/history/${userId}`);
    }

    async getAnalysisById(analysisId) {
        return this.request(`/api/v2/analysis/${analysisId}`);
    }

    async deleteAnalysis(analysisId) {
        return this.request(`/api/v2/analysis/${analysisId}`, {
            method: 'DELETE',
        });
    }

    async deleteAllAnalysesByUserId(userId) {
        return this.request(`/api/v2/analysis/user/${userId}`, {
            method: 'DELETE',
        });
    }

    // Product endpoints
    async getProducts() {
        return this.request('/api/v2/products');
    }

    async getProductById(productId) {
        return this.request(`/api/v2/products/${productId}`);
    }

    // Article endpoints
    async getArticles() {
        return this.request('/api/v2/articles');
    }

    async getArticleById(articleId) {
        return this.request(`/api/v2/articles/${articleId}`);
    }

    // Banner endpoints
    async getBanners() {
        return this.request('/api/v2/banners');
    }

    // Chat endpoints
    async createChatSession(userId, title = 'New Chat') {
        return this.request('/api/v2/chat/sessions', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, title }),
        });
    }

    async getChatSessions(userId) {
        return this.request(`/api/v2/chat/sessions/${userId}`);
    }

    async getChatMessages(sessionId) {
        return this.request(`/api/v2/chat/messages/${sessionId}`);
    }

    async sendChatMessage(sessionId, role, content) {
        return this.request('/api/v2/chat/message', {
            method: 'POST',
            body: JSON.stringify({
                session_id: sessionId,
                role,
                content,
            }),
        });
    }

    async deleteChatSession(sessionId) {
        return this.request(`/api/v2/chat/sessions/${sessionId}`, {
            method: 'DELETE',
        });
    }

    // Admin endpoints
    async adminLogin(username, password) {
        return this.request('/api/v2/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async getAllUsers() {
        return this.request('/api/v2/admin/users');
    }

    async getAllAnalyses() {
        return this.request('/api/v2/admin/analyses');
    }

    async createProduct(productData) {
        return this.request('/api/v2/admin/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    async updateProduct(productId, productData) {
        return this.request(`/api/v2/admin/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    }

    async deleteProduct(productId) {
        return this.request(`/api/v2/admin/products/${productId}`, {
            method: 'DELETE',
        });
    }

    async createArticle(articleData) {
        return this.request('/api/v2/admin/articles', {
            method: 'POST',
            body: JSON.stringify(articleData),
        });
    }

    async updateArticle(articleId, articleData) {
        return this.request(`/api/v2/admin/articles/${articleId}`, {
            method: 'PUT',
            body: JSON.stringify(articleData),
        });
    }

    async deleteArticle(articleId) {
        return this.request(`/api/v2/admin/articles/${articleId}`, {
            method: 'DELETE',
        });
    }

    async createBanner(bannerData) {
        return this.request('/api/v2/admin/banners', {
            method: 'POST',
            body: JSON.stringify(bannerData),
        });
    }

    async updateBanner(bannerId, bannerData) {
        return this.request(`/api/v2/admin/banners/${bannerId}`, {
            method: 'PUT',
            body: JSON.stringify(bannerData),
        });
    }

    async deleteBanner(bannerId) {
        return this.request(`/api/v2/admin/banners/${bannerId}`, {
            method: 'DELETE',
        });
    }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;
