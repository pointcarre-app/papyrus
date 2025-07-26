/**
 * Page number configuration module with default values
 */

// Default page number settings
export const DEFAULT_PAGE_NUMBER_CONFIG = {
    showPageNumbers: false
};

// Current page number configuration state
let currentPageNumberConfig = { ...DEFAULT_PAGE_NUMBER_CONFIG };

// Get current page number configuration
export function getCurrentPageNumberConfig() {
    return { ...currentPageNumberConfig };
}

// Set new page number configuration
export function setPageNumberConfig(config) {
    currentPageNumberConfig = {
        showPageNumbers: config.showPageNumbers ?? DEFAULT_PAGE_NUMBER_CONFIG.showPageNumbers
    };
    return currentPageNumberConfig;
}

// Get whether page numbers should be shown
export function getShowPageNumbers() {
    return currentPageNumberConfig.showPageNumbers;
}

// Set whether page numbers should be shown
export function setShowPageNumbers(show) {
    currentPageNumberConfig.showPageNumbers = show ?? DEFAULT_PAGE_NUMBER_CONFIG.showPageNumbers;
    return currentPageNumberConfig.showPageNumbers;
}

// Initialize page number configuration
export function initializePageNumberConfig() {
    currentPageNumberConfig = { ...DEFAULT_PAGE_NUMBER_CONFIG };
} 