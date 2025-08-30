/**
 * Application initialization and event handling
 */

import { generatePages } from './preview/index.js';
import { printPage } from './print-manager.js';
import { initializeMargins, setMargins, getCurrentMargins, initializeSpaceBetweenDivs, setSpaceBetweenDivs, getCurrentSpaceBetweenDivs } from './margin-config.js';
import { initializeFontSizes, setFontSizes, getCurrentFontSizes } from './font-config.js';
import { initializePageNumberConfig, setShowPageNumbers, getShowPageNumbers } from './page-number-config.js';
import { updateDebugHeightIndicators } from '../utils/json-handler.js';
import { DocumentManager } from './document-manager.js';

let documentManager;

/**
 * Prints the content of the currently active document.
 */
function printActiveDocument() {
    const activeDoc = documentManager.getActiveDocument();
    if (activeDoc) {
        const contentToPrint = document.getElementById('pages-container').innerHTML;
        printPage(contentToPrint);
    }
}

// Auto-update when textarea changes
function setupAutoUpdate() {
    const textarea = document.getElementById('json-input');
    textarea.addEventListener('input', function() {
        documentManager.updateActiveDocumentContent(textarea.value);
        clearTimeout(window.updateTimeout);
        window.updateTimeout = setTimeout(generatePages, 300);
    });
}

// Setup debug mode toggle
function setupDebugMode() {
    const debugCheckbox = document.getElementById('debug-mode');
    if (debugCheckbox) {
        // Initialize debug mode based on checkbox state
        window.papyrusDebugMode = debugCheckbox.checked;
        
        // Set up change listener
        debugCheckbox.addEventListener('change', function() {
            window.papyrusDebugMode = debugCheckbox.checked;
            generatePages(); // Regenerate with new debug mode
            
            // Update debug indicators after a short delay
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
        // Initialize page number mode based on checkbox state
        setShowPageNumbers(pageNumberCheckbox.checked);
        
        // Set up change listener
        pageNumberCheckbox.addEventListener('change', function() {
            setShowPageNumbers(pageNumberCheckbox.checked);
            generatePages(); // Regenerate with new page number setting
        });
    }
}

// Setup margin form handlers
function setupMarginForm() {
    const marginForm = document.getElementById('margin-form');
    const marginInputs = marginForm.querySelectorAll('input[type="number"]');
    
    // Initialize form with current values
    const currentMargins = getCurrentMargins();
    const currentSpace = getCurrentSpaceBetweenDivs();
    
    marginInputs.forEach(input => {
        if (input.name === 'space-between-divs') {
            input.value = currentSpace;
        } else {
            const side = input.name.replace('margin-', '');
            input.value = currentMargins[side];
        }
    });
    
    // Handle margin and spacing changes
    marginInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(window.marginUpdateTimeout);
            window.marginUpdateTimeout = setTimeout(updateMarginsFromForm, 200);
        });
    });
}

// Update margins from form values
function updateMarginsFromForm() {
    const marginForm = document.getElementById('margin-form');
    const formData = new FormData(marginForm);
    
    const newMargins = {
        top: parseFloat(formData.get('margin-top')) || 5,
        right: parseFloat(formData.get('margin-right')) || 5,
        bottom: parseFloat(formData.get('margin-bottom')) || 5,
        left: parseFloat(formData.get('margin-left')) || 5
    };
    
    const newSpaceBetweenDivs = parseFloat(formData.get('space-between-divs')) ?? 0;
    
    setMargins(newMargins);
    setSpaceBetweenDivs(newSpaceBetweenDivs);
    generatePages(); // Regenerate preview with new margins, spacing and update statistics
    
    // Update debug indicators if debug mode is active
    if (window.papyrusDebugMode) {
        setTimeout(() => {
            updateDebugHeightIndicators();
        }, 300);
    }
}

// Setup font form handlers
function setupFontForm() {
    const fontForm = document.getElementById('font-form');
    const fontInputs = fontForm.querySelectorAll('input[type="number"]');
    
    // Initialize form with current values
    const currentFonts = getCurrentFontSizes();
    fontInputs.forEach(input => {
        const fontType = input.name.replace('font-', '');
        input.value = currentFonts[fontType];
    });
    
    // Handle font size changes
    fontInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(window.fontUpdateTimeout);
            window.fontUpdateTimeout = setTimeout(updateFontSizesFromForm, 200);
        });
    });
}

// Update font sizes from form values
function updateFontSizesFromForm() {
    const fontForm = document.getElementById('font-form');
    const formData = new FormData(fontForm);
    
    const newFontSizes = {
        h1: parseFloat(formData.get('font-h1')) || 32,
        h2: parseFloat(formData.get('font-h2')) || 28,
        h3: parseFloat(formData.get('font-h3')) || 24,
        h4: parseFloat(formData.get('font-h4')) || 20,
        h5: parseFloat(formData.get('font-h5')) || 18,
        h6: parseFloat(formData.get('font-h6')) || 16,
        body: parseFloat(formData.get('font-body')) || 14
    };
    
    setFontSizes(newFontSizes);
    generatePages(); // Regenerate preview with new font sizes and update statistics
    
    // Update debug indicators if debug mode is active
    if (window.papyrusDebugMode) {
        setTimeout(() => {
            updateDebugHeightIndicators();
        }, 300);
    }
}

// Initialize KaTeX
function initializeKaTeX() {
    renderMathInElement(document.body, {
        delimiters: [{
            left: '$$',
            right: '$$',
            display: true
        }, {
            left: '$',
            right: '$',
            display: false
        }]
    });
}

// Load JSON from external file
async function loadExampleJSON() {
    try {
        const response = await fetch('./sujets0-auto-example.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        const textarea = document.getElementById('json-input');
        const jsonString = JSON.stringify(jsonData, null, 2);
        textarea.value = jsonString;
        documentManager.updateActiveDocumentContent(jsonString);
        generatePages(); // Regenerate preview with loaded content
    } catch (error) {
        console.error('Error loading JSON file:', error);
        
        // Provide more helpful error messages
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

// Clear JSON textarea
function clearJSON() {
    const textarea = document.getElementById('json-input');
    textarea.value = '[]';
    documentManager.updateActiveDocumentContent('[]');
    generatePages();
}

// Initialize the application
export function initializeApp(debugMode = false, debugMargin = 0) {
    // Store debug mode and margin globally
    window.papyrusDebugMode = debugMode;
    window.papyrusDebugMargin = debugMargin;
    
    // Make functions globally available for button onclick handlers
    window.generatePages = generatePages;
    window.printPage = printPage; // "Print All" is now handled by the main print function
    window.printActiveDocument = printActiveDocument;
    window.updateMarginsFromForm = updateMarginsFromForm;
    window.updateFontSizesFromForm = updateFontSizesFromForm;
    window.loadExampleJSON = loadExampleJSON;
    window.clearJSON = clearJSON;
    window.getCurrentSpaceBetweenDivs = getCurrentSpaceBetweenDivs;

    // Initialize the document manager
    documentManager = new DocumentManager('document-tabs', 'json-input');
    
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
    
    // Auto-load example JSON on page load
    setTimeout(loadExampleJSON, 100);
}

// Set up DOM event listeners
document.addEventListener('DOMContentLoaded', initializeKaTeX);
window.addEventListener('load', initializeApp); 