# Troubleshooting

Common issues and solutions for PCA Papyrus mathematical content generation system.

## Multi-JSON Issues (NEW)

### Preview Generation Problems

**Problem**: Multi-JSON previews show "0 pages" or fail to generate
```
PDF Set: JSON #1 (0 pages)
No preview generated for this JSON
```

**Solutions**:
1. **Check JSON Validity**: Ensure all JSON sources are valid
   ```javascript
   // Validate JSON in browser console
   JSON.parse(yourJSONString);
   ```

2. **Verify Content**: Ensure JSON arrays are not empty
   ```json
   [
     {
       "id": "test",
       "html": "<div>Test content</div>",
       "classes": [],
       "style": ""
     }
   ]
   ```

3. **Check Console Logs**: Open DevTools → Console for detailed error messages
   ```
   Look for: "✅ Generated preview" vs "❌ No content generated"
   ```

4. **Wait for Processing**: Multi-JSON generation takes longer than single JSON
   - Allow 2-3 seconds after clicking "Generate All"
   - Check console for processing logs

### Tab Management Issues

**Problem**: Cannot switch between JSON tabs or tabs don't save content

**Solutions**:
1. **Manual Content Save**: Switch tabs slowly to allow auto-save
2. **Explicit Save**: Click in different areas before switching tabs
3. **Console Check**: Verify `window.multiJSONManager` exists
   ```javascript
   console.log(window.multiJSONManager.jsonSets);
   ```

### Pagination Problems

**Problem**: Pagination buttons don't work or show wrong content

**Solutions**:
1. **Regenerate**: Click "Generate All" to refresh pagination
2. **Check Preview Index**: Ensure currentPreviewIndex is valid
   ```javascript
   console.log(window.multiJSONManager.currentPreviewIndex);
   ```

### Print All Issues

**Problem**: "Print All PDFs" doesn't include all documents

**Solutions**:
1. **Generate First**: Always click "Generate All" before printing
2. **Verify Generation**: Check that all JSON sets have generated pages
   ```javascript
   // Check which JSONs have generated content
   Array.from(window.multiJSONManager.jsonSets.values())
     .forEach(set => console.log(`${set.name}: ${set.pages ? 'Generated' : 'Missing'}`));
   ```

3. **Valid Content**: Ensure all JSON sources contain valid mathematical content

### Auto-Print Interface Issues

**Problem**: Auto-print interface (`auto-print.html`) doesn't load properly

**Solutions**:
1. **Server Required**: Must use development server, not file:// protocol
   ```bash
   python3 serve.py
   open http://127.0.0.1:8004/scenery/auto-print.html
   ```

2. **Check Initialization**: Verify 4 JSON sources load properly
   - Should see "✅ All 4 JSON sources loaded and ready"

3. **Button State**: Ensure print button is enabled before clicking

## Single JSON Issues

Common issues and solutions for PCA Papyrus mathematical content generation.

## JSON Content Issues

### Invalid JSON Format

**Problem:** "Invalid JSON format" error or content not loading

**Solutions:**
```javascript
// Ensure proper JSON array format
[
  {
    "id": "item-1",
    "html": "<div>Content</div>"
  }
]

// Common mistakes to avoid:
// ❌ Missing quotes around property names
// ❌ Trailing commas
// ❌ Single quotes instead of double quotes
// ❌ Unescaped characters in strings
```

**Validation:**
```javascript
// Test your JSON in browser console
try {
  JSON.parse(yourJSONString);
  console.log("Valid JSON");
} catch (error) {
  console.error("Invalid JSON:", error.message);
}
```

### Mathematical Notation Not Rendering

**Problem:** Math expressions show as raw text instead of formatted equations

**Causes & Solutions:**

1. **Missing dollar signs:**
   ```json
   // ❌ Wrong
   {"html": "<div>x^2 + y^2 = z^2</div>"}
   
   // ✅ Correct  
   {"html": "<div>$x^2 + y^2 = z^2$</div>"}
   ```

2. **Improper escaping:**
   ```json
   // ❌ Wrong
   {"html": "<div>$\\frac{1}{2}$</div>"}
   
   // ✅ Correct
   {"html": "<div>$\\\\frac{1}{2}$</div>"}
   ```

3. **KaTeX loading issues:**
   ```javascript
   // Check if KaTeX is loaded
   if (typeof renderMathInElement === 'undefined') {
     console.error('KaTeX not loaded');
   }
   ```

## Page Layout Problems

### Content Overflow/Cropping

**Problem:** Content gets cut off or doesn't fit on pages

**Solutions:**

1. **Reduce margins:**
   ```javascript
   import { setMargins } from './src/core/margin-config.js';
   setMargins({ top: 3, right: 3, bottom: 3, left: 3 });
   ```

2. **Decrease font sizes:**
   ```javascript
   import { setFontSizes } from './src/core/font-config.js';
   setFontSizes({ h1: 28, h2: 24, h3: 20, body: 12 });
   ```

3. **Reduce spacing:**
   ```javascript
   import { setSpaceBetweenDivs } from './src/core/margin-config.js';
   setSpaceBetweenDivs(1);
   ```

4. **Split content:**
   ```javascript
   // Limit content to prevent overflow
   const maxItems = 25;
   if (jsonData.length > maxItems) {
     console.warn('Consider splitting content into multiple sheets');
   }
   ```

### Page Numbers Not Showing

**Problem:** Page numbers checkbox is checked but numbers don't appear

**Solutions:**

1. **Enable page numbers:**
   ```javascript
   // Check if setting is applied
   import { getShowPageNumbers } from './src/core/page-number-config.js';
   console.log('Page numbers enabled:', getShowPageNumbers());
   ```

2. **Regenerate pages:**
   ```javascript
   // Force regeneration after enabling
   generatePages();
   ```

3. **Check CSS conflicts:**
   ```css
   /* Ensure page number styles aren't overridden */
   .page-number-top {
     display: block !important;
     visibility: visible !important;
   }
   ```

### Incorrect Page Breaks

**Problem:** Content breaks awkwardly between pages

**Solutions:**

1. **Use debug mode to analyze:**
   ```javascript
   document.getElementById('debug-mode').checked = true;
   generatePages();
   ```

2. **Adjust content height calculations:**
   ```javascript
   // Check if repeating headers affect calculations
   const contentModel = window.contentModel;
   console.log('Page content height:', contentModel.pageContentHeightMm);
   ```

3. **Manual page break control:**
   ```json
   {
     "id": "page-break",
     "html": "<div style='page-break-before: always; height: 1px;'></div>"
   }
   ```

## Print and Export Issues

### Print Preview Looks Different

**Problem:** Print output doesn't match screen preview

**Solutions:**

1. **Check print CSS:**
   ```css
   @media print {
     /* Ensure consistent styling */
     .page-preview {
       transform: none !important;
       margin: 0 !important;
     }
   }
   ```

2. **Verify page size settings:**
   ```javascript
   // A4 dimensions should be consistent
   console.log('Page width:', getComputedStyle(document.documentElement).getPropertyValue('--page-width'));
   ```

3. **Test in different browsers:**
   - Chrome: Best print support
   - Firefox: Good compatibility
   - Safari: May have scaling issues
   - Edge: Generally reliable

### Fonts Not Displaying Correctly

**Problem:** Mathematical fonts or custom fonts don't print properly

**Solutions:**

1. **Ensure font loading:**
   ```html
   <!-- Verify Google Fonts are loaded -->
   <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```

2. **Use web-safe fallbacks:**
   ```css
   .font-heading {
     font-family: 'Spectral', 'Times New Roman', serif;
   }
   ```

3. **Check KaTeX font loading:**
   ```javascript
   // Ensure KaTeX CSS is loaded
   const katexLink = document.querySelector('link[href*="katex"]');
   if (!katexLink) {
     console.error('KaTeX CSS not loaded');
   }
   ```

## Performance Issues

### Slow Page Generation

**Problem:** generatePages() takes too long or freezes browser

**Solutions:**

1. **Limit content size:**
   ```javascript
   const MAX_ITEMS = 30;
   if (jsonData.length > MAX_ITEMS) {
     jsonData = jsonData.slice(0, MAX_ITEMS);
     console.warn(`Content limited to ${MAX_ITEMS} items`);
   }
   ```

2. **Optimize complex math:**
   ```json
   // ❌ Avoid deeply nested structures
   {"html": "$$\\begin{matrix}\\begin{matrix}...\\end{matrix}\\end{matrix}$$"}
   
   // ✅ Use simpler alternatives
   {"html": "$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$"}
   ```

3. **Debounce updates:**
   ```javascript
   let updateTimeout;
   function debouncedGenerate() {
     clearTimeout(updateTimeout);
     updateTimeout = setTimeout(generatePages, 300);
   }
   ```

### Memory Usage

**Problem:** Browser becomes slow or crashes with large content

**Solutions:**

1. **Clear previous content:**
   ```javascript
   function clearPreviousContent() {
     const container = document.getElementById('pages-container');
     container.innerHTML = '';
     window.contentModel = new ContentModel();
   }
   ```

2. **Optimize DOM structure:**
   ```javascript
   // Remove unnecessary elements
   document.querySelectorAll('.old-preview').forEach(el => el.remove());
   ```

## Browser Compatibility

### Internet Explorer/Edge Legacy

**Problem:** Application doesn't work in older browsers

**Solutions:**
- Use Chrome 80+, Firefox 78+, Safari 14+, or Edge 80+
- Enable JavaScript and CSS Grid support
- Ensure ES6 module support

### Mobile Browsers

**Problem:** Interface doesn't work well on mobile devices

**Solutions:**

1. **Use responsive controls:**
   ```css
   @media (max-width: 768px) {
     .controls-grid {
       grid-template-columns: 1fr;
     }
   }
   ```

2. **Adjust viewport:**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

## Development Issues

### Local Server Not Starting

**Problem:** `python3 serve.py` fails

**Solutions:**

1. **Check Python installation:**
   ```bash
   python3 --version  # Should be 3.6+
   ```

2. **Alternative servers:**
   ```bash
   # Node.js
   npx serve . -p 8004
   
   # Python 2
   python -m SimpleHTTPServer 8004
   
   # PHP
   php -S localhost:8004
   ```

3. **Port conflicts:**
   ```bash
   # Use different port
   python3 serve.py 8005
   ```

### Module Import Errors

**Problem:** ES6 import statements fail

**Solutions:**

1. **Ensure proper MIME types:**
   ```python
   # In serve.py, ensure .js files served as application/javascript
   ```

2. **Use full file paths:**
   ```javascript
   // ❌ Wrong
   import { func } from './module';
   
   // ✅ Correct
   import { func } from './module.js';
   ```

3. **Check CORS headers:**
   ```javascript
   // Serve from HTTP server, not file:// protocol
   ```

## Debug Techniques

### Enable Debug Mode

```javascript
// Show element boundaries and measurements
document.getElementById('debug-mode').checked = true;
window.papyrusDebugMode = true;
generatePages();
```

### Console Debugging

```javascript
// Check content model state
console.log('Content Model:', window.contentModel);
console.log('Statistics:', window.contentModel.getStatistics());

// Verify configuration
import { getCurrentMargins } from './src/core/margin-config.js';
console.log('Current margins:', getCurrentMargins());

// Monitor events
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
});
```

### CSS Debugging

```css
/* Add temporary debugging styles */
.debug * {
  outline: 1px solid red !important;
}

.debug .page-content {
  background: rgba(255, 0, 0, 0.1) !important;
}
```

## Getting Help

### Check Browser Console

1. Open Developer Tools (F12)
2. Look for JavaScript errors in Console tab
3. Check Network tab for failed resource loads
4. Use Elements tab to inspect DOM structure

### Validate Input Data

```javascript
// Test with minimal content first
const testData = [
  {
    "id": "test",
    "html": "<div>Hello World</div>"
  }
];

// Gradually add complexity
```

### Report Issues

When reporting issues, include:

1. **Browser and version**
2. **Error messages from console**
3. **Minimal reproducible example**
4. **Configuration settings used**
5. **Expected vs actual behavior**

### Community Resources

- **GitHub Issues:** Report bugs and feature requests
- **Documentation:** Check all docs for related information
- **Examples:** Review scenery/ folder for working examples 