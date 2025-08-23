import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID
 * @returns {string} UUID
 */
export const generateId = () => uuidv4();

/**
 * Get current timestamp
 * @returns {number} Current timestamp in milliseconds
 */
export const getCurrentTimestamp = () => Date.now();

/**
 * Format date for display
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Format time for display
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};