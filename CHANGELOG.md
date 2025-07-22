# v0.1.0 - Dual JSON PDF Generation

## 🚀 New Features

### Dual JSON PDF System
- **Independent PDF Generation**: Two separate JSON inputs create independent PDFs
- **Unified Print Output**: Combined printing with proper page breaks between PDFs
- **Smart Tab Switching**: Seamless switching between JSON #1 and JSON #2
- **Independent Processing**: Each PDF maintains its own headers, page splitting, and content flow

### Enhanced User Interface
- **JSON Source Tabs**: Visual tabs for switching between PDF #1 and PDF #2
- **Active Indicator**: Clear indication of which JSON is currently being edited
- **Combined Print Button**: Single button to print both PDFs together
- **Preserved Controls**: All existing margin, font, and layout controls work for both PDFs

### Programmatic 4-PDF Generation System ⭐ **NEW**
- **Enterprise Automation**: Complete batch generation of 4 mathematical PDF topics
- **Single-Button Operation**: Generate and print all 4 PDFs with one click
- **Pre-loaded Content**: Algebra, Geometry, Calculus, and Statistics problem sets
- **Progress Tracking**: Real-time status updates and professional UI
- **Educational Focus**: Perfect for institutions and content management platforms

### Technical Improvements
- **New Core Module**: `src/core/dual-app-init.js` for dual JSON management
- **Updated Index**: `src/index.js` exports dual JSON functionality
- **Enhanced HTML**: `scenery/index.html` updated with dual JSON interface
- **Programmatic Example**: `scenery/programmatic-4pdf.html` for automated workflows
- **Backward Compatibility**: All existing single JSON features preserved

## 🔧 Architecture

### File Structure Updates
```
src/core/
├── dual-app-init.js     # NEW: Dual JSON management system
├── app-init.js          # Existing: Single JSON (unchanged)
└── multi-app-init.js    # Existing: Multi JSON (unchanged)
```

### API Extensions
- `initializeDualApp()` - Initialize dual JSON mode
- `switchToJSON(id)` - Switch between JSON inputs
- `printBothPDFs()` - Combined PDF printing

## 🎯 Use Cases

### Educational Applications
- **Exam Creation**: Generate two different exam versions simultaneously
- **Worksheet Variants**: Create multiple versions with different problems
- **Answer Keys**: Generate problem sets with corresponding solution sheets

### Assessment Platforms
- **A/B Testing**: Compare different question formats side-by-side
- **Language Variants**: Create content in multiple languages
- **Difficulty Levels**: Generate easy and advanced versions of the same topic

### Content Management
- **Template Comparison**: Compare different layout approaches
- **Version Control**: Work on multiple document versions
- **Batch Processing**: Prepare multiple related documents together

### Programmatic Workflow Applications
- **Educational Institutions**: Automated semester material generation across all math domains
- **Content Platforms**: API integration for large-scale PDF generation workflows
- **Enterprise Systems**: High-performance batch processing with progress monitoring
- **Quality Assurance**: Standardized test material generation with consistent formatting

# v0.0.1

- Initial release
- Project structure setup
- License and documentation framework
- Development server configuration
- Core architecture planning 