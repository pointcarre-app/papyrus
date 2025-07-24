/**
 * Multi-Document Application Initialization
 * Manages multiple, independent JSON inputs for PDF generation
 */

import { generatePreviewFromJSON } from './preview-generator.js';
import { printPage } from './print-manager.js';
import { initializeMargins, setMargins, getCurrentMargins, initializeSpaceBetweenDivs, setSpaceBetweenDivs, getCurrentSpaceBetweenDivs } from './margin-config.js';
import { initializeFontSizes, setFontSizes, getCurrentFontSizes } from './font-config.js';
import { initializePageNumberConfig, setShowPageNumbers, getShowPageNumbers } from './page-number-config.js';
import { updateDebugHeightIndicators, getJSONFromTextarea, createElementFromJSON } from '../utils/json-handler.js';

// Multi-Document Manager
class DocumentManager {
    constructor() {
        this.documents = [];
        this.activeDocumentId = null;
        this.nextDocumentId = 1;
    }

    // Add a new document
    addDocument(content = '') {
        const newDoc = {
            id: this.nextDocumentId,
            name: `Doc ${this.nextDocumentId}`,
            content: content,
            pages: null
        };
        this.documents.push(newDoc);
        this.activeDocumentId = this.nextDocumentId;
        this.nextDocumentId++;
        this.renderTabs();
        this.loadActiveContent();
    }

    // Remove a document
    removeDocument(id) {
        this.documents = this.documents.filter(doc => doc.id !== id);
        if (this.activeDocumentId === id) {
            this.activeDocumentId = this.documents.length > 0 ? this.documents[0].id : null;
            this.loadActiveContent();
        }
        this.renderTabs();
    }

    // Switch active document
    switchToDocument(id) {
        this.saveCurrentContent();
        this.activeDocumentId = id;
        this.renderTabs();
        this.loadActiveContent();
    }

    // Save current textarea content to the active document
    saveCurrentContent() {
        const textarea = document.getElementById('json-input');
        if (textarea && this.activeDocumentId) {
            const activeDoc = this.documents.find(doc => doc.id === this.activeDocumentId);
            if (activeDoc) {
                activeDoc.content = textarea.value;
            }
        }
    }

    // Load active document content into textarea
    loadActiveContent() {
        const textarea = document.getElementById('json-input');
        const pagesContainer = document.getElementById('pages-container');
        const activeIndicator = document.getElementById('active-document-indicator');
        
        if (textarea && this.activeDocumentId) {
            const activeDoc = this.documents.find(doc => doc.id === this.activeDocumentId);
            if (activeDoc) {
                textarea.value = activeDoc.content;
                pagesContainer.innerHTML = activeDoc.pages || '';
                if(activeIndicator) activeIndicator.textContent = `Previewing: ${activeDoc.name}`;
            }
        } else {
            textarea.value = '';
            pagesContainer.innerHTML = '';
            if(activeIndicator) activeIndicator.textContent = 'No document selected';
        }
    }

    // Render the document tabs
    renderTabs() {
        const tabsContainer = document.getElementById('document-tabs');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = '';
        this.documents.forEach(doc => {
            const tab = document.createElement('button');
            tab.className = `btn btn-xs ${doc.id === this.activeDocumentId ? 'btn-primary' : 'btn-outline'}`;
            tab.textContent = doc.name;
            tab.onclick = () => this.switchToDocument(doc.id);

            const closeBtn = document.createElement('button');
            closeBtn.className = 'btn btn-xs btn-ghost ml-1';
            closeBtn.textContent = 'x';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeDocument(doc.id);
            };
            tab.appendChild(closeBtn);

            tabsContainer.appendChild(tab);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-xs btn-outline';
        addBtn.textContent = '+ Add';
        addBtn.onclick = () => this.addDocument();
        tabsContainer.appendChild(addBtn);
    }

    // Generate preview for the active document
    generateActivePreview() {
        this.saveCurrentContent();
        const activeDoc = this.documents.find(doc => doc.id === this.activeDocumentId);
        if (!activeDoc || !activeDoc.content.trim()) {
            const container = document.getElementById('pages-container');
            container.innerHTML = '';
            if(activeDoc) activeDoc.pages = null;
            return;
        }

        generatePreviewFromJSON();

        setTimeout(() => {
            const container = document.getElementById('pages-container');
            if (activeDoc) {
                activeDoc.pages = container.innerHTML.trim();
            }
        }, 500);
    }
    
    // Generate preview for a specific document ID
    async generatePreviewForDoc(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc || !doc.content.trim()) {
            doc.pages = null;
            return;
        }

        // Temporarily set textarea for generator function
        const textarea = document.getElementById('json-input');
        const originalContent = textarea.value;
        textarea.value = doc.content;

        generatePreviewFromJSON();

        // This is a bit tricky due to the async nature of the preview generator
        await new Promise(resolve => setTimeout(resolve, 600));

        const container = document.getElementById('pages-container');
        doc.pages = container.innerHTML.trim();

        // Restore textarea and active preview
        textarea.value = originalContent;
        this.loadActiveContent();
    }
    
    // Print all documents
    async printAllDocuments() {
        console.log("Generating previews for all documents...");
        for (const doc of this.documents) {
            await this.generatePreviewForDoc(doc.id);
        }
        console.log("All previews generated.");

        const validDocs = this.documents.filter(doc => doc.content.trim() && doc.pages);
        if (validDocs.length === 0) {
            alert('No content to print. Please add JSON content to at least one document.');
            return;
        }

        let combinedContent = '';
        validDocs.forEach((doc, index) => {
            let content = doc.pages;
            if (index > 0) {
                content = content.replace(
                    '<div class="page-preview"',
                    '<div class="page-preview" style="page-break-before: always;"'
                );
            }
            combinedContent += content;
        });
        
        printPage(combinedContent);
    }

    // Print only the active document
    printActiveDocument() {
        const activeDoc = this.documents.find(doc => doc.id === this.activeDocumentId);
        if (!activeDoc || !activeDoc.pages) {
            alert("No content to print for the active document.");
            return;
        }
        printPage(activeDoc.pages);
    }

    // Clear active JSON
    clearActiveJSON() {
        const activeDoc = this.documents.find(doc => doc.id === this.activeDocumentId);
        if (activeDoc) {
            activeDoc.content = '';
            activeDoc.pages = null;
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
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const jsonData = await response.json();
            const textarea = document.getElementById('json-input');
            
            if (textarea) {
                textarea.value = JSON.stringify(jsonData, null, 2);
                this.saveCurrentContent();
                this.generateActivePreview();
            }
        } catch (error) {
            console.error('Error loading JSON file:', error);
            alert('Error loading example JSON. See console for details.');
        }
    }
}

// Global document manager instance
let docManager = null;

// Auto-update when textarea changes
function setupAutoUpdate() {
    const textarea = document.getElementById('json-input');
    textarea.addEventListener('input', function() {
        clearTimeout(window.updateTimeout);
        window.updateTimeout = setTimeout(() => {
            if (docManager) {
                docManager.generateActivePreview();
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
        if (docManager) docManager.generateActivePreview();
    }
    
    function updateSpaceBetweenDivsFromForm() {
        const space = parseInt(spaceInput.value) || 3;
        setSpaceBetweenDivs(space);
        if (docManager) docManager.generateActivePreview();
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
        if (docManager) docManager.generateActivePreview();
    }
    
    fontInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(window.fontUpdateTimeout);
            window.fontUpdateTimeout = setTimeout(updateFontSizesFromForm, 200);
        });
    });
}

// Setup debug mode toggle
function setupDebugMode() {
    const debugCheckbox = document.getElementById('debug-mode');
    if (debugCheckbox) {
        window.papyrusDebugMode = debugCheckbox.checked;
        debugCheckbox.addEventListener('change', function() {
            window.papyrusDebugMode = debugCheckbox.checked;
            if (docManager) docManager.generateActivePreview();
            if (debugCheckbox.checked) {
                setTimeout(updateDebugHeightIndicators, 400);
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
            if (docManager) docManager.generateActivePreview();
        });
    }
}

function printAllDocuments() {
    if (docManager) {
        docManager.printAllDocuments();
    }
}

function printActiveDocument() {
    if (docManager) {
        docManager.printActiveDocument();
    }
}

function clearJSON() {
    if (docManager) {
        docManager.clearActiveJSON();
    }
}

function loadExampleJSON() {
    if (docManager) {
        docManager.loadExampleForActive();
    }
}

function initializeApp(mode = 'multi') {
    docManager = new DocumentManager();
    window.docManager = docManager;

    // Make functions globally available
    window.printPage = printAllDocuments; // "Print All" button
    window.printActiveDocument = printActiveDocument;
    window.clearJSON = clearJSON;
    window.loadExampleJSON = loadExampleJSON;

    initializeMargins();
    initializeSpaceBetweenDivs();
    initializeFontSizes();
    initializePageNumberConfig();
    
    setupAutoUpdate();
    setupMarginForm();
    setupFontForm();
    setupDebugMode();
    setupPageNumberMode();

    if (mode === 'single') {
        docManager.addDocument();
    } else {
        docManager.addDocument(); // Start with one document
        docManager.addDocument(); // And a second one
    }
    
    docManager.renderTabs();
    docManager.loadActiveContent();
    setTimeout(() => docManager.loadExampleForActive(), 100);

    console.log(`✅ Application initialized in ${mode} mode`);
}

export function initializeSingleApp() {
    initializeApp('single');
}

export function initializeMultiApp() {
    initializeApp('multi');
} 