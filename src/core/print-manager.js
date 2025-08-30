/**
 * Print management module - Enhanced print styling
 */

import { getCurrentMargins } from './margin-config.js';
import { getCurrentFontSizes } from './font-config.js';
import { getShowPageNumbers } from './page-number-config.js';

// Print function that reliably opens the dialog every time (Chrome-safe)
export function printPage(contentToPrint, printCssUrl = null) {
    const printContent = contentToPrint || document.getElementById('pages-container')?.innerHTML || '';
    const fontSizes = getCurrentFontSizes();

    // Use provided CSS URL or fall back to relative path for backward compatibility
    const cssUrl = printCssUrl || '../src/styles/print.css';

    // Remove any previous print frames to avoid Chrome blocking subsequent prints
    document.querySelectorAll('iframe[data-print-frame="true"]').forEach((node) => {
        try {
            if (node.parentNode) node.parentNode.removeChild(node);
        } catch (_) {
            /* noop */
        }
    });

    // Create a hidden iframe
    const printFrame = document.createElement('iframe');
    printFrame.setAttribute('data-print-frame', 'true');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);

    const html = `<!DOCTYPE html>
        <html>
            <head>
                <title>PCA Papyrus - Print</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <base href="${document.baseURI}">
                <!-- Static Print Stylesheet -->
                <link rel="stylesheet" type="text/css" href="${cssUrl}">
                <!-- Dynamic Font Styles -->
                <style>
                    body { font-size: ${fontSizes.body}px; }
                    h1 { font-size: ${fontSizes.h1}px; }
                    h2 { font-size: ${fontSizes.h2}px; }
                    h3 { font-size: ${fontSizes.h3}px; }
                    h4 { font-size: ${fontSizes.h4}px; }
                    h5 { font-size: ${fontSizes.h5}px; }
                    h6 { font-size: ${fontSizes.h6}px; }
                </style>
                <!-- Fonts -->
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
                <!-- KaTeX for math -->
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
            </head>
            <body>
                ${printContent}
            </body>
        </html>`;

    const cleanup = () => {
        try {
            // Clear srcdoc to release resources
            printFrame.srcdoc = '';
        } catch (_) {}
        try {
            if (printFrame.parentNode) {
                printFrame.parentNode.removeChild(printFrame);
            }
        } catch (_) {}
    };

    // Setup onload BEFORE injecting content
    printFrame.onload = function onLoad() {
        const win = printFrame.contentWindow;
        if (!win) {
            cleanup();
            return;
        }

        // Remove empty pages (pages with no content or only the repeating header)
        try {
            const doc = win.document;
            const wrappers = Array.from(doc.querySelectorAll('.page-wrapper'));

            const isEmptyWrapper = (wrapper) => {
                const content = wrapper.querySelector('.page-content');
                if (!content) return true;

                // Ignore spacing helpers
                const children = Array.from(content.children).filter(el => !el.classList.contains('space-between-div'));

                // No children at all => empty
                if (children.length === 0) return true;

                // Only repeating header present => empty
                if (children.length === 1 && (children[0].id === 'header-section')) return true;

                return false;
            };

            const keepers = wrappers.filter(w => !isEmptyWrapper(w));

            if (keepers.length > 0 && keepers.length !== wrappers.length) {
                // Remove non-keeper pages
                wrappers.forEach(w => { if (!keepers.includes(w) && w.parentNode) w.parentNode.removeChild(w); });

                // Renumber pages if page numbers are present
                const total = keepers.length;
                keepers.forEach((w, idx) => {
                    const pn = w.querySelector('.page-number-bottom');
                    if (pn) pn.textContent = `${idx + 1} / ${total}`;
                });
            }
        } catch (_) {
            // Best-effort cleanup; ignore errors to avoid blocking print
        }

        const handleAfterPrint = () => {
            // Use microtask to ensure Chrome resets its print state
            setTimeout(() => cleanup(), 0);
        };

        // Robust afterprint handling
        win.addEventListener('afterprint', handleAfterPrint, { once: true });

        // Fallback via matchMedia for browsers where afterprint is unreliable
        let mediaQuery;
        try {
            if (win.matchMedia) {
                mediaQuery = win.matchMedia('print');
                const onChange = (m) => {
                    if (!m.matches) {
                        if (mediaQuery.removeEventListener) {
                            mediaQuery.removeEventListener('change', onChange);
                        } else if (mediaQuery.removeListener) {
                            mediaQuery.removeListener(onChange);
                        }
                        handleAfterPrint();
                    }
                };
                if (mediaQuery.addEventListener) {
                    mediaQuery.addEventListener('change', onChange);
                } else if (mediaQuery.addListener) {
                    mediaQuery.addListener(onChange);
                }
            }
        } catch (_) {
            // ignore
        }

        // Give the browser a moment to layout fonts and images before printing
        setTimeout(() => {
            try {
                win.focus();
                win.print();
            } catch (err) {
                cleanup();
            }
        }, 50);

        // Hard safety cleanup in case afterprint never fires
        setTimeout(() => cleanup(), 10000);
    };

    // Inject content last to trigger load
    printFrame.srcdoc = html;
}