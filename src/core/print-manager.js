/**
 * Print management module - Enhanced print styling
 */

import { getCurrentMargins } from './margin-config.js';
import { getCurrentFontSizes } from './font-config.js';
import { getShowPageNumbers } from './page-number-config.js';

// Print function that uses a hidden iframe to avoid a popup window
export function printPage(contentToPrint, printCssUrl = null) {
    const printContent = contentToPrint || document.getElementById('pages-container').innerHTML;
    const fontSizes = getCurrentFontSizes();
    
    // Use provided CSS URL or fall back to relative path for backward compatibility
    const cssUrl = printCssUrl || '../src/styles/print.css';

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