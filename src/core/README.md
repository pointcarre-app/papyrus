# PCA Papyrus Core Modules

Core functionality for the PDF content management system.

## Modules

### `app-init.js`
Application initialization and event handling:
- Sets up auto-update for JSON textarea
- Initializes margin system
- Handles form event listeners
- Makes functions globally available

### `preview-generator.js`
A4 page preview generation:
- Renders JSON content into page preview
- Handles KaTeX math rendering
- Uses dynamic margins from margin-config

### `print-manager.js`
Clean PDF print output:
- Opens print window with proper A4 formatting
- Uses dynamic margins for accurate print layout
- Includes KaTeX CSS for math rendering

### `margin-config.js` ⭐ NEW
Dynamic margin management:
- **Default margins**: 20mm on all sides
- **Real-time updates**: Form changes instantly update preview
- **CSS variable sync**: Automatically updates CSS custom properties
- **Print integration**: Print uses current margin settings

### `font-config.js` ⭐ NEW
Dynamic font size management:
- **Default font sizes**: H1(32px) to H6(16px) + Body(14px)
- **Real-time updates**: Form changes instantly update preview
- **CSS variable sync**: Automatically updates typography CSS
- **Print integration**: Print uses current font sizes

## Margin System Features

### Default Values
```javascript
const DEFAULT_MARGINS = {
    top: 20,
    right: 20, 
    bottom: 20,
    left: 20
};
```

### Real-time Form Updates
- Form inputs trigger updates with 200ms debouncing
- CSS variables automatically recalculated
- Content dimensions adjust dynamically
- Preview regenerates instantly

### API
```javascript
import { getCurrentMargins, setMargins } from './margin-config.js';

// Get current margins
const margins = getCurrentMargins();

// Set new margins
setMargins({ top: 25, right: 15, bottom: 25, left: 15 });
```

## Font System Features

### Default Values
```javascript
const DEFAULT_FONT_SIZES = {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body: 14
};
```

### Real-time Form Updates
- Font inputs trigger updates with 200ms debouncing
- CSS variables automatically recalculated
- Typography updates instantly across preview
- Print output matches preview exactly

### API
```javascript
import { getCurrentFontSizes, setFontSizes } from './font-config.js';

// Get current font sizes
const fontSizes = getCurrentFontSizes();

// Set new font sizes
setFontSizes({ h1: 36, h2: 30, body: 16 });
```

## Integration

Both margin and font systems are fully integrated:

### Margin System
1. **Form**: HTML inputs in margin-form
2. **Config**: margin-config.js manages state
3. **Preview**: Uses CSS variables for layout
4. **Print**: Dynamic padding in print styles

### Font System
1. **Form**: HTML inputs in font-form
2. **Config**: font-config.js manages state
3. **Preview**: Uses CSS variables for typography
4. **Print**: Dynamic font sizes in print styles

Both systems work together seamlessly to provide complete control over PDF layout and typography. 