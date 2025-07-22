# Migration Guide

Version migration and upgrade guide for PCA Papyrus.

## Current Version: 1.0.0

PCA Papyrus 1.0.0 is the initial stable release featuring:

- **JSON-based content system** - Structured mathematical content definition
- **Real-time A4 preview** - Accurate page rendering with live updates
- **KaTeX integration** - Professional mathematical typesetting  
- **Configurable layouts** - Margins, fonts, spacing, and page numbers
- **Multi-page support** - Automatic content flow with 4-page limit
- **Print optimization** - Professional PDF output
- **Statistics tracking** - Content analysis and page breakdown

## Configuration Changes

### From Beta to 1.0.0

**New Configuration System:**

```javascript
// Old approach (not supported)
window.papyrusConfig = { margins: {...} };

// New modular approach
import { setMargins } from './src/core/margin-config.js';
import { setFontSizes } from './src/core/font-config.js';
import { setShowPageNumbers } from './src/core/page-number-config.js';

setMargins({ top: 5, right: 5, bottom: 5, left: 5 });
setFontSizes({ h1: 32, h2: 28, body: 14 });
setShowPageNumbers(true);
```

**Content Format Evolution:**

```json
// Beta format (still supported)
[
  {
    "id": "item-1",
    "html": "<div>Content</div>"
  }
]

// 1.0.0 enhanced format (recommended)
[
  {
    "id": "item-1",
    "html": "<div>$x^2 + y^2 = z^2$</div>",
    "classes": ["theorem"],
    "style": "margin: 10px 0;",
    "isPapyrusHeader": false
  }
]
```

## API Changes

### Function Signatures

**Core Functions (Stable):**
```javascript
// These functions remain unchanged
generatePages()           // Generate preview from current JSON
loadExampleJSON()         // Load sample content
clearJSON()              // Clear textarea content
printPage()              // Open print dialog
```

**New Configuration Functions:**
```javascript
// New in 1.0.0
getCurrentMargins()       // Get current margin settings
setMargins(margins)       // Set page margins
getCurrentFontSizes()     // Get current font configuration
setFontSizes(fonts)       // Set typography
getShowPageNumbers()      // Check page number display state
setShowPageNumbers(show)  // Toggle page numbers
```

### Content Model API

**Enhanced Content Model:**
```javascript
// Access the content processing engine
const contentModel = window.contentModel;

// New methods in 1.0.0
const stats = contentModel.getStatistics();
const pageItems = contentModel.getItemsForPage(1);
contentModel.loadFromJSON(jsonData, headerElement);
contentModel.updateFromDOM();
```

## File Structure Changes

### From Beta to 1.0.0

**Reorganized Structure:**
```
Old (Beta):
src/
├── papyrus.js
├── utils.js
└── styles.css

New (1.0.0):
src/
├── core/                    # Core functionality modules
│   ├── app-init.js
│   ├── content-model.js
│   ├── preview-generator.js
│   ├── statistics-display.js
│   ├── margin-config.js
│   ├── font-config.js
│   ├── page-number-config.js
│   └── print-manager.js
├── styles/                  # Modular CSS system
│   ├── index.css
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── page-preview.css
│   └── print.css
└── utils/
    └── json-handler.js
```

**Module Imports Update:**
```javascript
// Beta approach
import './src/papyrus.js';

// 1.0.0 modular approach
import './src/core/app-init.js';  // Main entry point
```

## CSS Changes

### Variable System

**New CSS Variables (1.0.0):**
```css
/* Page dimensions */
--page-width: 210mm;
--page-height: 297mm;
--content-width: 200mm;
--content-height: 287mm;

/* Margins */
--page-margin-top: 5mm;
--page-margin-right: 5mm;
--page-margin-bottom: 5mm;
--page-margin-left: 5mm;

/* Typography */
--font-size-h1: 32px;
--font-size-h2: 28px;
--font-size-body: 14px;

/* Design tokens */
--text-muted: #6b7280;
--border-color-dark: #374151;
```

**Class Updates:**
```css
/* New in 1.0.0 */
.page-number-top          /* Page number header */
.page-preview             /* A4 page container */
.page-content             /* Content area */
.space-between-div        /* Element spacing */
.font-heading             /* Spectral serif font */
.font-body                /* Inter sans-serif font */
.font-mono                /* JetBrains Mono font */
```

## Breaking Changes

### Page Number System

**Old System (Beta):**
- Fixed debug page numbers only
- Always displayed at top-left

**New System (1.0.0):**
- Optional page number display
- Configurable positioning (top-right)
- Format: "1 / 3" with proper spacing
- Accounts for content height calculations

**Migration:**
```javascript
// Enable page numbers in 1.0.0
import { setShowPageNumbers } from './src/core/page-number-config.js';
setShowPageNumbers(true);
```

### Statistics System

**Enhanced Statistics (1.0.0):**
```javascript
// Old approach (limited info)
console.log('Items:', contentCount);

// New comprehensive statistics
const stats = contentModel.getStatistics();
console.log('Total items:', stats.totalItems);
console.log('Required pages:', stats.totalPages);
console.log('Content height:', stats.totalHeightMm);
console.log('Page breakdown:', stats.pageBreakdowns);
```

## Dependencies Updates

### KaTeX Version

**Updated to KaTeX 0.16.9:**
- Improved mathematical rendering
- Better browser compatibility
- Enhanced equation support

**Tailwind CSS 4:**
- Modern utility classes
- Improved performance
- Better responsiveness

**DaisyUI 5:**
- Updated component library
- New design tokens
- Better accessibility

## Migration Steps

### From Beta to 1.0.0

1. **Update File Structure:**
   ```bash
   # Backup your current setup
   cp -r your-project your-project-backup
   
   # Download 1.0.0 release
   # Replace src/ directory with new structure
   ```

2. **Update HTML References:**
   ```html
   <!-- Old -->
   <script type="module" src="src/papyrus.js"></script>
   
   <!-- New -->
   <script type="module" src="src/core/app-init.js"></script>
   ```

3. **Migrate Configuration:**
   ```javascript
   // Replace global config with modular imports
   import { setMargins, setFontSizes, setShowPageNumbers } from './src/core/...';
   
   // Apply your existing settings
   setMargins(yourMargins);
   setFontSizes(yourFonts);
   ```

4. **Update Custom CSS:**
   ```css
   /* Update class references */
   .old-page-number → .page-number-top
   .old-container → .page-preview
   
   /* Use new CSS variables */
   margin: var(--page-margin-top);
   font-size: var(--font-size-h1);
   ```

5. **Test Functionality:**
   ```javascript
   // Verify all features work
   generatePages();
   loadExampleJSON();
   // Test print functionality
   // Check responsive design
   ```

## Compatibility Notes

### Browser Support

**Minimum Requirements:**
- Chrome 80+ (recommended)
- Firefox 78+
- Safari 14+
- Edge 80+

**Removed Support:**
- Internet Explorer (all versions)
- Chrome < 80
- Firefox < 78

### Font Loading

**Google Fonts Integration:**
```html
<!-- Required fonts (must be loaded) -->
<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Print Compatibility

**Enhanced Print Support:**
- Better cross-browser consistency
- Improved font rendering
- Optimized page break handling
- Professional output quality

## Future Roadmap

### Version 1.1.0 (Planned)

- **Export formats:** Direct PDF generation without print dialog
- **Template library:** Pre-built worksheet templates
- **Advanced math:** Extended KaTeX feature support
- **Collaboration:** Multi-user editing capabilities

### Version 1.2.0 (Planned)

- **Image support:** Embedded diagrams and graphs
- **Custom themes:** Multiple visual styling options
- **Performance:** Web Workers for large content
- **Accessibility:** Enhanced screen reader support

## Support and Resources

### Getting Help

- **Documentation:** Complete guides in `/docs` folder
- **Examples:** Working examples in `/scenery` folder
- **Issue Tracker:** Report bugs and feature requests
- **Community:** Share templates and best practices

### Best Practices

1. **Test thoroughly** after migration
2. **Backup existing content** before upgrading
3. **Use modular imports** for better performance
4. **Follow new CSS variable system** for consistency
5. **Validate JSON content** with new enhanced format 