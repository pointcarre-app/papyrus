/**
 * @module statistics
 * @description Main entry point for the statistics module.
 * This module is responsible for calculating and displaying detailed content analysis.
 */

import { calculateTotalUsedHeight, calculateSpacingBreakdown } from './calculator.js';
import { generateDetailedTable, generatePageSummary } from './renderer.js';

/**
 * Ensures that the statistics container element exists in the DOM.
 * If it doesn't exist, it creates and injects it into a suitable location.
 * @returns {HTMLElement} The statistics container element.
 */
function ensureStatisticsContainer() {
    let container = document.getElementById('statistics-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'statistics-container';
        container.className = 'text-sm text-gray-600';
        
        const statisticsSection = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.includes('Statistics'));
        if (statisticsSection) {
            statisticsSection.parentNode.appendChild(container);
        }
    }
    return container;
}

/**
 * Updates the statistics display with the latest data.
 * It calculates various metrics and renders them as a comprehensive report.
 *
 * @param {import('./types.js').Statistics} stats - The main statistics object.
 */
export function updateStatisticsDisplay(stats) {
    const container = ensureStatisticsContainer();
    if (!container) return;

    if (!stats) {
        container.innerHTML = '<div class="text-center text-gray-500 p-4">No statistics data available.</div>';
        return;
    }

    const totalUsedHeight = calculateTotalUsedHeight(stats);
    const totalAvailableHeight = 297 * stats.totalPages;
    const utilizationPercentage = totalAvailableHeight > 0 ? Math.round((totalUsedHeight / totalAvailableHeight) * 100) : 0;

    const spacingBreakdown = calculateSpacingBreakdown(stats);
    
    const summaryHTML = `
        <div class="mb-4">
            <h4 class="font-medium text-gray-800 mb-2">Overview</h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div>📄 <strong>${stats.totalPages}</strong> page(s)</div>
                <div>📝 <strong>${stats.totalItems}</strong> element(s)</div>
                <div>📏 <strong>${totalUsedHeight.toFixed(1)}mm</strong> used</div>
                <div>📊 <strong>${spacingBreakdown.totalContentHeight.toFixed(1)}mm</strong> content</div>
            </div>
        </div>
    `;

    const pageSummaryHTML = `
        <div class="mb-4">
            <h4 class="font-medium text-gray-800 mb-2">Page Breakdown</h4>
            ${generatePageSummary(stats)}
        </div>
    `;

    const detailsHTML = `
        <div>
            <h4 class="font-medium text-gray-800 mb-2">Detailed Layout</h4>
            ${generateDetailedTable(stats)}
        </div>
    `;

    container.innerHTML = summaryHTML + pageSummaryHTML + detailsHTML;
}
