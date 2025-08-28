# Changelog

All notable changes to this project will be documented in this file.



## [0.0.3]

### Added
- **CDN Support for Print Functionality**: Added optional `printCssUrl` parameter to `printPage()` function to enable proper CSS loading when the library is served via CDN (jsDelivr).

### Changed
- **Enhanced Print Manager**: Modified `print-manager.js` to accept an optional CSS URL parameter, maintaining full backward compatibility while enabling usage from external applications via CDN.
- **Documentation Overhaul**: Updated `README.md` with a new architectural diagram, consolidated core module documentation, and corrected the file structure.
- **Improved Maintainability**: Removed redundant `src/core/README.md` to centralize documentation.

### Fixed
- **Print CSS Loading Issue**: Resolved the issue where print styles failed to load when the library was imported from jsDelivr or other CDN services.

## [0.0.1]

### Added
- **Multi-Document Management**: The application now supports managing, previewing, and printing multiple documents within a single session.
- **Dynamic UI**: The user interface has been overhauled to support a dynamic number of document tabs, with buttons to add and remove documents on the fly.
- **"Print All" and "Print Active"**: New printing options allow users to either print all documents in a single batch job or print only the currently selected document.
- **Technical Documentation**: Added `docs/technical-summary.md` with a detailed explanation of the new architecture and a Mermaid diagram of the workflow.

### Changed
- **Core Architecture Refactor**: Replaced the static `DualJSONManager` with a flexible `DocumentManager` to handle an arbitrary number of documents.
- **Improved Printing UX**: The printing process now uses a hidden `<iframe>`, which avoids opening a disruptive `about:blank` window and provides a smoother user experience.
- **Simplified UI**: Removed the redundant "Generate" button, as previews now update automatically and reliably upon any change to the JSON content or settings.

### Removed
- **Legacy Documentation**: Removed all outdated and irrelevant documentation files from the `/docs` directory.
- **Unused Scenery Files**: Deleted numerous unused HTML and JSON files from the `/scenery` directory to minimize the project and focus on the core `main.html` entrypoint.
- **Placeholder Test Suite**: Removed the `/tests` directory, which contained only placeholder files for a future test suite.
- **Non-essential Folders**: Deleted the `/experiments` and `/hooks` directories to further streamline the repository. 