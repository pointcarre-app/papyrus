/**
 * Content Model - Enhanced JSON data with computed properties
 */

import { getShowPageNumbers } from './page-number-config.js';

// A4 page dimensions in mm and px
export const PAGE_DIMENSIONS = {
    width: 210, // A4 width in mm
    height: 297, // A4 height in mm
    widthPx: 210 * 3.78, // ~794px
    heightPx: 297 * 3.78  // ~1123px
};

// Page number top dimensions
export const PAGE_NUMBER_TOP = {
    heightPx: 25, // Estimated height: font-size (10px) + padding (8px) + margin (10px) + border
    heightMm: 25 / 3.78 // Convert to mm
};

// Enhanced content item with computed properties
class ContentItem {
    constructor(jsonData, index) {
        this.id = jsonData.id;
        this.html = jsonData.html;
        this.classes = jsonData.classes || [];
        this.style = jsonData.style || '';
        this.originalIndex = index;
        
        // Computed properties (will be calculated)
        this.heightPx = 0;
        this.heightMm = 0;
        this.pageNumber = 1;
        this.positionOnPagePx = 0;
        this.positionOnPageMm = 0;
        this.element = null; // Reference to DOM element
        this.isCropped = false; // Flag if content doesn't fit on any page
    }
    
    // Update computed properties from DOM element
    updateFromElement(element) {
        this.element = element;
        this.heightPx = element.offsetHeight;
        this.heightMm = parseFloat((this.heightPx / 3.78).toFixed(1));
    }
    
    // Calculate page position based on content before this item
    calculatePagePosition(previousItems, margins, repeatingHeaderHeightPx = 0) {
        const baseContentHeightPx = PAGE_DIMENSIONS.heightPx - (margins.top + margins.bottom) * 3.78;
        const pageNumberTopHeightPx = (typeof getShowPageNumbers === 'function' && getShowPageNumbers()) ? PAGE_NUMBER_TOP.heightPx : 0;
        const availableContentHeightPx = baseContentHeightPx - repeatingHeaderHeightPx - pageNumberTopHeightPx; 
        const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
        const spaceBetweenDivsPx = spaceBetweenDivs * 3.78;
        
        // Validation: Check if this single item is too large for any page
        if (this.heightPx > availableContentHeightPx) {
            console.warn(`Content item ${this.id} (${this.heightMm}mm) is larger than available page space (${(availableContentHeightPx / 3.78).toFixed(1)}mm) and will be cropped!`);
            this.isCropped = true;
        }
        
        let accumulatedHeight = repeatingHeaderHeightPx; // Start with header height if it exists
        let currentPage = 1;
        
        // Add space after header if header exists and there are content items
        if (repeatingHeaderHeightPx > 0 && (previousItems.length > 0 || true)) {
            accumulatedHeight += spaceBetweenDivsPx;
        }
        
        // Add heights of all previous items including spacing
        for (let i = 0; i < previousItems.length; i++) {
            const item = previousItems[i];
            
            // Check if current item + space after (if not last) fits on current page
            const spaceAfterThisItem = (i < previousItems.length - 1) ? spaceBetweenDivsPx : 0;
            const totalItemHeight = item.heightPx + spaceAfterThisItem;
            
            if (accumulatedHeight + totalItemHeight > availableContentHeightPx) {
                // Move to next page
                currentPage++;
                accumulatedHeight = repeatingHeaderHeightPx; // Reset with header height
                
                // Add space after header if header exists
                if (repeatingHeaderHeightPx > 0) {
                    accumulatedHeight += spaceBetweenDivsPx;
                }
                
                // Add current item (without space after, since we're at page start)
                accumulatedHeight += item.heightPx;
                
                // Add space after only if there are more items
                if (i < previousItems.length - 1) {
                    accumulatedHeight += spaceBetweenDivsPx;
                }
            } else {
                // Item fits on current page
                accumulatedHeight += totalItemHeight;
            }
        }
        
        // Now check if the current item fits on the current page
        const needsSpaceBeforeCurrentItem = (previousItems.length > 0 || repeatingHeaderHeightPx > 0) ? spaceBetweenDivsPx : 0;
        
        if (accumulatedHeight + needsSpaceBeforeCurrentItem + this.heightPx > availableContentHeightPx) {
            // Current item needs a new page
            currentPage++;
            this.positionOnPagePx = repeatingHeaderHeightPx;
            
            // Add space after header if header exists
            if (repeatingHeaderHeightPx > 0) {
                this.positionOnPagePx += spaceBetweenDivsPx;
            }
        } else {
            // Current item fits on current page
            this.positionOnPagePx = accumulatedHeight + needsSpaceBeforeCurrentItem;
        }
        
        this.pageNumber = currentPage;
        this.positionOnPageMm = parseFloat((this.positionOnPagePx / 3.78).toFixed(1));
    }
}

// Enhanced content model
export class ContentModel {
    constructor() {
        this.items = [];
        this.totalHeightPx = 0;
        this.totalHeightMm = 0;
        this.totalPages = 1;
        this.margins = { top: 5, right: 5, bottom: 5, left: 5 };
        this.pageContentHeightPx = 0;
        this.pageContentHeightMm = 0;
        this.repeatingHeaderHeightPx = 0;
        this.repeatingHeaderHeightMm = 0;
    }
    
    // Load from JSON data
    loadFromJSON(jsonData, repeatingHeaderElement = null) {
        this.items = jsonData.map((item, index) => new ContentItem(item, index));
        this.repeatingHeaderElement = repeatingHeaderElement;
        this.repeatingHeaderHeightPx = 0;
        this.repeatingHeaderHeightMm = 0;
        return this;
    }
    
    // Update margins
    updateMargins(margins) {
        this.margins = { ...margins };
        this.calculatePageDimensions();
        this.calculatePagePositions();
        return this;
    }
    
    // Update repeating header dimensions
    updateRepeatingHeader(headerElement) {
        if (headerElement) {
            this.repeatingHeaderHeightPx = headerElement.offsetHeight;
            this.repeatingHeaderHeightMm = parseFloat((this.repeatingHeaderHeightPx / 3.78).toFixed(1));
        } else {
            this.repeatingHeaderHeightPx = 0;
            this.repeatingHeaderHeightMm = 0;
        }
        this.calculatePagePositions();
        return this;
    }
    
    // Calculate page content area
    calculatePageDimensions() {
        const pageNumberTopHeightPx = (typeof getShowPageNumbers === 'function' && getShowPageNumbers()) ? PAGE_NUMBER_TOP.heightPx : 0;
        this.pageContentHeightPx = PAGE_DIMENSIONS.heightPx - (this.margins.top + this.margins.bottom) * 3.78 - pageNumberTopHeightPx;
        this.pageContentHeightMm = parseFloat((this.pageContentHeightPx / 3.78).toFixed(1));
        
        // Log warnings if page space is very limited
        const availableForContent = this.pageContentHeightPx - this.repeatingHeaderHeightPx;
        if (availableForContent < 100) { // Less than ~26mm
            console.warn(`Very limited page space available: ${(availableForContent / 3.78).toFixed(1)}mm. Consider reducing margins or header size.`);
        }
    }
    
    // Update heights from DOM elements
    updateFromDOM() {
        let totalHeight = 0;
        const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
        const spaceBetweenDivsPx = spaceBetweenDivs * 3.78;
        
        this.items.forEach((item, index) => {
            if (item.element) {
                item.updateFromElement(item.element);
                totalHeight += item.heightPx;
                
                // Add space between divs (except after the last item)
                if (index < this.items.length - 1 && spaceBetweenDivs > 0) {
                    totalHeight += spaceBetweenDivsPx;
                }
            }
        });
        
        this.totalHeightPx = totalHeight;
        this.totalHeightMm = parseFloat((totalHeight / 3.78).toFixed(1));
        
        this.calculatePagePositions();
        return this;
    }
    
    // Calculate page positions for all items
    calculatePagePositions() {
        this.calculatePageDimensions();
        
        for (let i = 0; i < this.items.length; i++) {
            const previousItems = this.items.slice(0, i);
            this.items[i].calculatePagePosition(previousItems, this.margins, this.repeatingHeaderHeightPx);
        }
        
        // Calculate total pages needed
        this.totalPages = this.items.length > 0 ? Math.max(...this.items.map(item => item.pageNumber)) : 1;
        
        // Check for cropped content
        const croppedItems = this.items.filter(item => item.isCropped);
        if (croppedItems.length > 0) {
            console.warn(`${croppedItems.length} content items are too large and will be cropped:`, croppedItems.map(item => item.id));
        }
        
        return this;
    }
    
    // Get statistics object
    getStatistics() {
        const pageBreakdowns = [];
        const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
        const spaceBetweenDivsPx = spaceBetweenDivs * 3.78;
        
        for (let page = 1; page <= this.totalPages; page++) {
            const pageItems = this.items.filter(item => item.pageNumber === page);
            
            // Calculate actual content height on this page (including spacing)
            let pageContentHeight = 0;
            
            // Add repeating header if it exists
            if (this.repeatingHeaderHeightPx > 0) {
                pageContentHeight += this.repeatingHeaderHeightPx;
                
                // Add space after header if there are content items
                if (pageItems.length > 0) {
                    pageContentHeight += spaceBetweenDivsPx;
                }
            }
            
            // Add content items and spacing between them
            pageItems.forEach((item, index) => {
                pageContentHeight += item.heightPx;
                
                // Add space after item if not the last item on this page
                if (index < pageItems.length - 1) {
                    pageContentHeight += spaceBetweenDivsPx;
                }
            });
            
            const pageContentHeightMm = parseFloat((pageContentHeight / 3.78).toFixed(1));
            const remainingSpace = Math.max(0, this.pageContentHeightPx - pageContentHeight);
            const remainingSpaceMm = parseFloat((remainingSpace / 3.78).toFixed(1));
            
            pageBreakdowns.push({
                page,
                itemCount: pageItems.length,
                heightPx: pageContentHeight,
                heightMm: pageContentHeightMm,
                remainingSpacePx: remainingSpace,
                remainingSpaceMm: remainingSpaceMm,
                utilization: Math.min(100, (pageContentHeight / this.pageContentHeightPx * 100)).toFixed(1),
                hasRepeatingHeader: this.repeatingHeaderHeightPx > 0
            });
        }
        
        return {
            totalItems: this.items.length,
            totalHeightPx: this.totalHeightPx,
            totalHeightMm: this.totalHeightMm,
            totalPages: this.totalPages,
            pageContentHeightPx: this.pageContentHeightPx,
            pageContentHeightMm: this.pageContentHeightMm,
            margins: this.margins,
            pageBreakdowns,
            averageItemHeight: this.items.length ? parseFloat((this.totalHeightPx / this.items.length).toFixed(1)) : 0,
            averageItemHeightMm: this.items.length ? parseFloat((this.totalHeightMm / this.items.length).toFixed(1)) : 0,
            croppedItems: this.items.filter(item => item.isCropped).length,
            warnings: this.generateWarnings(pageBreakdowns)
        };
    }
    
    // Generate warnings about potential issues
    generateWarnings(pageBreakdowns = []) {
        const warnings = [];
        const spaceBetweenDivs = window.getCurrentSpaceBetweenDivs ? window.getCurrentSpaceBetweenDivs() : 0;
        
        // Check for very large margins
        const totalMargins = this.margins.top + this.margins.bottom;
        if (totalMargins > 100) { // More than 100mm of margins
            warnings.push(`Large margins (${totalMargins}mm total) leave limited space for content`);
        }
        
        // Check for very large spacing
        if (spaceBetweenDivs > 20) {
            warnings.push(`Large spacing (${spaceBetweenDivs}mm) may cause content to overflow pages`);
        }
        
        // Check if pages are very full
        pageBreakdowns?.forEach(page => {
            if (page.utilization > 95) {
                warnings.push(`Page ${page.page} is ${page.utilization}% full and may have rendering issues`);
            }
        });
        
        return warnings;
    }
    
    // Get items for a specific page
    getItemsForPage(pageNumber) {
        return this.items.filter(item => item.pageNumber === pageNumber);
    }
}

// Global content model instance
export const contentModel = new ContentModel(); 