# API Reference

Complete API documentation for PCA Papyrus mathematical content generation system.

## Dual JSON API ⭐ **NEW**

### Dual JSON Manager

```javascript
// Access the global dual JSON manager
const manager = window.dualJSONManager;

// Switch between JSON inputs (1 or 2)
manager.switchToJSON(jsonId);

// Save current content to active JSON
manager.saveCurrentContent();

// Load active JSON content into textarea
manager.loadActiveContent();

// Generate preview for active JSON only
manager.generateActivePreview();

// Generate previews for both JSONs
manager.generateAllPreviews();

// Display preview for currently active JSON
manager.displayActivePreview();

// Print both PDFs with proper page separation
manager.printBothPDFs();

// Clear content for active JSON
manager.clearActiveJSON();

// Load example for active JSON
manager.loadExampleForActive();
```

### Dual JSON Functions

```javascript
// Switch to specific JSON (1 or 2)
window.switchToJSON(id);

// Generate preview for currently active JSON
window.generatePages();

// Print both PDFs combined
window.printBothPDFs();

// Load example content for active JSON
window.loadExampleJSON();

// Clear active JSON content
window.clearJSON();
```

### Dual JSON Properties

```javascript
// Access JSON data structure
const jsonSets = window.dualJSONManager.jsonSets;
// Structure: { 1: { id, name, content, pages }, 2: { id, name, content, pages } }

// Get currently active JSON ID (1 or 2)
const activeId = window.dualJSONManager.activeJsonId;

// Check if specific JSON has content
const hasContent = jsonSets[1].content.trim().length > 0;

// Access generated pages for specific JSON
const pdf1Pages = jsonSets[1].pages;
const pdf2Pages = jsonSets[2].pages;
```

### Initialization

```javascript
// Initialize dual JSON application
import { initializeDualApp } from './src/core/dual-app-init.js';

// Basic initialization
initializeDualApp();

// With debug mode
initializeDualApp(true, 5); // debugMode=true, debugMargin=5mm
```

## Programmatic 4-PDF API ⭐ **NEW**

### Automated Batch Generation

The programmatic 4-PDF generator provides a complete automation solution for batch PDF generation.

```javascript
// Main generation function (global)
window.generateAndPrintAll();

// Pre-configured JSON sources
const pdfSources = {
  1: { name: "Algebra Practice", content: [...] },
  2: { name: "Geometry Worksheets", content: [...] },
  3: { name: "Calculus Problems", content: [...] },
  4: { name: "Statistics Quiz", content: [...] }
};

// Individual PDF generation
async function generateSinglePDF(pdfId) {
  // Returns generated HTML content
}

// Progress tracking
function updateProgress(current, total, status) {
  // Updates UI progress indicators
}

// Combined printing
function printAllPDFs() {
  // Prints all generated PDFs with page breaks
}
```

### Configuration API

```javascript
// Batch configuration
function configureAllPDFs() {
  setMargins({
    top: 15, right: 10, bottom: 15, left: 10
  });
  
  setFontSizes({
    h1: 28, h2: 24, body: 12
  });
  
  setShowPageNumbers(true);
  setSpaceBetweenDivs(3);
}
```

### Integration Examples

```javascript
// Educational platform integration
class MathContentGenerator {
  async generateAllTopics() {
    // Configure for standardized output
    this.setupStandardConfiguration();
    
    // Generate all 4 mathematical domains
    await window.generateAndPrintAll();
    
    return {
      status: 'success',
      pdfsGenerated: 4,
      topics: ['algebra', 'geometry', 'calculus', 'statistics']
    };
  }
  
  setupStandardConfiguration() {
    // Educational institution standards
    setMargins({ top: 20, right: 15, bottom: 20, left: 15 });
    setFontSizes({ h1: 24, h2: 20, body: 11 });
  }
}

// Automated workflow integration
async function scheduleWeeklyPDFGeneration() {
  const generator = new MathContentGenerator();
  const result = await generator.generateAllTopics();
  
  // Log for audit trail
  console.log(`Generated ${result.pdfsGenerated} PDFs for topics: ${result.topics.join(', ')}`);
}
```

### Performance Monitoring

```javascript
// Track generation performance
class PerformanceMonitor {
  startTimer() {
    this.startTime = performance.now();
  }
  
  endTimer() {
    const duration = performance.now() - this.startTime;
    console.log(`PDF generation completed in ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// Usage in programmatic generation
const monitor = new PerformanceMonitor();
monitor.startTimer();
await generateAndPrintAll();
monitor.endTimer();
```

## Multi-JSON API

### Multi-JSON Manager

```javascript
// Access the global multi-JSON manager
const manager = window.multiJSONManager;

// Add new JSON source
const newId = manager.addNewJSON();

// Switch to specific JSON
manager.switchToJSON(jsonId);

// Remove JSON source
manager.removeJSON(jsonId);

// Get all JSON contents
const allJSONs = manager.getAllJSONContents();

// Update preview display
manager.updatePreviewDisplay();

// Navigate between previews
manager.showPreviewSet(index);
manager.nextPreview();
manager.previousPreview();
```

### Multi-JSON Functions

```javascript
// Generate all PDF previews
window.generateAllPreviews();

// Print all generated PDFs
window.printAllPDFs();

// Load example for current JSON tab
window.loadExampleForCurrentJSON();

// Clear current JSON tab
window.clearCurrentJSON();

// Remove current JSON tab
window.removeCurrentJSON();

// Add new JSON tab
window.addNewJSON();

// Switch to specific JSON tab
window.switchToJSON(id);
```

### Programmatic Batch Processing

```javascript
// Initialize with 4 JSON sources
function initializeBatchPrinting() {
    // Pre-load 4 different JSON sources
    // Configure shared settings
    // Set up automatic printing
}

// Execute batch print operation
function executeBatchPrint() {
    // Generate all previews
    // Combine all PDFs
    // Trigger print dialog
}
```

## Single JSON API

Complete API documentation for PCA Papyrus functions and configuration options.

## Core Functions

### Global Functions

These functions are available globally when the application is loaded:

```javascript
// Generate pages from current JSON content
generatePages()

// Load example mathematical content
loadExampleJSON()

// Clear all content from the textarea
clearJSON()

// Open browser print dialog for PDF generation
printPage()

// Update margins from form input values
updateMarginsFromForm()

// Update font sizes from form input values  
updateFontSizesFromForm()
```

### Content Model API

Access the content processing engine:

```javascript
// Get the global content model instance
const contentModel = window.contentModel;

// Get comprehensive statistics
const stats = contentModel.getStatistics();
console.log(stats);
// Returns: {
//   totalItems: 5,
//   totalPages: 2,
//   totalHeightMm: 245.3,
//   margins: { top: 5, right: 5, bottom: 5, left: 5 },
//   pageBreakdowns: [...]
// }

// Get items for a specific page
const pageItems = contentModel.getItemsForPage(1);
console.log(pageItems);
// Returns array of items with positioning info

// Update content from new JSON data
contentModel.loadFromJSON(jsonArray, headerElement);

// Recalculate from current DOM state
contentModel.updateFromDOM();
```

## Configuration APIs

### Margin Configuration

Control page margins and spacing:

```javascript
import { 
  getCurrentMargins, 
  setMargins, 
  getCurrentSpaceBetweenDivs, 
  setSpaceBetweenDivs,
  DEFAULT_MARGINS,
  DEFAULT_SPACE_BETWEEN_DIVS
} from './src/core/margin-config.js';

// Get current margin settings
const margins = getCurrentMargins();
// Returns: { top: 5, right: 5, bottom: 5, left: 5 }

// Set new margins (in millimeters)
setMargins({
  top: 10,     // 1-50mm
  right: 8,    // 0-50mm
  bottom: 10,  // 0-50mm
  left: 8      // 0-50mm
});

// Get/set space between elements
const spacing = getCurrentSpaceBetweenDivs(); // Returns: 3
setSpaceBetweenDivs(5); // 0-20mm

// Access defaults
console.log(DEFAULT_MARGINS);           // { top: 5, right: 5, bottom: 5, left: 5 }
console.log(DEFAULT_SPACE_BETWEEN_DIVS); // 3
```

### Font Configuration

Control typography settings:

```javascript
import { 
  getCurrentFontSizes, 
  setFontSizes,
  DEFAULT_FONT_SIZES
} from './src/core/font-config.js';

// Get current font sizes
const fonts = getCurrentFontSizes();
// Returns: { h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16, body: 14 }

// Set new font sizes (in pixels)
setFontSizes({
  h1: 36,    // 8-72px
  h2: 30,    // 8-64px
  h3: 26,    // 8-56px
  h4: 22,    // 8-48px
  h5: 20,    // 8-40px
  h6: 18,    // 8-32px
  body: 16   // 8-24px
});

// Access defaults
console.log(DEFAULT_FONT_SIZES);
```

### Page Number Configuration

Control page number display:

```javascript
import { 
  getShowPageNumbers, 
  setShowPageNumbers,
  getCurrentPageNumberConfig,
  setPageNumberConfig
} from './src/core/page-number-config.js';

// Check if page numbers are enabled
const showNumbers = getShowPageNumbers(); // Returns: boolean

// Enable/disable page numbers
setShowPageNumbers(true);  // Shows "1 / 3" format at top of pages
setShowPageNumbers(false); // Hides page numbers

// Get full configuration
const config = getCurrentPageNumberConfig();
// Returns: { showPageNumbers: false }

// Set full configuration
setPageNumberConfig({ showPageNumbers: true });
```

## JSON Content Format

### Element Structure

Each content element follows this structure:

```javascript
{
  "id": "unique-identifier",           // Required: unique string
  "html": "<div>Content with $math$</div>", // Required: HTML content
  "classes": ["class1", "class2"],     // Optional: CSS classes array
  "style": "color: red; font-size: 18px;", // Optional: inline CSS
  "isPapyrusHeader": false             // Optional: repeat on every page
}
```

### Content Types

**Basic Text:**
```json
{
  "id": "paragraph-1",
  "html": "<p>This is a simple paragraph with some text.</p>"
}
```

**Mathematical Content:**
```json
{
  "id": "equation-1", 
  "html": "<div>Solve for $x$: $ax^2 + bx + c = 0$</div>"
}
```

**Display Equations:**
```json
{
  "id": "formula-1",
  "html": "<div>$$\\int_a^b f(x) dx = F(b) - F(a)$$</div>",
  "style": "text-align: center; margin: 20px 0;"
}
```

**Tables:**
```json
{
  "id": "header-table",
  "html": "<table style='width: 100%; border-collapse: collapse;'><tr><td style='border: 1px solid #000; padding: 5px;'>Name:</td><td style='border: 1px solid #000; padding: 5px;'>Date:</td></tr></table>",
  "isPapyrusHeader": true
}
```

**Styled Content:**
```json
{
  "id": "title-section",
  "html": "<h1>Chapter 5: Derivatives</h1>",
  "classes": ["text-center", "font-bold"],
  "style": "color: #2c3e50; margin-bottom: 30px;"
}
```

## Page Dimensions and Layout

### A4 Page Constants

```javascript
import { PAGE_DIMENSIONS, PAGE_NUMBER_TOP } from './src/core/content-model.js';

console.log(PAGE_DIMENSIONS);
// Returns: {
//   width: 210,      // A4 width in mm
//   height: 297,     // A4 height in mm  
//   widthPx: 794,    // ~210mm in pixels
//   heightPx: 1123   // ~297mm in pixels
// }

console.log(PAGE_NUMBER_TOP);
// Returns: {
//   heightPx: 25,    // Page number header height in pixels
//   heightMm: 6.6    // Page number header height in mm
// }
```

### Layout Calculations

```javascript
// Get available content height (excluding margins and headers)
const contentModel = window.contentModel;
contentModel.calculatePageDimensions();

console.log(contentModel.pageContentHeightPx);  // Available height in pixels
console.log(contentModel.pageContentHeightMm);  // Available height in mm
```

## Statistics and Analytics

### Content Statistics

```javascript
const stats = contentModel.getStatistics();

// Basic metrics
console.log(stats.totalItems);        // Number of content elements
console.log(stats.totalPages);        // Required pages (max 4 shown)
console.log(stats.totalHeightMm);     // Total content height in mm

// Margin information
console.log(stats.margins);           // Current margin settings

// Page breakdown
stats.pageBreakdowns.forEach((page, index) => {
  console.log(`Page ${index + 1}:`, page.items.length, 'items');
});
```

### Real-time Updates

```javascript
// Statistics automatically update when:
// - JSON content changes
// - Margins are adjusted  
// - Font sizes are modified
// - Page numbers are toggled

// Manual update trigger
contentModel.updateFromDOM();
const newStats = contentModel.getStatistics();
```

## Event Handling

### Form Event Listeners

```javascript
// Margin form changes
document.getElementById('margin-form').addEventListener('input', () => {
  clearTimeout(window.marginUpdateTimeout);
  window.marginUpdateTimeout = setTimeout(updateMarginsFromForm, 200);
});

// Font form changes  
document.getElementById('font-form').addEventListener('input', () => {
  clearTimeout(window.fontUpdateTimeout);
  window.fontUpdateTimeout = setTimeout(updateFontSizesFromForm, 200);
});

// JSON textarea changes
document.getElementById('json-input').addEventListener('input', () => {
  clearTimeout(window.updateTimeout);
  window.updateTimeout = setTimeout(generatePages, 300);
});
```

### Custom Event Handling

```javascript
// Listen for configuration changes
document.addEventListener('marginsChanged', (event) => {
  console.log('New margins:', event.detail.margins);
  generatePages(); // Regenerate preview
});

// Listen for content updates
document.addEventListener('contentUpdated', (event) => {
  console.log('Content changed:', event.detail.stats);
});
```

## Utility Functions

### JSON Processing

```javascript
import { 
  getJSONFromTextarea, 
  createElementFromJSON,
  updateDebugHeightIndicators
} from './src/utils/json-handler.js';

// Extract and parse JSON from textarea
const jsonData = getJSONFromTextarea();
// Returns: Array of content objects or null if invalid

// Create DOM element from JSON object
const element = createElementFromJSON(jsonObject, debugMode);
// Returns: HTMLElement with applied styles and classes

// Update debug height indicators (when debug mode is active)
updateDebugHeightIndicators();
```

### CSS Variable Updates

```javascript
// Margins automatically update CSS variables:
// --page-margin-top, --page-margin-right, --page-margin-bottom, --page-margin-left
// --content-width, --content-height, --content-width-px, --content-height-px

// Fonts automatically update CSS variables:
// --font-size-h1, --font-size-h2, --font-size-h3, --font-size-h4
// --font-size-h5, --font-size-h6, --font-size-body

// Access current values
const root = document.documentElement;
const topMargin = root.style.getPropertyValue('--page-margin-top');
const h1Size = root.style.getPropertyValue('--font-size-h1');
```

## Error Handling

### JSON Validation

```javascript
try {
  const jsonData = getJSONFromTextarea();
  if (!jsonData) {
    console.warn('Invalid JSON format');
    return;
  }
  
  if (!Array.isArray(jsonData)) {
    console.error('JSON must be an array of content objects');
    return;
  }
  
  // Process valid JSON
  generatePages();
} catch (error) {
  console.error('JSON parsing error:', error.message);
}
```

### Content Validation

```javascript
// Validate individual content elements
function validateContentElement(element) {
  if (!element.id) {
    console.warn('Element missing required "id" field:', element);
    return false;
  }
  
  if (!element.html) {
    console.warn('Element missing required "html" field:', element);
    return false;
  }
  
  return true;
}

// Validate entire content array
function validateContent(jsonData) {
  return jsonData.every(validateContentElement);
}
```

## Performance Considerations

### Optimization Tips

```javascript
// Debounce updates for better performance
const debouncedGenerate = debounce(generatePages, 300);

// Use RAF for smooth updates
function smoothUpdate() {
  requestAnimationFrame(() => {
    generatePages();
    updateDebugHeightIndicators();
  });
}

// Limit content size
const MAX_ITEMS = 50;
const MAX_PAGES = 4;

if (jsonData.length > MAX_ITEMS) {
  console.warn(`Content limited to ${MAX_ITEMS} items for performance`);
  jsonData = jsonData.slice(0, MAX_ITEMS);
}
```

### Memory Management

```javascript
// Clean up when switching content
function clearPreviousContent() {
  const container = document.getElementById('pages-container');
  container.innerHTML = ''; // Removes all page elements
  
  // Clear content model
  window.contentModel = new ContentModel();
}
```

## Constants and Defaults

### Default Values

```javascript
// Margin defaults (mm)
const DEFAULT_MARGINS = { top: 5, right: 5, bottom: 5, left: 5 };
const DEFAULT_SPACE_BETWEEN_DIVS = 3;

// Font defaults (px)  
const DEFAULT_FONT_SIZES = {
  h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16, body: 14
};

// Page number defaults
const DEFAULT_PAGE_NUMBER_CONFIG = { showPageNumbers: false };

// Page limits
const MAX_PAGES_DISPLAY = 4;
const MM_TO_PX_RATIO = 3.78;
```

### CSS Classes

```javascript
// Available CSS classes
const CSS_CLASSES = {
  pagePreview: 'page-preview',
  pageContent: 'page-content',
  pageNumberTop: 'page-number-top',
  spaceBetweenDiv: 'space-between-div',
  fontMono: 'font-mono',
  fontHeading: 'font-heading',
  fontBody: 'font-body'
};
``` 