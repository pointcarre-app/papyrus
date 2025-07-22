/**
 * Dual-JSON Application initialization and event handling
 * Manages two independent JSON inputs with their own PDF generation
 */

import { generatePreviewFromJSON } from './preview-generator.js';
import { printPage } from './print-manager.js';
import { initializeMargins, setMargins, getCurrentMargins, initializeSpaceBetweenDivs, setSpaceBetweenDivs, getCurrentSpaceBetweenDivs } from './margin-config.js';
import { initializeFontSizes, setFontSizes, getCurrentFontSizes } from './font-config.js';
import { initializePageNumberConfig, setShowPageNumbers, getShowPageNumbers } from './page-number-config.js';
import { updateDebugHeightIndicators, getJSONFromTextarea, createElementFromJSON } from '../utils/json-handler.js';

// Dual JSON Manager
class DualJSONManager {
    constructor() {
        this.jsonSets = {
            1: { id: 1, name: 'PDF #1', content: '', pages: null },
            2: { id: 2, name: 'PDF #2', content: '', pages: null }
        };
        this.activeJsonId = 1;
        this.currentViewJsonId = 1; // Currently viewed JSON in preview (1 or 2)
    }

    // Switch between JSON inputs
    switchToJSON(id) {
        if (id !== 1 && id !== 2) return;
        
        // Save current content
        this.saveCurrentContent();
        
        // Switch active JSON
        this.activeJsonId = id;
        
        // Update UI
        this.updateActiveDisplay();
        this.loadActiveContent();
    }

    // Save current textarea content to active JSON
    saveCurrentContent() {
        const textarea = document.getElementById('json-input');
        if (textarea && this.jsonSets[this.activeJsonId]) {
            this.jsonSets[this.activeJsonId].content = textarea.value;
        }
    }

    // Load active JSON content into textarea
    loadActiveContent() {
        const textarea = document.getElementById('json-input');
        if (textarea && this.jsonSets[this.activeJsonId]) {
            textarea.value = this.jsonSets[this.activeJsonId].content;
        }
    }

    // Update active display indicators
    updateActiveDisplay() {
        // Update tab buttons
        document.querySelectorAll('.json-tab').forEach((tab, index) => {
            const jsonId = index + 1;
            if (jsonId === this.activeJsonId) {
                tab.classList.add('btn-primary');
                tab.classList.remove('btn-outline');
            } else {
                tab.classList.remove('btn-primary');
                tab.classList.add('btn-outline');
            }
        });

        // Update active indicator
        const indicator = document.getElementById('active-json-indicator');
        if (indicator) {
            indicator.textContent = `PDF #${this.activeJsonId}`;
        }
    }

    // Generate preview for active JSON
    generateActivePreview() {
        this.saveCurrentContent();
        
        const container = document.getElementById('pages-container');
        const textarea = document.getElementById('json-input');
        
        if (!this.jsonSets[this.activeJsonId].content.trim()) {
            container.innerHTML = '';
            this.jsonSets[this.activeJsonId].pages = null;
            return;
        }

        // Set textarea content for generation
        textarea.value = this.jsonSets[this.activeJsonId].content;
        
        // Generate preview
        generatePreviewFromJSON();
        
        // Save generated content after a delay for rendering
        setTimeout(() => {
            const generatedContent = container.innerHTML.trim();
            if (generatedContent) {
                this.jsonSets[this.activeJsonId].pages = generatedContent;
            }
        }, 500);
    }

    // Generate previews for both JSONs
    generateAllPreviews() {
        this.saveCurrentContent();
        
        const container = document.getElementById('pages-container');
        const textarea = document.getElementById('json-input');
        const originalContent = textarea.value;
        const originalJsonId = this.activeJsonId;
        
        // Process JSON 1
        if (this.jsonSets[1].content.trim()) {
            textarea.value = this.jsonSets[1].content;
            generatePreviewFromJSON();
            
            setTimeout(() => {
                this.jsonSets[1].pages = container.innerHTML.trim();
                
                // Process JSON 2
                if (this.jsonSets[2].content.trim()) {
                    textarea.value = this.jsonSets[2].content;
                    generatePreviewFromJSON();
                    
                    setTimeout(() => {
                        this.jsonSets[2].pages = container.innerHTML.trim();
                        
                        // Restore original state
                        textarea.value = originalContent;
                        this.activeJsonId = originalJsonId;
                        this.updatePagination();
                    }, 500);
                } else {
                    this.jsonSets[2].pages = null;
                    textarea.value = originalContent;
                    this.activeJsonId = originalJsonId;
                    this.updatePagination();
                }
            }, 500);
        } else {
            this.jsonSets[1].pages = null;
            
            // Process JSON 2
            if (this.jsonSets[2].content.trim()) {
                textarea.value = this.jsonSets[2].content;
                generatePreviewFromJSON();
                
                setTimeout(() => {
                    this.jsonSets[2].pages = container.innerHTML.trim();
                    textarea.value = originalContent;
                    this.activeJsonId = originalJsonId;
                    this.updatePagination();
                }, 500);
            } else {
                this.jsonSets[2].pages = null;
                this.updatePagination();
            }
        }
    }

    // Display preview for active JSON
    displayActivePreview() {
        const container = document.getElementById('pages-container');
        if (this.jsonSets[this.activeJsonId].pages) {
            container.innerHTML = this.jsonSets[this.activeJsonId].pages;
        } else {
            container.innerHTML = '';
        }
        
        // Update pagination after displaying
        this.updatePagination();
    }

    // Display all pages for specified JSON
    displayJsonPages(jsonId) {
        if (jsonId !== 1 && jsonId !== 2) return;
        
        this.currentViewJsonId = jsonId;
        const container = document.getElementById('pages-container');
        
        if (this.jsonSets[jsonId].pages) {
            container.innerHTML = this.jsonSets[jsonId].pages;
        } else {
            container.innerHTML = '';
        }
        
        this.updatePaginationControls();
    }

    // Get page count for a specific JSON
    getPageCount(jsonId) {
        if (!this.jsonSets[jsonId].pages) return 0;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.jsonSets[jsonId].pages;
        return tempDiv.querySelectorAll('.page-preview').length;
    }

    // Check if JSON has content
    hasJsonContent(jsonId) {
        return this.jsonSets[jsonId].content.trim().length > 0 && this.jsonSets[jsonId].pages;
    }

    // Create pagination UI
    createPaginationUI() {
        const container = document.getElementById('pages-container');
        let paginationContainer = document.getElementById('pagination-container');
        
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-container';
            paginationContainer.className = 'mb-6';
            container.parentNode.insertBefore(paginationContainer, container);
        }
        
        return paginationContainer;
    }

    // Update pagination controls
    updatePaginationControls() {
        const paginationContainer = this.createPaginationUI();
        
        const pdf1Pages = this.getPageCount(1);
        const pdf2Pages = this.getPageCount(2);
        const hasPdf1 = this.hasJsonContent(1);
        const hasPdf2 = this.hasJsonContent(2);
        
        // Hide pagination if no content
        if (!hasPdf1 && !hasPdf2) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        // Hide pagination if only one JSON has content
        if ((hasPdf1 && !hasPdf2) || (!hasPdf1 && hasPdf2)) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        const currentViewPages = this.getPageCount(this.currentViewJsonId);
        
        paginationContainer.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="text-sm font-medium text-gray-700">
                        Viewing: ${this.jsonSets[this.currentViewJsonId].name}
                    </div>
                    <div class="badge badge-outline badge-sm">
                        ${currentViewPages} page${currentViewPages !== 1 ? 's' : ''}
                    </div>
                </div>
                <div class="join">
                    <button class="join-item btn btn-sm ${this.currentViewJsonId === 1 ? 'btn-active' : ''} ${!hasPdf1 ? 'btn-disabled' : ''}" 
                            onclick="displayJsonPages(1)"
                            title="View all pages from PDF #1">
                        PDF #1
                        ${pdf1Pages > 0 ? `<div class="badge badge-xs ml-1">${pdf1Pages}</div>` : ''}
                    </button>
                    <button class="join-item btn btn-sm ${this.currentViewJsonId === 2 ? 'btn-active' : ''} ${!hasPdf2 ? 'btn-disabled' : ''}" 
                            onclick="displayJsonPages(2)"
                            title="View all pages from PDF #2">
                        PDF #2
                        ${pdf2Pages > 0 ? `<div class="badge badge-xs ml-1">${pdf2Pages}</div>` : ''}
                    </button>
                </div>
            </div>
        `;
    }

    // Update pagination system
    updatePagination() {
        // Set default view to JSON with content, or PDF #1 if both have content
        if (this.hasJsonContent(1)) {
            this.currentViewJsonId = 1;
        } else if (this.hasJsonContent(2)) {
            this.currentViewJsonId = 2;
        } else {
            this.currentViewJsonId = 1; // Default to PDF #1
        }
        
        this.displayJsonPages(this.currentViewJsonId);
    }

    // Print both PDFs directly without preview window
    printBothPDFs() {
        this.generateAllPreviews();
        
        setTimeout(() => {
            const validJSONs = [1, 2].filter(id => 
                this.jsonSets[id].content.trim() && this.jsonSets[id].pages
            );
            
            if (validJSONs.length === 0) {
                alert('No content to print. Please add JSON content first.');
                return;
            }
            
            // Combine all PDF content
            let combinedContent = '';
            validJSONs.forEach((id, index) => {
                let content = this.jsonSets[id].pages;
                
                // Add page break before second PDF
                if (index > 0) {
                    content = content.replace(
                        '<div class="page-preview"',
                        '<div class="page-preview" style="page-break-before: always;"'
                    );
                }
                
                combinedContent += content;
            });
            
            // Create hidden print container
            const margins = getCurrentMargins();
            const fontSizes = getCurrentFontSizes();
            const showPageNumbers = getShowPageNumbers();
            
            // Create temporary hidden iframe for printing
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.top = '-9999px';
            printFrame.style.left = '-9999px';
            printFrame.style.width = '0px';
            printFrame.style.height = '0px';
            printFrame.style.border = 'none';
            
            document.body.appendChild(printFrame);
            
            const printDoc = printFrame.contentDocument;
            printDoc.open();
            printDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>PCA Papyrus - Combined PDFs</title>
                    <meta charset="UTF-8">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
                    <style>
                        @page {
                            size: A4;
                            margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                        }
                        
                        :root {
                            --font-h1: ${fontSizes.h1}px;
                            --font-h2: ${fontSizes.h2}px;
                            --font-h3: ${fontSizes.h3}px;
                            --font-h4: ${fontSizes.h4}px;
                            --font-h5: ${fontSizes.h5}px;
                            --font-h6: ${fontSizes.h6}px;
                            --font-body: ${fontSizes.body}px;
                        }
                        
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                            font-size: var(--font-body);
                            line-height: 1.6;
                            color: #000;
                            background: white;
                        }
                        
                        .page-preview {
                            width: 210mm;
                            min-height: 297mm;
                            background: white;
                            position: relative;
                            page-break-after: always;
                            page-break-inside: avoid;
                        }
                        
                        .page-preview:last-child {
                            page-break-after: avoid;
                        }
                        
                        h1 { font-size: var(--font-h1); margin-bottom: 0.5em; }
                        h2 { font-size: var(--font-h2); margin-bottom: 0.4em; }
                        h3 { font-size: var(--font-h3); margin-bottom: 0.3em; }
                        h4 { font-size: var(--font-h4); margin-bottom: 0.3em; }
                        h5 { font-size: var(--font-h5); margin-bottom: 0.2em; }
                        h6 { font-size: var(--font-h6); margin-bottom: 0.2em; }
                        
                        p { margin-bottom: 0.5em; }
                        
                        .katex-display { margin: 0.5em 0; }
                        
                        @media print {
                            body { print-color-adjust: exact; }
                            .page-preview { 
                                box-shadow: none;
                                border: none;
                                margin: 0;
                                page-break-after: always;
                            }
                            .page-preview:last-child { page-break-after: avoid; }
                        }
                    </style>
                </head>
                <body>
                    ${combinedContent}
                </body>
                </html>
            `);
            printDoc.close();
            
            // Wait for content to load, then print directly
            setTimeout(() => {
                // Render KaTeX if available
                if (window.renderMathInElement && printFrame.contentWindow.renderMathInElement) {
                    printFrame.contentWindow.renderMathInElement(printDoc.body, {
                        delimiters: [
                            {left: '$$', right: '$$', display: true},
                            {left: '$', right: '$', display: false}
                        ]
                    });
                }
                
                // Trigger print dialog directly
                setTimeout(() => {
                    printFrame.contentWindow.print();
                    
                    // Clean up after printing
                    setTimeout(() => {
                        document.body.removeChild(printFrame);
                    }, 1000);
                }, 500);
            }, 500);
        }, 1000);
    }

    // Clear active JSON
    clearActiveJSON() {
        if (this.jsonSets[this.activeJsonId]) {
            this.jsonSets[this.activeJsonId].content = '';
            this.jsonSets[this.activeJsonId].pages = null;
        }
        
        const textarea = document.getElementById('json-input');
        const container = document.getElementById('pages-container');
        
        if (textarea) textarea.value = '';
        if (container) container.innerHTML = '';
    }

    // Load example for active JSON
    async loadExampleForActive() {
        try {
            const response = await fetch('./sujets0-auto-example.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jsonData = await response.json();
            const textarea = document.getElementById('json-input');
            
            if (textarea) {
                textarea.value = JSON.stringify(jsonData, null, 2);
                this.jsonSets[this.activeJsonId].content = textarea.value;
                this.generateActivePreview();
            }
        } catch (error) {
            console.error('Error loading JSON file:', error);
            
            let errorMessage = 'Error loading sujets0-auto-example.json file';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage += '\n\n⚠️ IMPORTANT: Make sure you are accessing this page through the server at:\nhttp://localhost:8004/scenery/\n\nDo NOT open the HTML file directly in your browser!';
            } else if (error.message.includes('HTTP error')) {
                errorMessage += `\n\nHTTP Error: ${error.message}`;
            } else {
                errorMessage += `\n\nDetails: ${error.message}`;
            }
            
            alert(errorMessage);
        }
    }
}

// Global dual JSON manager instance
let dualJSONManager = null;

// Auto-update when textarea changes
function setupAutoUpdate() {
    const textarea = document.getElementById('json-input');
    textarea.addEventListener('input', function() {
        clearTimeout(window.updateTimeout);
        window.updateTimeout = setTimeout(() => {
            if (dualJSONManager) {
                dualJSONManager.generateActivePreview();
            }
        }, 300);
    });
}

// Setup margin form
function setupMarginForm() {
    const marginInputs = document.querySelectorAll('#margin-form input');
    const spaceInput = document.getElementById('space-between-divs');
    
    function updateMarginsFromForm() {
        const margins = {
            top: parseInt(document.getElementById('margin-top').value) || 10,
            right: parseInt(document.getElementById('margin-right').value) || 10,
            bottom: parseInt(document.getElementById('margin-bottom').value) || 10,
            left: parseInt(document.getElementById('margin-left').value) || 10
        };
        
        setMargins(margins);
        
        if (dualJSONManager) {
            dualJSONManager.generateActivePreview();
        }
    }
    
    function updateSpaceBetweenDivsFromForm() {
        const space = parseInt(spaceInput.value) || 3;
        setSpaceBetweenDivs(space);
        
        if (dualJSONManager) {
            dualJSONManager.generateActivePreview();
        }
    }
    
    marginInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(window.marginUpdateTimeout);
            window.marginUpdateTimeout = setTimeout(updateMarginsFromForm, 200);
        });
    });
    
    if (spaceInput) {
        spaceInput.addEventListener('input', () => {
            clearTimeout(window.spaceUpdateTimeout);
            window.spaceUpdateTimeout = setTimeout(updateSpaceBetweenDivsFromForm, 200);
        });
    }
    
    window.updateMarginsFromForm = updateMarginsFromForm;
}

// Setup font form
function setupFontForm() {
    const fontInputs = document.querySelectorAll('#font-form input');
    
    function updateFontSizesFromForm() {
        const fontSizes = {
            h1: parseInt(document.getElementById('font-h1').value) || 32,
            h2: parseInt(document.getElementById('font-h2').value) || 28,
            h3: parseInt(document.getElementById('font-h3').value) || 24,
            h4: parseInt(document.getElementById('font-h4').value) || 20,
            h5: parseInt(document.getElementById('font-h5').value) || 18,
            h6: parseInt(document.getElementById('font-h6').value) || 16,
            body: parseInt(document.getElementById('font-body').value) || 14
        };
        
        setFontSizes(fontSizes);
        
        if (dualJSONManager) {
            dualJSONManager.generateActivePreview();
        }
    }
    
    fontInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(window.fontUpdateTimeout);
            window.fontUpdateTimeout = setTimeout(updateFontSizesFromForm, 200);
        });
    });
    
    window.updateFontSizesFromForm = updateFontSizesFromForm;
}

// Setup debug mode toggle
function setupDebugMode() {
    const debugCheckbox = document.getElementById('debug-mode');
    if (debugCheckbox) {
        window.papyrusDebugMode = debugCheckbox.checked;
        
        debugCheckbox.addEventListener('change', function() {
            window.papyrusDebugMode = debugCheckbox.checked;
            if (dualJSONManager) {
                dualJSONManager.generateActivePreview();
            }
            
            if (debugCheckbox.checked) {
                setTimeout(() => {
                    updateDebugHeightIndicators();
                }, 400);
            }
        });
    }
}

// Setup page number toggle
function setupPageNumberMode() {
    const pageNumberCheckbox = document.getElementById('show-page-numbers');
    if (pageNumberCheckbox) {
        setShowPageNumbers(pageNumberCheckbox.checked);
        
        pageNumberCheckbox.addEventListener('change', function() {
            setShowPageNumbers(pageNumberCheckbox.checked);
            if (dualJSONManager) {
                dualJSONManager.generateActivePreview();
            }
        });
    }
}

// Wrapper functions for global access
function switchToJSON(id) {
    if (dualJSONManager) {
        dualJSONManager.switchToJSON(id);
    }
}

function generatePages() {
    if (dualJSONManager) {
        dualJSONManager.generateActivePreview();
        // Also update pagination to show all pages from both PDFs
        setTimeout(() => {
            dualJSONManager.updatePagination();
        }, 600);
    }
}

function printBothPDFs() {
    if (dualJSONManager) {
        dualJSONManager.printBothPDFs();
    }
}

function clearJSON() {
    if (dualJSONManager) {
        dualJSONManager.clearActiveJSON();
    }
}

function loadExampleJSON() {
    if (dualJSONManager) {
        dualJSONManager.loadExampleForActive();
    }
}

function displayJsonPages(jsonId) {
    if (dualJSONManager) {
        dualJSONManager.displayJsonPages(jsonId);
    }
}

// Initialize the dual JSON application
export function initializeDualApp(debugMode = false, debugMargin = 0) {
    // Store debug mode and margin globally
    window.papyrusDebugMode = debugMode;
    window.papyrusDebugMargin = debugMargin;
    
    // Initialize dual JSON manager
    dualJSONManager = new DualJSONManager();
    window.dualJSONManager = dualJSONManager;
    
    // Make functions globally available for button onclick handlers
    window.generatePages = generatePages;
    window.printPage = printBothPDFs; // Override to print both PDFs
    window.printBothPDFs = printBothPDFs;
    window.switchToJSON = switchToJSON;
    window.displayJsonPages = displayJsonPages;
    window.updateMarginsFromForm = () => {}; // Will be set by setupMarginForm
    window.updateFontSizesFromForm = () => {}; // Will be set by setupFontForm
    window.loadExampleJSON = loadExampleJSON;
    window.clearJSON = clearJSON;
    window.getCurrentSpaceBetweenDivs = getCurrentSpaceBetweenDivs;
    
    // Initialize margins, fonts, spacing, and page numbers
    initializeMargins();
    initializeSpaceBetweenDivs();
    initializeFontSizes();
    initializePageNumberConfig();
    
    // Set up event listeners
    setupAutoUpdate();
    setupMarginForm();
    setupFontForm();
    setupDebugMode();
    setupPageNumberMode();
    
    // Initialize the UI
    dualJSONManager.updateActiveDisplay();
    
    // Auto-load example JSON for first PDF
    setTimeout(loadExampleJSON, 100);
    
    console.log('✅ Dual JSON application initialized');
} 