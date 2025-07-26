/**
 * JSON handling utilities for content management
 */

// Get JSON from textarea
export function getJSONFromTextarea() {
    try {
        const jsonText = document.getElementById('json-input').value;
        return JSON.parse(jsonText);
    } catch (e) {
        console.error('Invalid JSON:', e);
        return [];
    }
}

// Create HTML element from JSON data
export function createElementFromJSON(jsonData, debugMode = false) {
    // Ensure that only the "html" field is required.
    // Provide sensible defaults for all other fields.
    const id = jsonData.id || `papyrus-element-${Math.random().toString(36).substr(2, 9)}`;
    const classes = jsonData.classes || [];
    const style = jsonData.style || '';

    const element = document.createElement('div');
    element.id = id;
    element.innerHTML = jsonData.html || ''; // Use empty string if html is missing
    
    if (classes.length > 0) {
        element.className = classes.join(' ');
    }
    
    if (style) {
        element.setAttribute('style', style);
    }
    
    // Apply debug styling if debug mode is enabled
    if (debugMode) {
        applyDebugStyling(element);
    } else {
        removeDebugStyling(element);
    }
    
    return element;
}

// Remove debug styling and indicators
function removeDebugStyling(element) {
    // Remove any existing height indicators
    const indicators = element.querySelectorAll('.debug-height-indicator');
    indicators.forEach(indicator => indicator.remove());
    
    // Remove outline styling
    element.style.outline = '';
    element.style.outlineOffset = '';
    
    // Restore original position if we changed it
    const originalPosition = element.getAttribute('data-original-position');
    if (originalPosition) {
        element.style.position = originalPosition === 'static' ? '' : originalPosition;
        element.removeAttribute('data-original-position');
    }
}

// Apply debug styling to element only (not children)
function applyDebugStyling(element) {
    // Use outline instead of border - doesn't affect element dimensions!
    element.style.outline = '2px solid #cc4400';
    element.style.outlineOffset = '-2px'; // Inside the element
    
    // Set position for height indicator but preserve original position
    if (!element.style.position || element.style.position === 'static') {
        element.setAttribute('data-original-position', 'static');
        element.style.position = 'relative';
    }
    
    // Add height indicator after element is rendered
    setTimeout(() => {
        addHeightIndicator(element);
    }, 10);
}

// Add height indicator to debug elements
function addHeightIndicator(element) {
    // Remove existing height indicator if any
    const existingIndicator = element.querySelector('.debug-height-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Get the actual rendered height
    const heightPx = element.offsetHeight;
    const heightMm = (heightPx / 3.78).toFixed(1); // Convert px to mm (1mm ≈ 3.78px)
    
    // Create height indicator
    const heightIndicator = document.createElement('div');
    heightIndicator.className = 'debug-height-indicator';
    heightIndicator.innerHTML = `${heightPx}px / ${heightMm}mm`;
    heightIndicator.style.cssText = `
        position: absolute;
        top: 3px;
        right: 3px;
        background: #cc4400;
        color: white;
        padding: 4px 8px;
        font-size: 11px;
        font-family: monospace;
        font-weight: bold;
        border-radius: 4px;
        z-index: 1000;
        pointer-events: none;
        line-height: 1.1;
        text-align: center;
        min-width: 45px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    
    element.appendChild(heightIndicator);
}

// Update height indicators for all debug elements
export function updateDebugHeightIndicators() {
    // Find all elements with debug height indicators
    const debugElements = document.querySelectorAll('.debug-height-indicator');
    debugElements.forEach(indicator => {
        const parentElement = indicator.parentElement;
        if (parentElement) {
            const heightPx = parentElement.offsetHeight;
            const heightMm = (heightPx / 3.78).toFixed(1); // Convert px to mm
            indicator.innerHTML = `${heightPx}px / ${heightMm}mm`;
        }
    });
} 