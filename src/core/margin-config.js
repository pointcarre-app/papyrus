/**
 * Margin configuration module with default values
 */

// Default margin values in mm
export const DEFAULT_MARGINS = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
};

// Default spacing between divs in mm
export const DEFAULT_SPACE_BETWEEN_DIVS = 3;

// Current margin and spacing state
let currentMargins = { ...DEFAULT_MARGINS };
let currentSpaceBetweenDivs = DEFAULT_SPACE_BETWEEN_DIVS;

// Get current margins
export function getCurrentMargins() {
    return { ...currentMargins };
}

// Get current space between divs
export function getCurrentSpaceBetweenDivs() {
    return currentSpaceBetweenDivs;
}

// Set new margins
export function setMargins(margins) {
    currentMargins = {
        top: margins.top || DEFAULT_MARGINS.top,
        right: margins.right || DEFAULT_MARGINS.right,
        bottom: margins.bottom || DEFAULT_MARGINS.bottom,
        left: margins.left || DEFAULT_MARGINS.left
    };
    updateCSSVariables();
    return currentMargins;
}

// Set space between divs
export function setSpaceBetweenDivs(space) {
    currentSpaceBetweenDivs = space ?? DEFAULT_SPACE_BETWEEN_DIVS;
    return currentSpaceBetweenDivs;
}

// Update CSS variables with current margins
export function updateCSSVariables() {
    const root = document.documentElement;
    root.style.setProperty('--page-margin-top', `${currentMargins.top}mm`);
    root.style.setProperty('--page-margin-right', `${currentMargins.right}mm`);
    root.style.setProperty('--page-margin-bottom', `${currentMargins.bottom}mm`);
    root.style.setProperty('--page-margin-left', `${currentMargins.left}mm`);
    
    // Update content dimensions
    const contentWidth = 210 - currentMargins.left - currentMargins.right;
    const contentHeight = 297 - currentMargins.top - currentMargins.bottom;
    
    root.style.setProperty('--content-width', `${contentWidth}mm`);
    root.style.setProperty('--content-height', `${contentHeight}mm`);
    root.style.setProperty('--content-width-px', `${contentWidth * 3.78}px`);
    root.style.setProperty('--content-height-px', `${contentHeight * 3.78}px`);
}

// Initialize margins on load
export function initializeMargins() {
    updateCSSVariables();
}

// Initialize space between divs
export function initializeSpaceBetweenDivs() {
    currentSpaceBetweenDivs = DEFAULT_SPACE_BETWEEN_DIVS;
} 