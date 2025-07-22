/**
 * Statistics Display - Shows detailed content analysis and per-page breakdown
 */

import { getShowPageNumbers } from './page-number-config.js';
import { PAGE_NUMBER_TOP } from './content-model.js';

// Calculate comprehensive spacing breakdown
function calculateSpacingBreakdown(stats) {
    if (!stats || !stats.margins) {
        return {
            totalSpacing: 0,
            headerSpacing: 0,
            elementSpacing: 0,
            totalContentHeight: 0
        };
    }
    
    const contentModel = window.contentModel;
    if (!contentModel || !contentModel.items) {
        return {
            totalSpacing: 0,
            headerSpacing: 0,
            elementSpacing: 0,
            totalContentHeight: 0
        };
    }
    
    // Calculate pure content height (without any spacing)
    const totalContentHeight = contentModel.items.reduce((sum, item) => sum + (item.heightMm || 0), 0);
    
    // Calculate spacing between regular elements
    const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
    const regularElementCount = stats.hasRepeatingHeader ? Math.max(0, contentModel.items.length - 1) : contentModel.items.length;
    const elementSpacingInstances = Math.max(0, regularElementCount - 1);
    const elementSpacing = elementSpacingInstances * spaceBetweenDivs;
    
    // Calculate header-related spacing (space after header on each page)
    let headerSpacing = 0;
    if (stats.hasRepeatingHeader && stats.totalPages > 0) {
        // Header appears on each page, and if there are content elements, add space after header
        for (let page = 1; page <= stats.totalPages; page++) {
            const pageElements = getElementsForPage(page, stats);
            if (pageElements.length > 0) {  // If there are content elements after header
                headerSpacing += spaceBetweenDivs;
            }
        }
    }
    
    const totalSpacing = elementSpacing + headerSpacing;
    
    return {
        totalSpacing,
        headerSpacing,
        elementSpacing,
        totalContentHeight
    };
}

// Calculate total height used including margins, content, and spacing
function calculateTotalUsedHeight(stats) {
    if (!stats || !stats.margins) {
        return 0;
    }
    
    const contentModel = window.contentModel;
    if (!contentModel || !contentModel.items) {
        const pageNumberTopHeight = (typeof getShowPageNumbers === 'function' && getShowPageNumbers()) ? PAGE_NUMBER_TOP.heightMm : 0;
        return stats.margins.top + stats.margins.bottom + pageNumberTopHeight;
    }
    
    // Sum up all content heights
    const contentHeight = contentModel.items.reduce((sum, item) => sum + (item.heightMm || 0), 0);
    
    // Add spacing between elements
    const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
    const numberOfSpaces = Math.max(0, contentModel.items.length - 1);
    const totalSpacing = numberOfSpaces * spaceBetweenDivs;
    
    // Add page number top height if enabled
    const pageNumberTopHeight = (typeof getShowPageNumbers === 'function' && getShowPageNumbers()) ? PAGE_NUMBER_TOP.heightMm : 0;
    
    return stats.margins.top + contentHeight + totalSpacing + stats.margins.bottom + pageNumberTopHeight;
}

// Generate detailed breakdown table with proper per-page structure
function generateDetailedTable(stats) {
    if (!stats || stats.totalItems === 0) {
        return generateEmptyTable();
    }

    const contentModel = window.contentModel;
    const spaceBetweenDivs = stats.spaceBetweenDivs || 0;
    const showPageNumbers = typeof getShowPageNumbers === 'function' && getShowPageNumbers();
    const hasRepeatingHeader = stats.hasRepeatingHeader || false;
    const repeatingHeaderHeight = stats.repeatingHeaderHeight || 0;
    
    console.log('📊 Generating statistics table:', { 
        totalPages: stats.totalPages, 
        totalItems: stats.totalItems,
        hasPageBreaks: !!stats.pageBreaks,
        pageBreaksLength: stats.pageBreaks ? stats.pageBreaks.length : 0,
        hasRepeatingHeader, 
        repeatingHeaderHeight 
    });

    let bodyHTML = '';

    // Group content by pages
    for (let pageNum = 1; pageNum <= stats.totalPages; pageNum++) {
        // Page separator
        if (pageNum > 1) {
            bodyHTML += `<tr><td colspan="3" class="py-2"></td></tr>`;
        }
        
        // Page header
        bodyHTML += `<tr><td colspan="3" class="text-sm font-semibold bg-gray-100 px-2 py-1">📄 Page ${pageNum}</td></tr>`;
        
        // Margin Top (on every page)
        bodyHTML += `<tr><td class="text-xs pl-4">📏 Margin Top</td><td class="text-xs font-mono text-center">${pageNum}</td><td class="text-xs font-mono text-center">${stats.margins.top}mm</td></tr>`;
        
        // Page Number (if enabled, on every page)
        if (showPageNumbers) {
            bodyHTML += `<tr><td class="text-xs text-purple-600 pl-4">📝 Page Number</td><td class="text-xs font-mono text-center text-purple-600">${pageNum}</td><td class="text-xs font-mono text-center text-purple-600">${PAGE_NUMBER_TOP.heightMm.toFixed(1)}mm</td></tr>`;
        }

        // Repeating Header (if exists, on every page)
        if (hasRepeatingHeader && repeatingHeaderHeight > 0) {
            bodyHTML += `<tr><td class="text-xs text-blue-600 pl-4">📋 Header (repeats)</td><td class="text-xs font-mono text-center text-blue-600">${pageNum}</td><td class="text-xs font-mono text-center text-blue-600">${repeatingHeaderHeight.toFixed(1)}mm</td></tr>`;
            
            // Space after header (if there are other elements on this page)
            const pageElements = getElementsForPage(pageNum, stats);
            if (pageElements.length > 0 && spaceBetweenDivs > 0) {
                bodyHTML += `<tr><td class="text-xs text-orange-600 pl-6">↳ Space after header</td><td class="text-xs font-mono text-center text-orange-600">${pageNum}</td><td class="text-xs font-mono text-center text-orange-600">${spaceBetweenDivs.toFixed(1)}mm</td></tr>`;
            }
        }

        // Content elements for this page
        const pageElements = getElementsForPage(pageNum, stats);
        pageElements.forEach((element, indexOnPage) => {
            const contentHeight = element.heightMm || 0;
            const elementNumber = element.originalIndex + 1;
            
            // Add space before element if needed (not first element on page)
            if (indexOnPage > 0 && spaceBetweenDivs > 0) {
                bodyHTML += `<tr><td class="text-xs text-orange-600 pl-6">↳ Space</td><td class="text-xs font-mono text-center text-orange-600">${pageNum}</td><td class="text-xs font-mono text-center text-orange-600">${spaceBetweenDivs.toFixed(1)}mm</td></tr>`;
            }
            
            // The element itself
            const isHeader = hasRepeatingHeader && element.originalIndex === 0;
            if (!isHeader) {  // Don't show repeating header content again
                bodyHTML += `<tr><td class="text-xs pl-4">📝 Element ${elementNumber}</td><td class="text-xs font-mono text-center">${pageNum}</td><td class="text-xs font-mono text-center">${contentHeight.toFixed(1)}mm</td></tr>`;
            }
        });
        
        // Margin Bottom (on every page)
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
                <tbody>
                    ${bodyHTML}
                </tbody>
            </table>
        </div>
    `;
}

// Get elements that appear on a specific page
function getElementsForPage(pageNum, stats) {
    const contentModel = window.contentModel;
    if (!contentModel || !contentModel.items) return [];
    
    // If we have page breaks info from stats, use it (preferred method for accuracy)
    if (stats.pageBreaks) {
        const elementsOnPage = stats.pageBreaks
            .filter(pb => pb.page === pageNum && !pb.isRepeatingHeader)
            .map(pb => {
                const item = contentModel.items[pb.elementIndex];
                if (!item) {
                    console.warn(`📊 Element ${pb.elementIndex} not found in content model for page ${pageNum}`);
                    return null;
                }
                return {
                    ...item,
                    originalIndex: pb.elementIndex,
                    pageNumber: pageNum
                };
            })
            .filter(item => item !== null);
        
        console.log(`📊 Page ${pageNum}: Found ${elementsOnPage.length} elements using pageBreaks data`);
        return elementsOnPage;
    }
    
    // Fallback: use pageNumber from content model items
    const fallbackElements = contentModel.items
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter(item => item.pageNumber === pageNum);
    
    console.log(`📊 Page ${pageNum}: Found ${fallbackElements.length} elements using fallback method`);
    return fallbackElements;
}

// Generate empty table when no content
function generateEmptyTable() {
    return `
        <div class="text-center text-gray-500 py-8">
            <div class="text-2xl mb-2">📄</div>
            <div>No content to analyze</div>
            <div class="text-xs">Load some JSON content to see statistics</div>
        </div>
    `;
}

// Generate page-by-page summary
function generatePageSummary(stats) {
    if (!stats || stats.totalPages === 0) {
        return '<div class="text-center text-gray-500">No pages generated</div>';
    }
    
    const usableHeight = 297 - stats.margins.top - stats.margins.bottom - (getShowPageNumbers() ? 8 : 0); // A4 height minus margins and page number
    
    let summaryHTML = '';
    
    for (let pageNum = 1; pageNum <= stats.totalPages; pageNum++) {
        const pageElements = getElementsForPage(pageNum, stats);
        const elementCount = pageElements.length;
        const contentHeight = pageElements.reduce((sum, el) => sum + (el.heightMm || 0), 0);
        
        // Calculate spacing on this page
        let spacingHeight = 0;
        if (stats.hasRepeatingHeader && pageElements.length > 0 && stats.spaceBetweenDivs > 0) {
            spacingHeight += stats.spaceBetweenDivs; // Space after header
        }
        if (pageElements.length > 1 && stats.spaceBetweenDivs > 0) {
            spacingHeight += (pageElements.length - 1) * stats.spaceBetweenDivs; // Space between elements
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

// Main update function
export function updateStatisticsDisplay(stats) {
    const container = document.getElementById('statistics-container');
    if (!container) return;

    if (!stats) {
        container.innerHTML = generateEmptyTable();
        return;
    }

    const totalUsedHeight = calculateTotalUsedHeight(stats);
    const totalAvailableHeight = 297 * stats.totalPages; // A4 height * number of pages
    const utilizationPercentage = Math.round((totalUsedHeight / totalAvailableHeight) * 100);

    // Calculate comprehensive spacing breakdown
    const spacingBreakdown = calculateSpacingBreakdown(stats);
    
    const summaryHTML = `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-800">Overview</h4>
                <div class="text-xs px-2 py-1 rounded ${utilizationPercentage > 90 ? 'bg-red-100 text-red-700' : utilizationPercentage > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">
                    ${utilizationPercentage}% filled
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div>📄 <strong>${stats.totalPages}</strong> page${stats.totalPages !== 1 ? 's' : ''}</div>
                <div>📝 <strong>${stats.totalItems}</strong> element${stats.totalItems !== 1 ? 's' : ''}</div>
                <div>📏 <strong>${totalUsedHeight.toFixed(1)}mm</strong> total used</div>
                <div>📊 <strong>${spacingBreakdown.totalContentHeight.toFixed(1)}mm</strong> content</div>
            </div>
        </div>

        <div class="mb-4">
            <h4 class="font-medium text-gray-800 mb-2">Margins & Spacing</h4>
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div>📐 Top: <strong>${stats.margins.top}mm</strong></div>
                <div>📐 Bottom: <strong>${stats.margins.bottom}mm</strong></div>
                <div>📐 Left: <strong>${stats.margins.left}mm</strong></div>
                <div>📐 Right: <strong>${stats.margins.right}mm</strong></div>
                <div>🔗 Between elements: <strong>${stats.spaceBetweenDivs}mm</strong></div>
                <div>📊 Total spacing: <strong>${spacingBreakdown.totalSpacing.toFixed(1)}mm</strong></div>
                ${stats.hasRepeatingHeader ? `<div>📋 Header spacing: <strong>${(spacingBreakdown.headerSpacing).toFixed(1)}mm</strong></div>` : ''}
                <div>🎯 Element spacing: <strong>${spacingBreakdown.elementSpacing.toFixed(1)}mm</strong></div>
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

// Ensure container exists
export function ensureStatisticsContainer() {
    let container = document.getElementById('statistics-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'statistics-container';
        container.className = 'text-sm text-gray-600';
        
        // Try to find the statistics section and add the container
        const statisticsSection = document.querySelector('h3');
        if (statisticsSection && statisticsSection.textContent.includes('Statistics')) {
            statisticsSection.parentNode.appendChild(container);
        }
    }
    return container;
} 