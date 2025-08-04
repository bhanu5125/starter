/**
 * Authentication utility functions
 */

/**
 * Check if the current user is an admin
 * @returns {boolean} True if the user is an admin, false otherwise
 */
export const isAdmin = () => {
    // Get the username from localStorage
    const username = localStorage.getItem('username');
    
    // Check if the username is 'sadmin' (case-insensitive)
    return username && username.toLowerCase() === 'sadmin';
};

/**
 * Get the current user's information
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
};
