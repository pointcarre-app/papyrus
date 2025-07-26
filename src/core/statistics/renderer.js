/**
 * @module renderer
 * @description HTML rendering functions for the statistics display.
 */

import { getShowPageNumbers } from '../page-number-config.js';
import { PAGE_NUMBER_TOP } from '../content-model.js';
import { getElementsForPage } from './utils.js';

/**
 * Generates an empty state table when there is no content to analyze.
 * @returns {string} HTML string for the empty table.
 */
function generateEmptyTable() {
    return `
        <div class="text-center text-gray-500 py-8">
            <div class="text-2xl mb-2">📄</div>
            <div>No content to analyze</div>
            <div class="text-xs">Load some JSON content to see statistics</div>
        </div>
    `;
}

/**
 * Generates a detailed table showing the layout of each element on every page.
 *
 * @param {import('./types.js').Statistics} stats - The main statistics object.
 * @returns {string} HTML string for the detailed breakdown table.
 */
export function generateDetailedTable(stats) {
    if (!stats || stats.totalItems === 0) {
        return generateEmptyTable();
    }

    const spaceBetweenDivs = stats.spaceBetweenDivs || 0;
    const showPageNumbers = getShowPageNumbers();
    const hasRepeatingHeader = stats.hasRepeatingHeader || false;
    const repeatingHeaderHeight = stats.repeatingHeaderHeight || 0;
    
    let bodyHTML = '';

    for (let pageNum = 1; pageNum <= stats.totalPages; pageNum++) {
        if (pageNum > 1) {
            bodyHTML += `<tr><td colspan="3" class="py-2"></td></tr>`;
        }
        
        bodyHTML += `<tr><td colspan="3" class="text-sm font-semibold bg-gray-100 px-2 py-1">📄 Page ${pageNum}</td></tr>`;
        bodyHTML += `<tr><td class="text-xs pl-4">📏 Margin Top</td><td class="text-xs font-mono text-center">${pageNum}</td><td class="text-xs font-mono text-center">${stats.margins.top}mm</td></tr>`;
        
        if (showPageNumbers) {
            bodyHTML += `<tr><td class="text-xs text-purple-600 pl-4">📝 Page Number</td><td class="text-xs font-mono text-center text-purple-600">${pageNum}</td><td class="text-xs font-mono text-center text-purple-600">${PAGE_NUMBER_TOP.heightMm.toFixed(1)}mm</td></tr>`;
        }

        if (hasRepeatingHeader && repeatingHeaderHeight > 0) {
            bodyHTML += `<tr><td class="text-xs text-blue-600 pl-4">📋 Header (repeats)</td><td class="text-xs font-mono text-center text-blue-600">${pageNum}</td><td class="text-xs font-mono text-center text-blue-600">${repeatingHeaderHeight.toFixed(1)}mm</td></tr>`;
            
            const pageElements = getElementsForPage(pageNum, stats);
            if (pageElements.length > 0 && spaceBetweenDivs > 0) {
                bodyHTML += `<tr><td class="text-xs text-orange-600 pl-6">↳ Space after header</td><td class="text-xs font-mono text-center text-orange-600">${pageNum}</td><td class="text-xs font-mono text-center text-orange-600">${spaceBetweenDivs.toFixed(1)}mm</td></tr>`;
            }
        }

        const pageElements = getElementsForPage(pageNum, stats);
        pageElements.forEach((element, indexOnPage) => {
            const contentHeight = element.heightMm || 0;
            const elementNumber = element.originalIndex + 1;
            
            if (indexOnPage > 0 && spaceBetweenDivs > 0) {
                bodyHTML += `<tr><td class="text-xs text-orange-600 pl-6">↳ Space</td><td class="text-xs font-mono text-center text-orange-600">${pageNum}</td><td class="text-xs font-mono text-center text-orange-600">${spaceBetweenDivs.toFixed(1)}mm</td></tr>`;
            }
            
            const isHeader = hasRepeatingHeader && element.originalIndex === 0;
            if (!isHeader) {
                bodyHTML += `<tr><td class="text-xs pl-4">📝 Element ${elementNumber}</td><td class="text-xs font-mono text-center">${pageNum}</td><td class="text-xs font-mono text-center">${contentHeight.toFixed(1)}mm</td></tr>`;
            }
        });
        
        bodyHTML += `<tr><td class="text-xs pl-4">📏 Margin Bottom</td><td class="text-xs font-mono text-center">${pageNum}</td><td class="text-xs font-mono text-center">${stats.margins.bottom}mm</td></tr>`;
    }

    return `
        <div class="overflow-x-auto max-h-80 overflow-y-auto">
            <table class="table table-xs w-full">
                <thead class="bg-gray-50 sticky top-0">
                    <tr>
                        <th class="text-xs text-left">Element</th>
                        <th class="text-xs text-center">Page</th>
                        <th class="text-xs text-center">Height</th>
                    </tr>
                </thead>
                <tbody>${bodyHTML}</tbody>
            </table>
        </div>
    `;
}

/**
 * Generates a summary for each page, including utilization and content stats.
 *
 * @param {import('./types.js').Statistics} stats - The main statistics object.
 * @returns {string} HTML string for the page summary section.
 */
export function generatePageSummary(stats) {
    if (!stats || stats.totalPages === 0) {
        return '<div class="text-center text-gray-500">No pages generated</div>';
    }
    
    const usableHeight = 297 - stats.margins.top - stats.margins.bottom - (getShowPageNumbers() ? 8 : 0);
    
    let summaryHTML = '';
    
    for (let pageNum = 1; pageNum <= stats.totalPages; pageNum++) {
        const pageElements = getElementsForPage(pageNum, stats);
        const elementCount = pageElements.length;
        const contentHeight = pageElements.reduce((sum, el) => sum + (el.heightMm || 0), 0);
        
        let spacingHeight = 0;
        if (stats.hasRepeatingHeader && pageElements.length > 0 && stats.spaceBetweenDivs > 0) {
            spacingHeight += stats.spaceBetweenDivs;
        }
        if (pageElements.length > 1 && stats.spaceBetweenDivs > 0) {
            spacingHeight += (pageElements.length - 1) * stats.spaceBetweenDivs;
        }
        
        const totalUsed = contentHeight + spacingHeight + (stats.hasRepeatingHeader ? stats.repeatingHeaderHeight : 0);
        const utilization = Math.round((totalUsed / usableHeight) * 100);
        
        summaryHTML += `
            <div class="bg-white rounded-lg p-3 border">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium">Page ${pageNum}</span>
                    <span class="text-xs px-2 py-1 rounded ${utilization > 90 ? 'bg-red-100 text-red-700' : utilization > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">${utilization}%</span>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                    <div>📝 ${elementCount} element${elementCount !== 1 ? 's' : ''}</div>
                    <div>📏 ${totalUsed.toFixed(1)}mm / ${usableHeight.toFixed(1)}mm</div>
                </div>
            </div>
        `;
    }
    
    return `<div class="grid grid-cols-2 gap-2">${summaryHTML}</div>`;
}
