import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Store intended destination for redirect after login
        sessionStorage.setItem('redirect_after_login', window.location.pathname);
        return <Navigate to="/login" replace />;
    }
    
    // User is logged in, render the protected component
    return children;
};

export default ProtectedRoute;
