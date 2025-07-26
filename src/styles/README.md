# PCA Papyrus Styles

Modular CSS organization for the PDF content management system.

## Structure

```
src/styles/
├── index.css           # Main entry point (imports all modules)
├── variables.css       # CSS custom properties and design tokens
├── base.css           # Typography and basic layout
├── components.css     # UI components (buttons, editor, controls)
├── page-preview.css   # A4 page preview rendering
└── print.css          # Print-specific styles for clean PDF output
```

## Usage

Import the main CSS file in your HTML:

```html
<link rel="stylesheet" href="src/styles/index.css" />
```

## CSS Variables

All design tokens are defined in `variables.css`:

- **Page dimensions**: A4 size and margins
- **Colors**: Brand colors and UI colors  
- **Typography**: Font families and sizes

## Responsive Design

- **Screen**: Scaled A4 preview (70% zoom)
- **Print**: Full A4 size with clean output

## Print Optimization

The `print.css` module ensures:
- Hidden UI elements
- Proper page breaks
- A4 dimensions
- Clean typography 