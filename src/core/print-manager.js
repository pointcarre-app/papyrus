/**
 * Print management module - Enhanced print styling
 */

import { getCurrentMargins } from './margin-config.js';
import { getCurrentFontSizes } from './font-config.js';
import { getShowPageNumbers } from './page-number-config.js';

// Print function that uses a hidden iframe to avoid a popup window
export function printPage(contentToPrint) {
    const printContent = contentToPrint || document.getElementById('pages-container').innerHTML;
    const margins = getCurrentMargins();
    const fontSizes = getCurrentFontSizes();
    const showPageNumbers = getShowPageNumbers();

    // Create a hidden iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);

    const printDoc = printFrame.contentWindow.document;
    printDoc.open();
    printDoc.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>PCA Papyrus - Print</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <!-- Fonts -->
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
                
                <!-- KaTeX for math -->
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
                
                <style>
                    /* Font families */
                    .font-heading { font-family: 'Spectral', serif; }
                    .font-body { font-family: 'Inter', sans-serif; }
                    .font-mono { font-family: 'JetBrains Mono', monospace; }

                    /* Reset and base styles */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Inter', sans-serif;
                        font-size: ${fontSizes.body}px;
                        line-height: 1.6;
                        color: #1a1a1a;
                        background: white; /* Print background should be white */
                    }

                    /* Typography */
                    h1 { font-size: ${fontSizes.h1}px; font-weight: 700; margin-bottom: 1.2em; }
                    h2 { font-size: ${fontSizes.h2}px; font-weight: 600; margin-bottom: 1em; }
                    h3 { font-size: ${fontSizes.h3}px; font-weight: 600; margin-bottom: 0.9em; }
                    h4 { font-size: ${fontSizes.h4}px; font-weight: 600; margin-bottom: 0.8em; }
                    h5 { font-size: ${fontSizes.h5}px; font-weight: 600; margin-bottom: 0.7em; }
                    h6 { font-size: ${fontSizes.h6}px; font-weight: 600; margin-bottom: 0.6em; }
                    p { font-size: ${fontSizes.body}px; margin-bottom: 0.75em; }

                    /* Page setup for printing */
                    @page {
                        size: A4;
                        margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                    }

                    .page-preview {
                        width: 210mm;
                        min-height: 297mm; /* Use min-height to allow content to grow */
                        background: white;
                        position: relative;
                        page-break-after: always;
                        page-break-inside: avoid;
                    }
                    
                    .page-preview:last-child {
                        page-break-after: avoid;
                    }

                    /* Hide elements not meant for print */
                    .page-number, .space-between-div {
                        /* These are for screen preview only */
                    }

                    /* Print-specific media query */
                    @media print {
                        body {
                            background: white;
                            padding: 0;
                            margin: 0;
                        }

                        .page-preview {
                            border: none;
                            box-shadow: none;
                            margin: 0;
                        }

                        /* Ensure fonts are printed correctly */
                        h1, h2, h3, h4, h5, h6, p {
                            color: #000 !important;
                        }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
        </html>
    `);
    printDoc.close();

    // Wait for the iframe to load, then print and remove it
    printFrame.onload = function() {
        // Render KaTeX in the iframe
        if (printFrame.contentWindow.renderMathInElement) {
            printFrame.contentWindow.renderMathInElement(printDoc.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }

        // A short timeout can help ensure everything is rendered
        setTimeout(() => {
            printFrame.contentWindow.focus(); // Focus is needed for some browsers
            printFrame.contentWindow.print();
            
            // Clean up the iframe after printing
            setTimeout(() => {
                document.body.removeChild(printFrame);
            }, 500);
        }, 250);
    };
} 