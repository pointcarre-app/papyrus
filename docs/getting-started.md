# Getting Started

Quick start guide for PCA Papyrus - mathematical content generation and A4 preview tool with dual JSON and multi-JSON PDF capabilities.

## Quick Start

### 1. Launch the Application

```bash
# Start the development server
python3 serve.py

# Choose your interface:
# Dual JSON mode (default - NEW!)
open http://127.0.0.1:8004/scenery/

# Multi-JSON PDF generator
open http://127.0.0.1:8004/scenery/multi-index.html

# Programmatic 4-PDF batch generator (NEW!)
open http://127.0.0.1:8004/scenery/programmatic-4pdf.html

# Programmatic batch printing
open http://127.0.0.1:8004/scenery/auto-print.html
```

### 2. Dual JSON Mode (NEW - Default Interface)

1. **Work with PDF #1**: Click "Load Example" to see a sample math worksheet
2. **Switch to PDF #2**: Click the "PDF #2" tab to create your second document
3. **Add content**: Paste JSON content or load another example
4. **Switch between**: Use "PDF #1" and "PDF #2" tabs to edit either document
5. **Preview active**: The preview shows whichever JSON is currently selected
6. **Print both**: Click "Print Both" to generate combined PDF output

**Key Features:**
- Two independent JSON inputs with separate processing
- Real-time switching between PDF sources
- Combined printing with automatic page breaks
- Shared settings (margins, fonts) apply to both PDFs

### 3. Multi-JSON Mode

1. Navigate to `multi-index.html` for advanced batch processing
2. Click "+ Add JSON" to create multiple content sources
3. Load examples or paste different JSON content in each tab
4. Click "Generate All" to process all JSON sources
5. Use pagination to navigate between generated PDF sets
6. Click "Print All PDFs" to print everything together

### 4. Programmatic 4-PDF Mode (NEW)

1. Navigate to `programmatic-4pdf.html` for automated batch generation
2. Pre-loaded with 4 different mathematical topics:
   - Algebra Practice Set
   - Geometry Worksheets  
   - Calculus Problems
   - Statistics Quiz
3. Single "Generate & Print All 4 PDFs" button for complete automation
4. Real-time progress tracking and professional combined output
5. Perfect for educational institutions and content management

### 5. Programmatic Mode (Original)

1. Navigate to `auto-print.html` for automated workflows
2. Pre-loaded with 4 JSON sources ready to print
3. Single "Print All" button for immediate batch processing
4. No preview interface - optimized for production workflows

### 6. Customize Your Document

**Adjust Margins (millimeters):**
- Top: 5mm (range: 1-50mm)
- Right/Bottom/Left: 5mm (range: 0-50mm)
- Space between elements: 3mm (range: 0-20mm)

**Configure Typography (pixels):**
- H1: 32px, H2: 28px, H3: 24px, H4: 20px, H5: 18px, H6: 16px, Body: 14px

**Display Options:**
- Toggle debug mode to see element borders and dimensions
- Enable page numbers to display at the top of each page

### 7. Create Your Content

Replace the JSON content with your own mathematical content:

```json
[
  {
    "id": "title",
    "html": "<h1>My Math Worksheet</h1>",
    "style": "text-align: center;"
  },
  {
    "id": "problem-1",
    "html": "<div>1) Solve: $x^2 + 5x + 6 = 0$</div>"
  },
  {
    "id": "formula",
    "html": "<div>$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$</div>",
    "style": "text-align: center; margin: 20px 0;"
  }
]
```

### 8. Generate PDF

1. Click "Print" to open the browser's print dialog
2. Select "Save as PDF" as the destination
3. Configure print settings (margins, paper size)
4. Generate your professional PDF document

## Next Steps

- [Advanced Usage](advanced-usage.md) - Learn about headers, complex layouts, and styling
- [API Reference](api-reference.md) - Complete function and configuration reference
- [Examples](../scenery/) - Browse additional example applications
- [Troubleshooting](troubleshooting.md) - Common issues and solutions 