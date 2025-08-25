# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Try again .github/workflow after manual activation of Github Pages

### Changed
- **Documentation Overhaul**: Updated `README.md` with a new architectural diagram, consolidated core module documentation, and corrected the file structure.
- **Improved Maintainability**: Removed redundant `src/core/README.md` to centralize documentation.

## [0.0.1] - 2025-07-24

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