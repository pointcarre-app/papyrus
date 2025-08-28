/**
 * Font size configuration module with default values
 */

// Default font sizes in px
export const DEFAULT_FONT_SIZES = {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body: 16
};

// Current font size state
let currentFontSizes = { ...DEFAULT_FONT_SIZES };

// Get current font sizes
export function getCurrentFontSizes() {
    return { ...currentFontSizes };
}

// Set new font sizes
export function setFontSizes(fontSizes) {
    currentFontSizes = {
        h1: fontSizes.h1 || DEFAULT_FONT_SIZES.h1,
        h2: fontSizes.h2 || DEFAULT_FONT_SIZES.h2,
        h3: fontSizes.h3 || DEFAULT_FONT_SIZES.h3,
        h4: fontSizes.h4 || DEFAULT_FONT_SIZES.h4,
        h5: fontSizes.h5 || DEFAULT_FONT_SIZES.h5,
        h6: fontSizes.h6 || DEFAULT_FONT_SIZES.h6,
        body: fontSizes.body || DEFAULT_FONT_SIZES.body
    };
    updateFontCSSVariables();
    return currentFontSizes;
}

// Update CSS variables with current font sizes
export function updateFontCSSVariables() {
    const root = document.documentElement;
    
    // Set heading font sizes
    root.style.setProperty('--font-size-h1', `${currentFontSizes.h1}px`);
    root.style.setProperty('--font-size-h2', `${currentFontSizes.h2}px`);
    root.style.setProperty('--font-size-h3', `${currentFontSizes.h3}px`);
    root.style.setProperty('--font-size-h4', `${currentFontSizes.h4}px`);
    root.style.setProperty('--font-size-h5', `${currentFontSizes.h5}px`);
    root.style.setProperty('--font-size-h6', `${currentFontSizes.h6}px`);
    
    // Set body font size
    root.style.setProperty('--font-size-body', `${currentFontSizes.body}px`);
}

// Initialize font sizes on load
export function initializeFontSizes() {
    updateFontCSSVariables();
} 