/**
 * @module calculator
 * @description Calculation functions for the statistics module.
 */

import { getShowPageNumbers } from '../page-number-config.js';
import { PAGE_NUMBER_TOP } from '../content-model.js';
import { getElementsForPage } from './utils.js';

/**
 * Calculates a comprehensive breakdown of spacing within the document,
 * including header spacing, element spacing, and total content height.
 *
 * @param {import('./types.js').Statistics} stats - The main statistics object.
 * @returns {import('./types.js').SpacingBreakdown} An object containing the detailed spacing breakdown.
 */
export function calculateSpacingBreakdown(stats) {
    if (!stats || !stats.margins) {
        return { totalSpacing: 0, headerSpacing: 0, elementSpacing: 0, totalContentHeight: 0 };
    }
    
    const contentModel = window.contentModel;
    if (!contentModel || !contentModel.items) {
        return { totalSpacing: 0, headerSpacing: 0, elementSpacing: 0, totalContentHeight: 0 };
    }
    
    const totalContentHeight = contentModel.items.reduce((sum, item) => sum + (item.heightMm || 0), 0);
    const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
    
    const regularElementCount = stats.hasRepeatingHeader ? Math.max(0, contentModel.items.length - 1) : contentModel.items.length;
    const elementSpacingInstances = Math.max(0, regularElementCount - 1);
    const elementSpacing = elementSpacingInstances * spaceBetweenDivs;
    
    let headerSpacing = 0;
    if (stats.hasRepeatingHeader && stats.totalPages > 0) {
        for (let page = 1; page <= stats.totalPages; page++) {
            const pageElements = getElementsForPage(page, stats);
            if (pageElements.length > 0) {
                headerSpacing += spaceBetweenDivs;
            }
        }
    }
    
    const totalSpacing = elementSpacing + headerSpacing;
    
    return { totalSpacing, headerSpacing, elementSpacing, totalContentHeight };
}

/**
 * Calculates the total vertical height used by all content and structural elements,
 * including margins, content, spacing, and page numbers.
 *
 * @param {import('./types.js').Statistics} stats - The main statistics object.
 * @returns {number} The total used height in millimeters.
 */
export function calculateTotalUsedHeight(stats) {
    if (!stats || !stats.margins) {
        return 0;
    }
    
    const contentModel = window.contentModel;
    if (!contentModel || !contentModel.items) {
        const pageNumberTopHeight = (typeof getShowPageNumbers === 'function' && getShowPageNumbers()) ? PAGE_NUMBER_TOP.heightMm : 0;
        return stats.margins.top + stats.margins.bottom + pageNumberTopHeight;
    }
    
    const contentHeight = contentModel.items.reduce((sum, item) => sum + (item.heightMm || 0), 0);
    const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
    const numberOfSpaces = Math.max(0, contentModel.items.length - 1);
    const totalSpacing = numberOfSpaces * spaceBetweenDivs;
    const pageNumberTopHeight = (typeof getShowPageNumbers === 'function' && getShowPageNumbers()) ? PAGE_NUMBER_TOP.heightMm : 0;
    
    return stats.margins.top + contentHeight + totalSpacing + stats.margins.bottom + pageNumberTopHeight;
}
