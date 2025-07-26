/**
 * @module utils
 * @description Utility functions for the preview generator.
 */

export const A4_HEIGHT_MM = 297;
export const A4_WIDTH_MM = 210;
export const MM_TO_PX = 3.78;

/**
 * Creates a temporary, hidden page element for measuring content.
 * @returns {HTMLElement} The temporary page element.
 */
export function createTempMeasurePage() {
    const page = document.createElement('div');
    page.className = 'page-preview';
    page.style.position = 'absolute';
    page.style.top = '-9999px';
    page.style.left = '-9999px';
    page.style.visibility = 'hidden';
    
    const content = document.createElement('div');
    content.className = 'page-content';
    page.appendChild(content);
    
    return page;
}

/**
 * Creates a div element to represent the space between content elements.
 *
 * @param {number} spaceBetweenDivs - The height of the space in millimeters.
 * @param {boolean} debugMode - Whether to apply debug styling.
 * @returns {HTMLElement} The space div element.
 */
export function createSpaceDiv(spaceBetweenDivs, debugMode) {
    const spaceDiv = document.createElement('div');
    spaceDiv.className = 'space-between-div';
    spaceDiv.style.height = `${spaceBetweenDivs * MM_TO_PX}px`;
    spaceDiv.style.background = 'transparent';
    spaceDiv.style.margin = '0';
    spaceDiv.style.padding = '0';
    
    if (debugMode) {
        spaceDiv.style.outline = '1px dashed #cc4400';
        spaceDiv.style.outlineOffset = '-1px';
        spaceDiv.style.opacity = '0.5';
    }
    
    return spaceDiv;
}
