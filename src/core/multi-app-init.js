/**
 * Multi-JSON Application initialization and event handling
 */

import { generatePreviewFromJSON } from './preview-generator.js';
import { printPage } from './print-manager.js';
import { initializeMargins, setMargins, getCurrentMargins, initializeSpaceBetweenDivs, setSpaceBetweenDivs, getCurrentSpaceBetweenDivs } from './margin-config.js';
import { initializeFontSizes, setFontSizes, getCurrentFontSizes } from './font-config.js';
import { initializePageNumberConfig, setShowPageNumbers, getShowPageNumbers } from './page-number-config.js';
import { updateDebugHeightIndicators, getJSONFromTextarea, createElementFromJSON } from '../utils/json-handler.js';

// Multi-JSON Manager
class MultiJSONManager {
    constructor() {
        this.jsonSets = new Map(); // Map<id, {id, name, content, pages}>
        this.currentJSONId = 1;
        this.currentPreviewIndex = 0;
        this.nextId = 2;
        this.existingTabs = new Set(); // Track which tab IDs exist in DOM
        this.isInitialized = false; // Prevent multiple initializations
        
        // Initialize with first JSON
        this.jsonSets.set(1, {
            id: 1,
            name: 'JSON #1',
            content: '',
            pages: null
        });
    }
    
    addNewJSON() {
        console.log(`➕ Creating new JSON #${this.nextId}`);
        
        // Save current content before creating new JSON
        this.saveCurrentTextareaContent();
        
        const newId = this.nextId++;
        const newSet = {
            id: newId,
            name: `JSON #${newId}`,
            content: '', // Explicitly empty
            pages: null
        };
        
        this.jsonSets.set(newId, newSet);
        
        // Rebuild all tabs to prevent duplicates
        this.rebuildTabs();
        
        // Create textarea for new JSON (if needed)
        this.createJSONTextarea(newSet);
        
        // Switch to the new JSON
        this.switchToJSON(newId);
        
        console.log(`✅ Created new empty JSON #${newId}`);
        return newId;
    }
    
    removeJSON(id) {
        if (this.jsonSets.size <= 1) {
            alert('Cannot remove the last JSON. At least one JSON input is required.');
            return false;
        }
        
        this.jsonSets.delete(id);
        
        // Remove from tracking
        this.existingTabs.delete(id);
        
        // Remove DOM elements
        const tab = document.querySelector(`[data-json-id="${id}"].tab`);
        const textarea = document.querySelector(`[data-json-id="${id}"].json-textarea-container`);
        
        if (tab) {
            tab.remove();
        }
        if (textarea) {
            textarea.remove();
        }
        
        // Switch to first available JSON if current was removed
        if (this.currentJSONId === id) {
            const firstAvailable = Array.from(this.jsonSets.keys())[0];
            this.switchToJSON(firstAvailable);
        }
        
        // Update preview if this JSON was being displayed
        if (this.currentPreviewIndex === id - 1) {
            this.currentPreviewIndex = 0;
            this.updatePreviewDisplay();
        }
        
        this.updatePagination();
        return true;
    }
    
    switchToJSON(id) {
        if (!this.jsonSets.has(id)) return;
        
        // Save current JSON content first
        if (this.currentJSONId) {
            // Get the correct textarea for the current JSON
            let currentTextarea;
            if (this.currentJSONId === 1) {
                currentTextarea = document.getElementById('json-input');
            } else {
                currentTextarea = document.getElementById(`json-input-${this.currentJSONId}`);
            }
            
            if (currentTextarea) {
                const currentSet = this.jsonSets.get(this.currentJSONId);
                if (currentSet) {
                    currentSet.content = currentTextarea.value;
                    console.log(`💾 Saved content for JSON #${this.currentJSONId}: ${currentSet.content.length} characters`);
                }
            }
        }
        
        // Update current ID
        this.currentJSONId = id;
        
        // Update UI
        this.updateTabStates();
        this.updateTextareaStates();
        
        // Load content into the target textarea
        let targetTextarea;
        if (id === 1) {
            targetTextarea = document.getElementById('json-input');
        } else {
            targetTextarea = document.getElementById(`json-input-${id}`);
        }
        
        const newSet = this.jsonSets.get(id);
        if (targetTextarea && newSet) {
            targetTextarea.value = newSet.content;
            console.log(`📄 Loaded content for JSON #${id}: ${newSet.content.length} characters`);
        }
        
        // Update JSON counter and pagination
        this.updateJSONCounter();
        this.updatePagination();
        
        // Force cleanup duplicates when switching
        this.forcefullyRemoveDuplicates();
    }
    
    createJSONTab(jsonSet) {
        let tabsContainer = document.getElementById('json-tabs');
        if (!tabsContainer) {
            // Create tabs container if it doesn't exist
            tabsContainer = document.createElement('div');
            tabsContainer.id = 'json-tabs';
            tabsContainer.className = 'tabs tabs-boxed bg-white mb-4 flex-wrap gap-1';
            
            // Insert after the header
            const header = document.querySelector('h2');
            if (header && header.parentNode) {
                header.parentNode.insertBefore(tabsContainer, header.nextSibling);
            }
        }
        
        const newTab = document.createElement('a');
        newTab.className = 'tab tab-lifted';
        newTab.setAttribute('data-json-id', jsonSet.id);
        newTab.textContent = jsonSet.name;
        newTab.onclick = () => this.switchToJSON(jsonSet.id);
        
        tabsContainer.appendChild(newTab);
        this.existingTabs.add(jsonSet.id);
        console.log(`✅ Created tab for JSON #${jsonSet.id}: "${jsonSet.name}"`);
        
        // FORCE cleanup duplicates after every tab creation
        this.forcefullyRemoveDuplicates();
    }
    
    // Aggressively remove duplicate tabs
    forcefullyRemoveDuplicates() {
        const tabsContainer = document.getElementById('json-tabs');
        if (!tabsContainer) return;
        
        const allTabs = Array.from(tabsContainer.querySelectorAll('.tab'));
        const seenIds = new Set();
        let removedCount = 0;
        
        console.log(`🔍 Checking ${allTabs.length} tabs for duplicates`);
        
        allTabs.forEach((tab, index) => {
            const jsonId = parseInt(tab.getAttribute('data-json-id'));
            console.log(`Tab ${index}: JSON #${jsonId}, text: "${tab.textContent}"`);
            
            if (seenIds.has(jsonId)) {
                console.log(`❌ Removing duplicate tab for JSON #${jsonId}`);
                tab.remove();
                removedCount++;
            } else {
                seenIds.add(jsonId);
            }
        });
        
        console.log(`🧹 Removed ${removedCount} duplicate tabs, ${seenIds.size} unique tabs remain`);
        
        // Update our tracking to match reality
        this.existingTabs.clear();
        seenIds.forEach(id => this.existingTabs.add(id));
    }
    
    createJSONTextarea(jsonSet) {
        // Check if textarea already exists for this JSON
        const existingTextarea = document.getElementById(`json-input-${jsonSet.id}`);
        if (existingTextarea) {
            console.log(`⚠️ Textarea for JSON #${jsonSet.id} already exists, skipping creation`);
            return;
        }
        
        // Skip creating textarea for JSON #1 since it uses the default textarea
        if (jsonSet.id === 1) {
            console.log(`ℹ️ JSON #1 uses default textarea, skipping creation`);
            return;
        }
        
        let textareaContainer = document.getElementById('json-textareas');
        if (!textareaContainer) {
            // Create textarea container if it doesn't exist  
            textareaContainer = document.createElement('div');
            textareaContainer.id = 'json-textareas';
            textareaContainer.className = 'relative';
            
            // Insert in the right location
            const existingTextarea = document.getElementById('json-input');
            if (existingTextarea && existingTextarea.parentNode) {
                existingTextarea.parentNode.appendChild(textareaContainer);
            }
        }
        
        const newContainer = document.createElement('div');
        newContainer.className = 'json-textarea-container';
        newContainer.setAttribute('data-json-id', jsonSet.id);
        newContainer.style.display = jsonSet.id === this.currentJSONId ? 'block' : 'none';
        
        const newTextarea = document.createElement('textarea');
        newTextarea.id = `json-input-${jsonSet.id}`;
        newTextarea.placeholder = 'JSON content will be loaded here...';
        newTextarea.className = 'w-full h-80 font-mono text-sm p-3 border border-gray-300 rounded-md resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent';
        newTextarea.value = jsonSet.content || ''; // Ensure empty string if no content
        
        console.log(`📝 Created textarea for JSON #${jsonSet.id} with content: "${jsonSet.content}"`)
        
        // Add auto-update functionality
        newTextarea.addEventListener('input', () => {
            clearTimeout(window.updateTimeout);
            window.updateTimeout = setTimeout(() => {
                jsonSet.content = newTextarea.value;
            }, 300);
        });
        
        newContainer.appendChild(newTextarea);
        textareaContainer.appendChild(newContainer);
        
        // Hide the default textarea when switching to non-first JSON
        const defaultTextarea = document.getElementById('json-input');
        if (defaultTextarea && this.currentJSONId !== 1) {
            defaultTextarea.style.display = 'none';
        }
    }
    
    updateTabStates() {
        document.querySelectorAll('[data-json-id]').forEach(tab => {
            if (tab.classList.contains('tab')) {
                const tabId = parseInt(tab.getAttribute('data-json-id'));
                tab.classList.toggle('tab-active', tabId === this.currentJSONId);
            }
        });
    }
    
    updateTextareaStates() {
        // Show/hide the default textarea
        const defaultTextarea = document.getElementById('json-input');
        if (defaultTextarea) {
            defaultTextarea.style.display = this.currentJSONId === 1 ? 'block' : 'none';
        }
        
        // Show/hide multi-JSON textareas
        document.querySelectorAll('.json-textarea-container').forEach(container => {
            const containerId = parseInt(container.getAttribute('data-json-id'));
            container.style.display = containerId === this.currentJSONId ? 'block' : 'none';
        });
    }
    
    getAllJSONContents() {
        // Save current textarea content first
        this.saveCurrentTextareaContent();
        
        return Array.from(this.jsonSets.values()).map(set => ({
            id: set.id,
            name: set.name,
            content: set.content
        }));
    }
    
    saveCurrentTextareaContent() {
        if (this.currentJSONId) {
            // Get the correct textarea for the current JSON
            let textarea;
            if (this.currentJSONId === 1) {
                textarea = document.getElementById('json-input');
            } else {
                textarea = document.getElementById(`json-input-${this.currentJSONId}`);
            }
            
            if (textarea) {
                const currentSet = this.jsonSets.get(this.currentJSONId);
                if (currentSet) {
                    const oldContent = currentSet.content;
                    currentSet.content = textarea.value;
                    console.log(`💾 saveCurrentTextareaContent: JSON #${this.currentJSONId} - old: "${oldContent}" -> new: "${currentSet.content}"`);
                }
            } else {
                console.log(`⚠️ saveCurrentTextareaContent: No textarea found for JSON #${this.currentJSONId}`);
            }
        }
    }
    
    updatePagination() {
        // Use the new preview navigation function
        if (window.updatePreviewNavigation) {
            window.updatePreviewNavigation();
        }
    }
    
    showPreviewSet(index) {
        const jsonArray = Array.from(this.jsonSets.values());
        if (index >= 0 && index < jsonArray.length) {
            this.currentPreviewIndex = index;
            this.updatePreviewDisplay();
            this.updatePagination();
        }
    }
    
    nextPreview() {
        const jsonArray = Array.from(this.jsonSets.values());
        if (this.currentPreviewIndex < jsonArray.length - 1) {
            this.currentPreviewIndex++;
            this.updatePreviewDisplay();
            this.updatePagination();
        }
    }
    
    previousPreview() {
        if (this.currentPreviewIndex > 0) {
            this.currentPreviewIndex--;
            this.updatePreviewDisplay();
            this.updatePagination();
        }
    }
    
    updatePreviewDisplay() {
        const jsonArray = Array.from(this.jsonSets.values());
        const currentSet = jsonArray[this.currentPreviewIndex];
        
        if (!currentSet) {
            const pagesContainer = document.getElementById('pages-container');
            if (pagesContainer) {
                pagesContainer.innerHTML = '<div class="text-center text-gray-500 p-8">No PDFs generated yet. Click "Generate All" to create previews.</div>';
            }
            
            // Update preview navigation
            if (window.updatePreviewNavigation) {
                window.updatePreviewNavigation();
            }
            return;
        }
        
        // Update indicator - count actual page elements
        let pageCount = 0;
        if (currentSet.pages) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = currentSet.pages;
            pageCount = tempDiv.querySelectorAll('.page-preview').length;
        }
        
        // Update preview navigation with current info
        if (window.updatePreviewNavigation) {
            window.updatePreviewNavigation();
        }
        
        // Display pages with proper container setup
        const pagesContainer = document.getElementById('pages-container');
        if (currentSet.pages && currentSet.pages.trim()) {
            // Clear container first
            pagesContainer.innerHTML = '';
            
            // Create a temporary container to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = currentSet.pages;
            
            // Move each page element individually to preserve styling
            const pageElements = tempDiv.querySelectorAll('.page-preview');
            if (pageElements.length > 0) {
                pageElements.forEach((pageElement, index) => {
                    // Ensure proper classes and styling are maintained
                    if (!pageElement.classList.contains('page-preview')) {
                        pageElement.classList.add('page-preview');
                    }
                    
                    // Clone and append to maintain event listeners and styling
                    const clonedPage = pageElement.cloneNode(true);
                    pagesContainer.appendChild(clonedPage);
                });
                
                // Re-render KaTeX for the displayed content
                setTimeout(() => {
                    if (window.renderMathInElement) {
                        renderMathInElement(pagesContainer, {
                            delimiters: [
                                {left: '$$', right: '$$', display: true}, 
                                {left: '$', right: '$', display: false}
                            ]
                        });
                    }
                }, 100);
            } else {
                // Fallback: set innerHTML directly if no page elements found
                pagesContainer.innerHTML = currentSet.pages;
            }
        } else {
            pagesContainer.innerHTML = '<div class="text-center text-gray-500 p-8">No preview generated for this JSON. Click "Generate All" to create a preview.</div>';
        }
    }
    
    // New methods for enhanced multi-JSON functionality
    duplicateCurrentJSON() {
        const currentSet = this.jsonSets.get(this.currentJSONId);
        if (!currentSet) return;
        
        // Save current content first
        this.saveCurrentTextareaContent();
        
        const newId = this.addNewJSON();
        const newSet = this.jsonSets.get(newId);
        
        if (newSet && currentSet) {
            newSet.content = currentSet.content;
            newSet.name = `${currentSet.name} (Copy)`;
            
            // Update the textarea content
            const newTextarea = document.getElementById(`json-input-${newId}`);
            if (newTextarea) {
                newTextarea.value = currentSet.content;
            }
            
            // Update tab name
            const newTab = document.querySelector(`[data-json-id="${newId}"]`);
            if (newTab) {
                newTab.textContent = newSet.name;
            }
        }
        
        this.updateJSONCounter();
        return newId;
    }
    
    bulkCreateJSONs(count = 5) {
        const newIds = [];
        
        for (let i = 0; i < count; i++) {
            const newId = this.addNewJSON();
            newIds.push(newId);
        }
        
        this.updateJSONCounter();
        return newIds;
    }
    
    updateJSONCounter() {
        const counter = document.getElementById('json-counter');
        if (counter) {
            const count = this.jsonSets.size;
            counter.textContent = `${count} PDF${count !== 1 ? 's' : ''}`;
        }
    }
    
    // Clean up duplicate tabs
    cleanupDuplicateTabs() {
        const tabsContainer = document.getElementById('json-tabs');
        if (!tabsContainer) return;
        
        const seenIds = new Set();
        const tabs = Array.from(tabsContainer.querySelectorAll('.tab'));
        
        console.log(`🧹 Cleaning up tabs. Found ${tabs.length} tabs`);
        
        tabs.forEach((tab, index) => {
            const jsonId = parseInt(tab.getAttribute('data-json-id'));
            console.log(`Tab ${index}: JSON #${jsonId}, text: "${tab.textContent}"`);
            
            if (seenIds.has(jsonId)) {
                console.log(`🗑️ Removing duplicate tab for JSON #${jsonId}`);
                tab.remove();
            } else {
                seenIds.add(jsonId);
            }
        });
        
        console.log(`✅ Cleanup complete. Remaining tabs: ${seenIds.size}`);
    }
    
    // Initialize tabs (only called once)
    initializeTabs() {
        if (this.isInitialized) {
            console.log(`⚠️ Tabs already initialized, skipping`);
            return;
        }
        
        console.log(`🚀 Initializing tabs for the first time`);
        
        // Clear any existing tabs and tracking
        this.clearAllTabs();
        
        // Create tab for first JSON only
        const firstSet = this.jsonSets.get(1);
        if (firstSet) {
            this.createJSONTab(firstSet);
        }
        
        // Update tab states
        this.updateTabStates();
        
        this.isInitialized = true;
        console.log(`✅ Tab initialization complete`);
    }
    
    // Clear all tabs and reset tracking
    clearAllTabs() {
        console.log(`🧹 Clearing all tabs and resetting tracking`);
        
        const tabsContainer = document.getElementById('json-tabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = '';
        }
        
        this.existingTabs.clear();
    }
    
    // Completely rebuild tabs from scratch (for adding new JSONs)
    rebuildTabs() {
        console.log(`🔄 Rebuilding all tabs from scratch`);
        
        // Clear existing tabs and tracking
        this.clearAllTabs();
        
        // Recreate tabs for all JSON sets
        Array.from(this.jsonSets.values())
            .sort((a, b) => a.id - b.id) // Sort by ID to ensure correct order
            .forEach(jsonSet => {
                console.log(`📑 Creating tab for JSON #${jsonSet.id}: "${jsonSet.name}"`);
                this.createJSONTab(jsonSet);
            });
        
        // Update tab states
        this.updateTabStates();
    }
    
    validateCurrentJSON() {
        this.saveCurrentTextareaContent();
        const currentSet = this.jsonSets.get(this.currentJSONId);
        if (!currentSet) return false;
        
        try {
            const parsed = JSON.parse(currentSet.content || '[]');
            if (!Array.isArray(parsed)) {
                alert('❌ Invalid JSON: Content must be an array');
                return false;
            }
            
            if (parsed.length === 0) {
                alert('⚠️ Warning: JSON array is empty');
                return true;
            }
            
            // Validate each element
            for (let i = 0; i < parsed.length; i++) {
                const element = parsed[i];
                if (!element.id || !element.html) {
                    alert(`❌ Invalid element at index ${i}: Missing 'id' or 'html' field`);
                    return false;
                }
            }
            
            alert(`✅ Valid JSON with ${parsed.length} elements`);
            return true;
        } catch (error) {
            alert(`❌ JSON Parse Error: ${error.message}`);
            return false;
        }
    }
    
    loadPresetExams() {
        // Clear existing JSONs except the first one
        const currentIds = Array.from(this.jsonSets.keys()).filter(id => id !== 1);
        currentIds.forEach(id => this.removeJSON(id));
        
        // Define preset exam JSONs
        const presetExams = [
            {
                name: "Math Exam A",
                content: JSON.stringify([
                    {
                        "id": "header-a",
                        "html": "<table style='width: 100%; border-collapse: collapse; border: 1px solid #000;'><tr><td style='border: 1px solid #000; padding: 8px;'>Name: _______________</td><td style='border: 1px solid #000; padding: 8px;'>Class: _______________</td><td style='border: 1px solid #000; padding: 8px;'>Date: _______________</td></tr></table>",
                        "classes": [],
                        "style": "",
                        "isPapyrusHeader": true
                    },
                    {
                        "id": "title-a",
                        "html": "<h1 style='text-align: center; margin: 20px 0;'>Mathematics Exam - Version A</h1>",
                        "classes": [],
                        "style": ""
                    },
                    {
                        "id": "problem-a1",
                        "html": "<div><strong>1.</strong> Solve for x: $3x + 7 = 22$</div>",
                        "classes": [],
                        "style": "margin: 15px 0;"
                    },
                    {
                        "id": "problem-a2",
                        "html": "<div><strong>2.</strong> Find the derivative: $\\frac{d}{dx}[x^3 + 2x^2 - 5x + 1]$</div>",
                        "classes": [],
                        "style": "margin: 15px 0;"
                    }
                ], null, 2)
            },
            {
                name: "Math Exam B",
                content: JSON.stringify([
                    {
                        "id": "header-b",
                        "html": "<table style='width: 100%; border-collapse: collapse; border: 1px solid #000;'><tr><td style='border: 1px solid #000; padding: 8px;'>Name: _______________</td><td style='border: 1px solid #000; padding: 8px;'>Class: _______________</td><td style='border: 1px solid #000; padding: 8px;'>Date: _______________</td></tr></table>",
                        "classes": [],
                        "style": "",
                        "isPapyrusHeader": true
                    },
                    {
                        "id": "title-b",
                        "html": "<h1 style='text-align: center; margin: 20px 0;'>Mathematics Exam - Version B</h1>",
                        "classes": [],
                        "style": ""
                    },
                    {
                        "id": "problem-b1",
                        "html": "<div><strong>1.</strong> Solve for y: $2y - 5 = 13$</div>",
                        "classes": [],
                        "style": "margin: 15px 0;"
                    },
                    {
                        "id": "problem-b2",
                        "html": "<div><strong>2.</strong> Find the integral: $\\int (2x + 3) dx$</div>",
                        "classes": [],
                        "style": "margin: 15px 0;"
                    }
                ], null, 2)
            },
            {
                name: "Geometry Quiz",
                content: JSON.stringify([
                    {
                        "id": "header-geo",
                        "html": "<table style='width: 100%; border-collapse: collapse; border: 1px solid #000;'><tr><td style='border: 1px solid #000; padding: 8px;'>Name: _______________</td><td style='border: 1px solid #000; padding: 8px;'>Class: _______________</td><td style='border: 1px solid #000; padding: 8px;'>Date: _______________</td></tr></table>",
                        "classes": [],
                        "style": "",
                        "isPapyrusHeader": true
                    },
                    {
                        "id": "title-geo",
                        "html": "<h1 style='text-align: center; margin: 20px 0;'>Geometry Quiz</h1>",
                        "classes": [],
                        "style": ""
                    },
                    {
                        "id": "problem-geo1",
                        "html": "<div><strong>1.</strong> Calculate the area of a circle with radius $r = 5$ cm.</div>",
                        "classes": [],
                        "style": "margin: 15px 0;"
                    },
                    {
                        "id": "problem-geo2",
                        "html": "<div><strong>2.</strong> Find the volume of a sphere: $V = \\frac{4}{3}\\pi r^3$ where $r = 3$ cm.</div>",
                        "classes": [],
                        "style": "margin: 15px 0;"
                    }
                ], null, 2)
            }
        ];
        
        // Load first exam into existing JSON
        const firstJSON = this.jsonSets.get(1);
        if (firstJSON) {
            firstJSON.content = presetExams[0].content;
            firstJSON.name = presetExams[0].name;
            const firstTextarea = document.getElementById('json-input-1');
            if (firstTextarea) {
                firstTextarea.value = presetExams[0].content;
            }
        }
        
        // Create new JSONs for remaining exams
        for (let i = 1; i < presetExams.length; i++) {
            const newId = this.addNewJSON();
            const newSet = this.jsonSets.get(newId);
            if (newSet) {
                newSet.content = presetExams[i].content;
                newSet.name = presetExams[i].name;
                const newTextarea = document.getElementById(`json-input-${newId}`);
                if (newTextarea) {
                    newTextarea.value = presetExams[i].content;
                }
                // Update tab name
                const newTab = document.querySelector(`[data-json-id="${newId}"]`);
                if (newTab) {
                    newTab.textContent = presetExams[i].name;
                }
            }
        }
        
        this.updateJSONCounter();
        alert(`✅ Loaded ${presetExams.length} preset exams`);
    }
}

// Global instance
window.multiJSONManager = new MultiJSONManager();

// Auto-update when textarea changes
function setupAutoUpdate() {
    // Note: Individual textarea listeners are set up in createJSONTextarea
}

// Setup debug mode toggle
function setupDebugMode() {
    const debugCheckbox = document.getElementById('debug-mode');
    if (debugCheckbox) {
        window.papyrusDebugMode = debugCheckbox.checked;
        
        debugCheckbox.addEventListener('change', function() {
            window.papyrusDebugMode = debugCheckbox.checked;
            // Regenerate all previews with new debug mode
            window.generateAllPreviews();
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
            // Regenerate all previews with new page number setting
            window.generateAllPreviews();
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
    
    const newSpaceBetweenDivs = parseFloat(formData.get('space-between-divs')) ?? 3;
    
    setMargins(newMargins);
    setSpaceBetweenDivs(newSpaceBetweenDivs);
    
    // Regenerate all previews with new margins
    generateAllPreviews();
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
    
    // Regenerate all previews with new font sizes
    generateAllPreviews();
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

// Multi-JSON specific functions
async function loadExampleForCurrentJSON() {
    try {
        const response = await fetch('./sujets0-auto-example.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        const currentId = window.multiJSONManager.currentJSONId;
        
        // Get the appropriate textarea
        let currentTextarea;
        if (currentId === 1) {
            currentTextarea = document.getElementById('json-input');
        } else {
            currentTextarea = document.getElementById(`json-input-${currentId}`);
        }
        
        if (currentTextarea) {
            currentTextarea.value = JSON.stringify(jsonData, null, 2);
            
            // Save to manager
            const currentSet = window.multiJSONManager.jsonSets.get(currentId);
            if (currentSet) {
                currentSet.content = currentTextarea.value;
            }
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

function clearCurrentJSON() {
    const currentId = window.multiJSONManager.currentJSONId;
    
    // Get the appropriate textarea
    let currentTextarea;
    if (currentId === 1) {
        currentTextarea = document.getElementById('json-input');
    } else {
        currentTextarea = document.getElementById(`json-input-${currentId}`);
    }
    
    if (currentTextarea) {
        currentTextarea.value = '';
        
        // Save to manager
        const currentSet = window.multiJSONManager.jsonSets.get(currentId);
        if (currentSet) {
            currentSet.content = '';
            currentSet.pages = null;
        }
        
        // Update preview if this is the currently displayed set
        if (window.multiJSONManager.currentPreviewIndex === currentId - 1) {
            window.multiJSONManager.updatePreviewDisplay();
        }
    }
}

function removeCurrentJSON() {
    window.multiJSONManager.removeJSON(window.multiJSONManager.currentJSONId);
}

function addNewJSON() {
    window.multiJSONManager.addNewJSON();
}

function switchToJSON(id) {
    window.multiJSONManager.switchToJSON(id);
}

// Generate all previews
function generateAllPreviews() {
    const allJSONs = window.multiJSONManager.getAllJSONContents();
    
    // Clear any existing previews
    allJSONs.forEach(jsonSet => {
        const set = window.multiJSONManager.jsonSets.get(jsonSet.id);
        if (set) {
            set.pages = null;
        }
    });
    
    // Save current state of main elements
    const mainContainer = document.getElementById('pages-container');
    const mainTextarea = document.getElementById('json-input');
    const originalContainerHTML = mainContainer ? mainContainer.innerHTML : '';
    const originalTextareaValue = mainTextarea ? mainTextarea.value : '';
    
    // Create temporary elements if they don't exist
    let tempContainer = null;
    let tempTextarea = null;
    
    if (!mainContainer) {
        tempContainer = document.createElement('div');
        tempContainer.id = 'pages-container';
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.visibility = 'hidden';
        document.body.appendChild(tempContainer);
    }
    
    if (!mainTextarea) {
        tempTextarea = document.createElement('textarea');
        tempTextarea.id = 'json-input';
        tempTextarea.style.position = 'absolute';
        tempTextarea.style.top = '-9999px';
        tempTextarea.style.left = '-9999px';
        tempTextarea.style.visibility = 'hidden';
        document.body.appendChild(tempTextarea);
    }
    
    // Process each JSON set sequentially
    let currentIndex = 0;
    
    function processNextJSON() {
        if (currentIndex >= allJSONs.length) {
            // All done - restore original state and update display
            if (mainContainer) {
                mainContainer.innerHTML = originalContainerHTML;
            }
            if (mainTextarea) {
                mainTextarea.value = originalTextareaValue;
            }
            
            // Clean up temporary elements
            if (tempContainer) {
                document.body.removeChild(tempContainer);
            }
            if (tempTextarea) {
                document.body.removeChild(tempTextarea);
            }
            
            // Update display
            window.multiJSONManager.updatePreviewDisplay();
            window.multiJSONManager.updatePagination();
            return;
        }
        
        const jsonSet = allJSONs[currentIndex];
        
        if (!jsonSet.content.trim()) {
            currentIndex++;
            setTimeout(processNextJSON, 10);
            return;
        }
        
        try {
            // Validate JSON
            JSON.parse(jsonSet.content);
            
            // Set up elements for generation
            const container = document.getElementById('pages-container');
            const textarea = document.getElementById('json-input');
            
            // Clear and set content
            container.innerHTML = '';
            textarea.value = jsonSet.content;
            
            console.log(`Generating preview for ${jsonSet.name}...`);
            
            // Use the existing generation system
            generatePreviewFromJSON();
            
            // Wait for generation to complete, then save
            setTimeout(() => {
                try {
                    const containerContent = container.innerHTML.trim();
                    const set = window.multiJSONManager.jsonSets.get(jsonSet.id);
                    
                    if (set && containerContent) {
                        // Verify content has page elements
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = containerContent;
                        const pageElements = tempDiv.querySelectorAll('.page-preview');
                        
                        if (pageElements.length > 0) {
                            set.pages = containerContent;
                            console.log(`✅ Generated preview for ${jsonSet.name}: ${pageElements.length} pages`);
                        } else {
                            console.log(`⚠️  Generated content for ${jsonSet.name} has no page elements`);
                            set.pages = containerContent; // Save anyway, might still be useful
                        }
                    } else {
                        console.log(`❌ No content generated for ${jsonSet.name}`);
                        if (set) {
                            set.pages = null;
                        }
                    }
                } catch (error) {
                    console.error(`❌ Error saving preview for ${jsonSet.name}:`, error);
                    const set = window.multiJSONManager.jsonSets.get(jsonSet.id);
                    if (set) {
                        set.pages = null;
                    }
                }
                
                currentIndex++;
                setTimeout(processNextJSON, 50);
            }, 500); // Wait for generation and KaTeX rendering
            
        } catch (error) {
            console.error(`Error processing JSON for ${jsonSet.name}:`, error);
            currentIndex++;
            setTimeout(processNextJSON, 10);
        }
    }
    
    // Start processing
    processNextJSON();
}

// Backwards compatibility function for single JSON generation
function generatePages() {
    const currentTextarea = document.getElementById(`json-input-${window.multiJSONManager.currentJSONId}`);
    if (currentTextarea && currentTextarea.value.trim()) {
        // Generate just the current JSON
        generateAllPreviews();
    } else {
        // Clear display if no content
        window.multiJSONManager.updatePreviewDisplay();
    }
}



// Print all PDFs
function printAllPDFs() {
    const allJSONs = window.multiJSONManager.getAllJSONContents();
    const validJSONs = allJSONs.filter(json => json.content.trim() !== '');
    
    if (validJSONs.length === 0) {
        alert('No JSON content to print. Please add some JSON content first.');
        return;
    }
    
    // Generate all content for printing
    let allPrintContent = '';
    
    validJSONs.forEach((jsonSet, index) => {
        const set = window.multiJSONManager.jsonSets.get(jsonSet.id);
        if (set && set.pages) {
            let jsonContent = set.pages;
            
            // For subsequent JSON sets, add page-break-before to the first page element
            if (index > 0) {
                // Find the first .page-preview element and add page-break-before to it
                jsonContent = jsonContent.replace(
                    '<div class="page-preview"',
                    '<div class="page-preview" style="page-break-before: always;"'
                );
            }
            
            allPrintContent += jsonContent;
        }
    });
    
    if (!allPrintContent) {
        alert('No generated previews to print. Please generate previews first.');
        return;
    }
    
    // Use the existing print functionality but with combined content
    const margins = getCurrentMargins();
    const fontSizes = getCurrentFontSizes();
    const showPageNumbers = getShowPageNumbers();
    
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>PCA Papyrus Multi - Print All PDFs</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <!-- Fonts -->
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
                
                <!-- KaTeX for math -->
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
                
                <style>
                    /* Font families */
                    .font-heading { font-family: 'Spectral', serif; }
                    .font-body { font-family: 'Inter', sans-serif; }
                    .font-mono { font-family: 'JetBrains Mono', monospace; }

                    /* Reset and base styles */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Inter', sans-serif;
                        font-size: ${fontSizes.body}px;
                        line-height: 1.6;
                        color: #1a1a1a;
                        background: white;
                        margin: 0;
                        padding: 0;
                    }

                    /* Page styles */
                    .page-preview {
                        width: 210mm;
                        min-height: 297mm;
                        margin: 0 auto 20mm auto;
                        background: white;
                        border: none;
                        page-break-after: always;
                        position: relative;
                    }

                    .page-preview:last-child {
                        page-break-after: auto;
                    }

                    .page-content {
                        padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                    }

                    /* Typography */
                    h1 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h1}px; 
                        font-weight: 700; 
                        line-height: 1.2; 
                        margin: 0 0 1.2em 0;
                        color: #111;
                    }
                    h2 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h2}px; 
                        font-weight: 600; 
                        line-height: 1.3; 
                        margin: 0 0 1em 0;
                        color: #111;
                    }
                    h3 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h3}px; 
                        font-weight: 600; 
                        line-height: 1.3; 
                        margin: 0 0 0.9em 0;
                        color: #222;
                    }
                    h4 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h4}px; 
                        font-weight: 600; 
                        line-height: 1.4; 
                        margin: 0 0 0.8em 0;
                        color: #333;
                    }
                    h5 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h5}px; 
                        font-weight: 600; 
                        line-height: 1.4; 
                        margin: 0 0 0.7em 0;
                        color: #333;
                    }
                    h6 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h6}px; 
                        font-weight: 600; 
                        line-height: 1.4; 
                        margin: 0 0 0.6em 0;
                        color: #333;
                    }

                    /* Print specific styles */
                    @media print {
                        body {
                            background: white;
                            margin: 0;
                            padding: 0;
                        }
                        
                        .page-preview {
                            width: 100%;
                            min-height: auto;
                            margin: 0;
                            border: none;
                            box-shadow: none;
                        }
                        
                        @page {
                            margin: 0;
                            size: A4;
                        }
                    }

                    /* Hide page numbers if disabled */
                    ${!showPageNumbers ? '.page-number { display: none !important; }' : ''}
                </style>
            </head>
            <body>
                ${allPrintContent}
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Enhanced Functions for Multi-JSON Management

// Duplicate current JSON
function duplicateCurrentJSON() {
    return window.multiJSONManager.duplicateCurrentJSON();
}

// Create multiple JSONs at once
function bulkCreateJSONs() {
    return window.multiJSONManager.bulkCreateJSONs(5);
}

// Validate current JSON structure
function validateCurrentJSON() {
    return window.multiJSONManager.validateCurrentJSON();
}

// Load preset exam collection
function loadPresetExams() {
    return window.multiJSONManager.loadPresetExams();
}

// Export all PDFs as downloadable files
function exportAllPDFs() {
    const allJSONs = window.multiJSONManager.getAllJSONContents();
    const validJSONs = allJSONs.filter(json => json.content.trim() !== '');
    
    if (validJSONs.length === 0) {
        alert('No JSON content to export. Please add some JSON content first.');
        return;
    }
    
    // Show progress
    const progress = document.getElementById('generation-progress');
    if (progress) {
        progress.classList.remove('hidden');
        const progressBar = progress.querySelector('progress');
        progressBar.value = 0;
    }
    
    // Generate and download each PDF separately
    validJSONs.forEach((jsonSet, index) => {
        setTimeout(() => {
            const set = window.multiJSONManager.jsonSets.get(jsonSet.id);
            if (set && set.pages) {
                // Create a temporary download link
                const blob = new Blob([`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${set.name}</title>
                        <link rel="stylesheet" href="../src/styles/index.css" />
                        <style>
                            @media print {
                                .page-preview { page-break-after: always; }
                                .page-preview:last-child { page-break-after: avoid; }
                            }
                        </style>
                    </head>
                    <body>
                        ${set.pages}
                    </body>
                    </html>
                `], { type: 'text/html' });
                
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${set.name.replace(/\s+/g, '_')}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            // Update progress
            if (progress) {
                const progressBar = progress.querySelector('progress');
                progressBar.value = ((index + 1) / validJSONs.length) * 100;
                
                if (index === validJSONs.length - 1) {
                    setTimeout(() => {
                        progress.classList.add('hidden');
                        alert(`✅ Exported ${validJSONs.length} PDF files`);
                    }, 500);
                }
            }
        }, index * 500); // Stagger downloads
    });
}

// Update preview navigation display
function updatePreviewNavigation() {
    const allJSONs = window.multiJSONManager.getAllJSONContents();
    const previewCounter = document.getElementById('current-preview-info');
    const paginationContainer = document.getElementById('preview-pagination');
    
    if (!previewCounter || !paginationContainer) return;
    
    if (allJSONs.length === 0) {
        previewCounter.textContent = 'No PDFs generated';
        paginationContainer.innerHTML = '';
        return;
    }
    
    const currentIndex = window.multiJSONManager.currentPreviewIndex;
    const currentSet = allJSONs[currentIndex];
    
    if (currentSet) {
        const set = window.multiJSONManager.jsonSets.get(currentSet.id);
        let pageCount = 0;
        if (set && set.pages) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = set.pages;
            pageCount = tempDiv.querySelectorAll('.page-preview').length;
        }
        previewCounter.textContent = `${currentSet.name} (${pageCount} pages) - ${currentIndex + 1}/${allJSONs.length}`;
    }
    
    // Create pagination buttons
    let paginationHTML = '';
    
    if (allJSONs.length > 1) {
        // Previous button
        paginationHTML += `<button class="btn btn-xs ${currentIndex === 0 ? 'btn-disabled' : 'btn-outline'}" 
                           onclick="window.multiJSONManager.previousPreview()" 
                           ${currentIndex === 0 ? 'disabled' : ''}>‹ Prev</button>`;
        
        // Page indicators
        allJSONs.forEach((jsonSet, index) => {
            const isActive = index === currentIndex;
            paginationHTML += `<button class="btn btn-xs ${isActive ? 'btn-primary' : 'btn-outline'}" 
                               onclick="window.multiJSONManager.showPreviewSet(${index})">${index + 1}</button>`;
        });
        
        // Next button
        paginationHTML += `<button class="btn btn-xs ${currentIndex === allJSONs.length - 1 ? 'btn-disabled' : 'btn-outline'}" 
                           onclick="window.multiJSONManager.nextPreview()" 
                           ${currentIndex === allJSONs.length - 1 ? 'disabled' : ''}>Next ›</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Prevent multiple initializations
let isMultiAppInitialized = false;

// Initialize the application
export function initializeMultiApp(debugMode = false, debugMargin = 0) {
    if (isMultiAppInitialized) {
        console.log(`⚠️ Multi-app already initialized, skipping`);
        return;
    }
    
    console.log(`🚀 Starting multi-app initialization`);
    isMultiAppInitialized = true;
    
    // Store debug mode and margin globally
    window.papyrusDebugMode = debugMode;
    window.papyrusDebugMargin = debugMargin;
    
    // Make functions globally available for button onclick handlers
    window.generateAllPreviews = generateAllPreviews;
    window.printAllPDFs = printAllPDFs;
    window.exportAllPDFs = exportAllPDFs;
    window.generatePages = generatePages;
    window.printPage = printPage;
    window.loadExampleForCurrentJSON = loadExampleForCurrentJSON;
    window.clearCurrentJSON = clearCurrentJSON;
    window.removeCurrentJSON = removeCurrentJSON;
    window.addNewJSON = addNewJSON;
    window.switchToJSON = switchToJSON;
    window.duplicateCurrentJSON = duplicateCurrentJSON;
    window.bulkCreateJSONs = bulkCreateJSONs;
    window.validateCurrentJSON = validateCurrentJSON;
    window.loadPresetExams = loadPresetExams;
    window.updatePreviewNavigation = updatePreviewNavigation;
    window.rebuildTabs = () => window.multiJSONManager.rebuildTabs(); // For debugging
    window.initializeTabs = () => window.multiJSONManager.initializeTabs(); // For debugging
    window.forcefullyRemoveDuplicates = () => window.multiJSONManager.forcefullyRemoveDuplicates(); // For debugging
    window.updateMarginsFromForm = updateMarginsFromForm;
    window.updateFontSizesFromForm = updateFontSizesFromForm;
    window.getJSONFromTextarea = getJSONFromTextarea;
    
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
    
    // Initialize tabs properly
    console.log(`🚀 Initializing multi-JSON interface`);
    
    // Initialize tabs (only creates tab for first JSON)
    window.multiJSONManager.initializeTabs();
    
    // Extra cleanup after initialization
    setTimeout(() => {
        window.multiJSONManager.forcefullyRemoveDuplicates();
    }, 500);
    
    // Link the existing textarea to the first JSON
    const firstSet = window.multiJSONManager.jsonSets.get(1);
    if (firstSet) {
        const defaultTextarea = document.getElementById('json-input');
        if (defaultTextarea) {
            defaultTextarea.addEventListener('input', () => {
                clearTimeout(window.updateTimeout);
                window.updateTimeout = setTimeout(() => {
                    firstSet.content = defaultTextarea.value;
                }, 300);
            });
        }
    }
    
    // Initialize JSON counter
    window.multiJSONManager.updateJSONCounter();
    
    // Update preview navigation
    updatePreviewNavigation();
    
    // Update tab states
    window.multiJSONManager.updateTabStates();
    
    // Auto-load example JSON for first tab
    setTimeout(loadExampleForCurrentJSON, 100);
    
    // Set up periodic duplicate cleanup (every 3 seconds)
    setInterval(() => {
        if (window.multiJSONManager) {
            window.multiJSONManager.forcefullyRemoveDuplicates();
        }
    }, 3000);
    
    console.log(`✅ Multi-app initialization complete`);
}

// Set up DOM event listeners
document.addEventListener('DOMContentLoaded', initializeKaTeX);
window.addEventListener('load', initializeMultiApp); 