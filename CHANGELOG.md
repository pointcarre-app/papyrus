# Changelog

All notable changes to this project will be documented in this file.



## v0.0.12

- `src/core/print-manager.js` : smaller css injection 
- `page-preview.css` for A4 updated

## v0.0.11


- In src/core/print-manager.js, right after the print iframe loads the content, I added a small pass that:
  - Finds all .page-wrapper pages.
  - Treats a page as “empty” if .page-content has no children other than spacing helpers, or has only the repeating header element (#header-section).
  - Removes those empty pages from the print document.
  - Renumbers .page-number-bottom elements if any pages were removed so numbering stays correct.



## v0.0.10

### Changed
- `src/core/app-init.js`
  - Changed default space between divs to 0.


## v0.0.9

### Fixed
- Chrome: print dialog opening only once. Printing now works reliably on every click by rebuilding a hidden iframe each time, using `srcdoc`, registering `onload` before injecting content, and performing robust cleanup via `afterprint` and a `matchMedia('print')` fallback.
- Safari: eliminated a trailing blank page by changing print break rules to insert page breaks only between pages and switching printed page numbers to `position: absolute` during print.

### Changed
- `src/core/print-manager.js`
  - Reworked print routine to create a hidden iframe per invocation with `data-print-frame="true"` and set `srcdoc` for atomic content injection.
  - Registered `onload` before assigning `srcdoc` to avoid missed events.
  - Added cleanup guards: remove any pre-existing print iframes before creating a new one and clear/remove the iframe after printing.
  - Added `afterprint` handler and `matchMedia('print')` fallback to ensure consistent teardown across browsers (notably Chrome-based and Safari).
  - Inserted a `<base href="...">` tag inside the print document so relative asset URLs resolve correctly within the iframe.
  - Kept dynamic font sizing (H1–H6 and body) and included Google Fonts + KaTeX CSS in the print document for visual parity.
  - Preserved the API: `printPage(contentToPrint, printCssUrl)` remains backward-compatible; `printCssUrl` is optional.

- `src/styles/print.css`
  - Applied page-break rules to only add breaks between pages:
    - `.page-wrapper { page-break-inside: avoid; break-inside: avoid; }`
    - `.page-wrapper + .page-wrapper { page-break-before: always; break-before: page; }`
  - Changed `.page-number-bottom` to `position: absolute` under `@media print` to prevent Safari from pushing content onto an extra blank page.

- `scenery/main.html`
  - Removed an empty `class=""` from a container to satisfy the linter (H026) and keep markup clean.

### Notes
- For CDN usage, you can still pass a stylesheet URL via `printPage(_, printCssUrl)`; otherwise the default relative path `../src/styles/print.css` is used.
- Ensure printed pages are rendered with the `.page-wrapper` structure; the updated print rules rely on it for correct pagination.



## v0.0.8

Commented all of this in `print.css` to avoid collision in maths.pm
```css
body {
    margin: 0;
    padding: 0;
    background: white;
    font-family: 'Lexend', sans-serif; /* Default body font */
    line-height: 1.5;
    color: #1a1a1a;
}
```


## v0.0.7

- Updated `index.css` to remove the `components.css` import and also clean other css to avoid collision in maths.pm

## [0.0.6]

### Changed
- Lexend is now the default body font.


## [0.0.5]

### Changed
- **Default Body Font Size**: Changed the default body font size from 14px to 16px to match the default font size in the browser.

```js
// Default font sizes in px
export const DEFAULT_FONT_SIZES = {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body: 16
};
```



## [0.0.4]

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