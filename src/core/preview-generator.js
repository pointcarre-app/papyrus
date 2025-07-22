/**
 * Preview generation module for A4 page rendering
 */

import { getJSONFromTextarea, createElementFromJSON, updateDebugHeightIndicators } from '../utils/json-handler.js';
import { contentModel } from './content-model.js';
import { updateStatisticsDisplay, ensureStatisticsContainer } from './statistics-display.js';
import { getCurrentMargins, getCurrentSpaceBetweenDivs } from './margin-config.js';
import { getShowPageNumbers } from './page-number-config.js';

// A4 dimensions in mm and px
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const MM_TO_PX = 3.78; // 1mm = 3.78px at 96 DPI

// Generate preview from JSON with automatic multi-page layout
export function generatePreviewFromJSON() {
    const container = document.getElementById('pages-container');
    container.innerHTML = '';
    
    // Ensure statistics container exists
    ensureStatisticsContainer();
    
    const jsonData = getJSONFromTextarea();
    if (!jsonData || jsonData.length === 0) {
        window.contentModel = contentModel; // Make empty model available
        updateStatisticsDisplay(null);
        return;
    }

    // Initialize content model
    window.contentModel = contentModel;
    const debugMode = window.papyrusDebugMode || false;
    const spaceBetweenDivs = getCurrentSpaceBetweenDivs();
    const margins = getCurrentMargins();
    const showPageNumbers = getShowPageNumbers();
    
    // Calculate usable page height
    const pageNumberHeight = showPageNumbers ? 8 : 0; // mm
    const usablePageHeight = A4_HEIGHT_MM - margins.top - margins.bottom - pageNumberHeight;
    
    console.log(`🔧 Page Setup: usable height = ${usablePageHeight}mm (total: ${A4_HEIGHT_MM}mm - top: ${margins.top}mm - bottom: ${margins.bottom}mm - pageNum: ${pageNumberHeight}mm)`);
    
    // Check for repeating header
    const hasRepeatingHeader = jsonData.length > 0 && jsonData[0].isPapyrusHeader === true;
    let repeatingHeaderHeight = 0;
    let repeatingHeaderElement = null;
    
    if (hasRepeatingHeader) {
        repeatingHeaderElement = createElementFromJSON(jsonData[0], debugMode);
        // We'll measure this after first render
    }
    
    // Create elements and measure them
    const elements = [];
    const elementHeights = [];
    
    // Create a temporary page for measuring
    const tempPage = createTempMeasurePage();
    container.appendChild(tempPage);
    
    // Add elements to temp page and measure
    jsonData.forEach((item, index) => {
        const element = createElementFromJSON(item, debugMode);
        elements.push(element);
        tempPage.appendChild(element);
    });
    
    // Render math first
    if (window.renderMathInElement) {
        renderMathInElement(tempPage, {
            delimiters: [
                {left: '$$', right: '$$', display: true}, 
                {left: '$', right: '$', display: false}
            ]
        });
    }
    
    // Measure elements after rendering
    setTimeout(() => {
        // Measure repeating header if it exists
        if (hasRepeatingHeader && elements[0]) {
            const headerRect = elements[0].getBoundingClientRect();
            repeatingHeaderHeight = headerRect.height / MM_TO_PX;
            console.log(`📄 Header height: ${repeatingHeaderHeight.toFixed(1)}mm`);
        }
        
        // Measure all elements
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const heightMm = rect.height / MM_TO_PX;
            elementHeights.push(heightMm);
            console.log(`📝 Element ${index + 1}: ${heightMm.toFixed(1)}mm`);
        });
        
        // Remove temp page
        container.removeChild(tempPage);
        
        // Calculate page breaks
        const pageBreaks = calculatePageBreaks({
            elements,
            elementHeights,
            usablePageHeight,
            spaceBetweenDivs,
            repeatingHeaderHeight,
            hasRepeatingHeader
        });
        
        // Generate final pages
        generateFinalPages({
            container,
            pageBreaks,
            elements,
            elementHeights,
            jsonData,
            margins,
            showPageNumbers,
            debugMode,
            spaceBetweenDivs,
            hasRepeatingHeader,
            repeatingHeaderElement,
            repeatingHeaderHeight
        });
        
        // Update statistics
        updateContentModelAndStats({
            jsonData,
            elementHeights,
            pageBreaks,
            margins,
            spaceBetweenDivs,
            repeatingHeaderHeight,
            hasRepeatingHeader
        });
        
    }, 100); // Give time for math rendering
}

function createTempMeasurePage() {
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

function calculatePageBreaks({ elements, elementHeights, usablePageHeight, spaceBetweenDivs, repeatingHeaderHeight, hasRepeatingHeader }) {
    const pageBreaks = [];
    let currentPage = 1;
    let currentContentHeight = 0; // Track content height within the usable area (excluding margins)
    
    console.log(`📊 Starting page breaks calculation (ALL IN MM):`);
    console.log(`- Usable content height per page: ${usablePageHeight.toFixed(1)}mm (A4 297mm - margins - page numbers)`);
    console.log(`- Repeating header height: ${repeatingHeaderHeight.toFixed(1)}mm`);
    console.log(`- Space between divs: ${spaceBetweenDivs}mm`);
    
    // Calculate available height for content after accounting for header
    const availableHeightPerPage = usablePageHeight - (hasRepeatingHeader ? repeatingHeaderHeight : 0);
    console.log(`- Available height for content after header: ${availableHeightPerPage.toFixed(1)}mm`);
    
    // Initialize first page with header overhead
    if (hasRepeatingHeader) {
        currentContentHeight = repeatingHeaderHeight;
    }
    
    elements.forEach((element, index) => {
        const elementHeightMm = elementHeights[index]; // Already in mm
        const isRepeatingHeader = hasRepeatingHeader && index === 0;
        
        // Handle repeating header specially - it appears on every page
        if (isRepeatingHeader) {
            pageBreaks.push({ elementIndex: index, page: currentPage, isRepeatingHeader: true });
            console.log(`📋 Repeating header (${elementHeightMm.toFixed(1)}mm) placed on page ${currentPage}`);
            return;
        }
        
        // Calculate TOTAL space needed for this element including spacing
        let totalNeededHeight = elementHeightMm;
        
        // Get elements already placed on current page (excluding headers)
        const elementsOnCurrentPage = pageBreaks.filter(pb => pb.page === currentPage && !pb.isRepeatingHeader);
        
        // Add space before element if there are other elements or header on this page
        if ((elementsOnCurrentPage.length > 0 || hasRepeatingHeader) && spaceBetweenDivs > 0) {
            totalNeededHeight += spaceBetweenDivs;
        }
        
        console.log(`🔍 Element ${index + 1} (${elementHeightMm.toFixed(1)}mm + ${(totalNeededHeight - elementHeightMm).toFixed(1)}mm spacing): needs ${totalNeededHeight.toFixed(1)}mm total`);
        console.log(`   Current page content height: ${currentContentHeight.toFixed(1)}mm / ${usablePageHeight.toFixed(1)}mm usable`);
        
        // Check if element fits on current page (within usable height)
        if (currentContentHeight + totalNeededHeight > usablePageHeight) {
            // Element doesn't fit, move to next page
            console.log(`❌ Element ${index + 1} doesn't fit on page ${currentPage} (would be ${(currentContentHeight + totalNeededHeight).toFixed(1)}mm > ${usablePageHeight.toFixed(1)}mm)`);
            
            currentPage++;
            currentContentHeight = hasRepeatingHeader ? repeatingHeaderHeight : 0;
            
            // Recalculate needed height for new page
            totalNeededHeight = elementHeightMm;
            if (hasRepeatingHeader && spaceBetweenDivs > 0) {
                totalNeededHeight += spaceBetweenDivs; // Space after header on new page
            }
            
            console.log(`📄 Starting new page ${currentPage}, element needs ${totalNeededHeight.toFixed(1)}mm`);
            
            // Verify element fits on new page
            if (currentContentHeight + totalNeededHeight > usablePageHeight) {
                console.error(`❌ CRITICAL: Element ${index + 1} (${totalNeededHeight.toFixed(1)}mm) won't fit on ANY page! Usable height: ${usablePageHeight.toFixed(1)}mm`);
                console.error(`   Element height: ${elementHeightMm.toFixed(1)}mm + spacing: ${(totalNeededHeight - elementHeightMm).toFixed(1)}mm`);
                // Force it onto the page anyway to prevent infinite loops
            }
        }
        
        // Add element to current page
        pageBreaks.push({ 
            elementIndex: index, 
            page: currentPage, 
            isRepeatingHeader: false,
            needsSpaceBefore: (elementsOnCurrentPage.length > 0 || hasRepeatingHeader) && spaceBetweenDivs > 0
        });
        
        // Update current page content height
        currentContentHeight += totalNeededHeight;
        
        console.log(`✅ Element ${index + 1} placed on page ${currentPage}, new content height: ${currentContentHeight.toFixed(1)}mm / ${usablePageHeight.toFixed(1)}mm`);
    });
    
    // Get actual max page number from all elements
    const maxPage = pageBreaks.length > 0 ? Math.max(...pageBreaks.map(pb => pb.page)) : 1;
    
    console.log(`📊 Final page breaks (${maxPage} pages):`, pageBreaks);
    console.log(`📊 Page utilization summary:`);
    for (let page = 1; page <= maxPage; page++) {
        const pageElements = pageBreaks.filter(pb => pb.page === page);
        const contentElements = pageElements.filter(pb => !pb.isRepeatingHeader);
        console.log(`   Page ${page}: ${contentElements.length} content elements + ${pageElements.filter(pb => pb.isRepeatingHeader).length} headers`);
    }
    
    return pageBreaks;
}

function generateFinalPages({ container, pageBreaks, elements, elementHeights, jsonData, margins, showPageNumbers, debugMode, spaceBetweenDivs, hasRepeatingHeader, repeatingHeaderElement, repeatingHeaderHeight }) {
    const totalPages = Math.max(1, Math.max(...pageBreaks.map(pb => pb.page)));
    console.log(`🎨 Generating ${totalPages} final pages`);
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageElement = document.createElement('div');
        pageElement.className = 'page-preview';
        
        // Add page number if enabled
        if (showPageNumbers) {
            const pageNumberDiv = document.createElement('div');
            pageNumberDiv.className = 'page-number';
            pageNumberDiv.textContent = `Page ${pageNum}`;
            pageElement.appendChild(pageNumberDiv);
        }
        
        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';
        
        // Add repeating header if exists
        if (hasRepeatingHeader && repeatingHeaderElement) {
            const headerClone = repeatingHeaderElement.cloneNode(true);
            if (!debugMode) {
                headerClone.style.background = 'transparent';
            }
            pageContent.appendChild(headerClone);
        }
        
        // Add elements for this page
        const pageElements = pageBreaks.filter(pb => pb.page === pageNum && !pb.isRepeatingHeader);
        
        pageElements.forEach((pb, indexOnPage) => {
            // Add space before element if this element needs space
            // This matches the logic from calculatePageBreaks
            if (pb.needsSpaceBefore) {
                const spaceDiv = createSpaceDiv(spaceBetweenDivs, debugMode);
                pageContent.appendChild(spaceDiv);
                console.log(`   Added ${spaceBetweenDivs}mm space before element ${pb.elementIndex + 1} on page ${pageNum}`);
            }
            
            // Add the element
            const elementClone = elements[pb.elementIndex].cloneNode(true);
            if (!debugMode) {
                elementClone.style.background = 'transparent';
            }
            pageContent.appendChild(elementClone);
            console.log(`   Added element ${pb.elementIndex + 1} to page ${pageNum}`);
        });
        
        pageElement.appendChild(pageContent);
        container.appendChild(pageElement);
        
        console.log(`✓ Generated page ${pageNum} with ${pageElements.length} elements`);
    }
    
    // Re-render math in final pages
    if (window.renderMathInElement) {
        renderMathInElement(container, {
            delimiters: [
                {left: '$$', right: '$$', display: true}, 
                {left: '$', right: '$', display: false}
            ]
        });
    }
}

function createSpaceDiv(spaceBetweenDivs, debugMode) {
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

function updateContentModelAndStats({ jsonData, elementHeights, pageBreaks, margins, spaceBetweenDivs, repeatingHeaderHeight, hasRepeatingHeader }) {
    // Update content model with page assignments
    contentModel.loadFromJSON(jsonData);
    contentModel.updateMargins(margins);
    
    // Set element heights and page assignments
    contentModel.items.forEach((item, index) => {
        item.heightMm = elementHeights[index] || 0;
        
        const pageBreak = pageBreaks.find(pb => pb.elementIndex === index);
        item.pageNumber = pageBreak ? pageBreak.page : 1;
    });
    
    // Set repeating header height
    if (hasRepeatingHeader) {
        contentModel.repeatingHeaderHeightMm = repeatingHeaderHeight;
    }
    
    // Calculate total pages
    const totalPages = Math.max(1, Math.max(...pageBreaks.map(pb => pb.page)));
    
    // Update statistics
    const stats = {
        totalItems: jsonData.length,
        totalPages: totalPages,
        margins: {
            top: margins.top,
            right: margins.right,
            bottom: margins.bottom,
            left: margins.left
        },
        spaceBetweenDivs: spaceBetweenDivs,
        repeatingHeaderHeight: repeatingHeaderHeight,
        hasRepeatingHeader: hasRepeatingHeader,
        pageBreaks: pageBreaks
    };
    
    console.log(`📊 Final statistics:`, stats);
    updateStatisticsDisplay(stats);
}

// Generate pages from JSON textarea
export function generatePages() {
    generatePreviewFromJSON();
    
    // Update height indicators if debug mode is active
    if (window.papyrusDebugMode) {
        setTimeout(updateDebugHeightIndicators, 50);
    }
    
    // Note: Statistics are already updated in updateContentModelAndStats()
    // No need to update them again here as it would override the pageBreaks data
} 