/**
 * PCA Papyrus - PDF Content Management System
 * 
 * Module Structure:
 * 
 * src/
 * ├── core/
 * │   ├── app-init.js         - Application initialization and event handling (single JSON)
 * │   ├── multi-app-init.js   - Multi-JSON application initialization and event handling
 * │   ├── dual-app-init.js    - Dual-JSON application initialization (NEW)
 * │   ├── preview-generator.js - A4 page preview generation from JSON
 * │   └── print-manager.js    - Print functionality
 * │
 * ├── utils/
 * │   └── json-handler.js     - JSON parsing and element creation utilities
 * │
 * └── styles/                 - (Available for future CSS modules)
 *
 * Entry Points: 
 * - Single JSON: src/core/app-init.js
 * - Multi JSON: src/core/multi-app-init.js
 * - Dual JSON: src/core/dual-app-init.js (NEW)
 */

// SINGLE JSON MODE (Original functionality - fully backward compatible)
export { initializeApp } from './core/app-init.js';

// MULTI JSON MODE (Multiple JSON sets functionality)
export { initializeMultiApp } from './core/multi-app-init.js';

// DUAL JSON MODE (Two independent PDFs functionality - NEW)
export { initializeDualApp } from './core/dual-app-init.js';

// Core functionality exports (shared between single, multi, and dual modes)
export { generatePages, generatePreviewFromJSON } from './core/preview-generator.js';
export { printPage } from './core/print-manager.js';
export { getCurrentMargins, setMargins, initializeMargins } from './core/margin-config.js';
export { getCurrentFontSizes, setFontSizes, initializeFontSizes } from './core/font-config.js';

// Utility exports
export { getJSONFromTextarea, createElementFromJSON } from './utils/json-handler.js'; 