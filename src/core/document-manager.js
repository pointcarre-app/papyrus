/**
 * @module DocumentManager
 * @description Manages multiple document states, including their content and UI tabs.
 */

import { generatePages } from './preview/index.js';

let docIdCounter = 0;

/**
 * Represents a single document.
 */
class Document {
    constructor(name) {
        const newIdNumber = ++docIdCounter;
        this.id = `doc-${newIdNumber}`;
        this.name = name || `Document ${newIdNumber}`;
        this.jsonContent = '[]';
    }
}

/**
 * Manages a collection of documents and the UI for them.
 */
export class DocumentManager {
    constructor(containerId, textareaId) {
        docIdCounter = 0; // Failsafe to reset the counter on initialization
        this.tabsContainer = document.getElementById(containerId);
        this.textarea = document.getElementById(textareaId);
        this.documents = [];
        this.activeDocumentId = null;

        // Create and set up the first document directly.
        const firstDoc = new Document();
        this.documents.push(firstDoc);
        this.activeDocumentId = firstDoc.id;
        this.textarea.value = firstDoc.jsonContent;
        this.renderTabs();
    }

    /**
     * Adds a new document when the user clicks the button.
     */
    addDocument() {
        const newDoc = new Document();
        this.documents.push(newDoc);
        // Set the new document as active, which will also re-render everything.
        this.setActiveDocument(newDoc.id);
    }

    removeDocument(docId) {
        if (this.documents.length <= 1) {
            alert("You cannot remove the last document.");
            return;
        }
        this.documents = this.documents.filter(doc => doc.id !== docId);
        if (this.activeDocumentId === docId) {
            this.setActiveDocument(this.documents[0].id);
        } else {
            this.renderTabs(); // Just re-render tabs if the active one wasn't removed.
        }
    }

    setActiveDocument(docId) {
        this.activeDocumentId = docId;
        const activeDoc = this.getActiveDocument();
        if (activeDoc) {
            this.textarea.value = activeDoc.jsonContent;
        }
        this.renderTabs();
        generatePages();
    }

    getActiveDocument() {
        return this.documents.find(doc => doc.id === this.activeDocumentId);
    }

    updateActiveDocumentContent(newContent) {
        const activeDoc = this.getActiveDocument();
        if (activeDoc) {
            activeDoc.jsonContent = newContent;
        }
    }

    renderTabs() {
        this.tabsContainer.innerHTML = '';
        this.documents.forEach(doc => {
            const tab = document.createElement('button');
            tab.className = `btn btn-sm ${doc.id === this.activeDocumentId ? 'btn-primary' : 'btn-ghost'}`;
            tab.textContent = doc.name;
            tab.onclick = () => this.setActiveDocument(doc.id);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-xs btn-error btn-square ml-2';
            removeBtn.textContent = 'x';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeDocument(doc.id);
            };
            
            tab.appendChild(removeBtn);
            this.tabsContainer.appendChild(tab);
        });

        const addTabBtn = document.createElement('button');
        addTabBtn.className = 'btn btn-sm btn-outline';
        addTabBtn.textContent = '+ Add';
        addTabBtn.onclick = () => this.addDocument();
        this.tabsContainer.appendChild(addTabBtn);
    }
} 