/**
 * Print management module - Enhanced print styling
 */

import { getCurrentMargins } from './margin-config.js';
import { getCurrentFontSizes } from './font-config.js';
import { getShowPageNumbers } from './page-number-config.js';

// Enhanced print function with better page styling
export function printPage() {
    const printContent = document.getElementById('pages-container').innerHTML;
    const margins = getCurrentMargins();
    const fontSizes = getCurrentFontSizes();
    const showPageNumbers = getShowPageNumbers();
    
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
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
                        background: #f5f5f5;
                        margin: 0;
                        padding: 20px;
                    }

                    /* Typography - enhanced for readability */
                    h1 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h1}px; 
                        font-weight: 700; 
                        line-height: 1.2; 
                        margin: 0 0 1.2em 0;
                        color: #111;
                    }
                    h2 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h2}px; 
                        font-weight: 600; 
                        line-height: 1.3; 
                        margin: 0 0 1em 0;
                        color: #111;
                    }
                    h3 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h3}px; 
                        font-weight: 600; 
                        line-height: 1.3; 
                        margin: 0 0 0.9em 0;
                        color: #222;
                    }
                    h4 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h4}px; 
                        font-weight: 600; 
                        line-height: 1.4; 
                        margin: 0 0 0.8em 0;
                        color: #333;
                    }
                    h5 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h5}px; 
                        font-weight: 600; 
                        line-height: 1.4; 
                        margin: 0 0 0.7em 0;
                        color: #333;
                    }
                    h6 { 
                        font-family: 'Spectral', serif;
                        font-size: ${fontSizes.h6}px; 
                        font-weight: 600; 
                        line-height: 1.4; 
                        margin: 0 0 0.6em 0;
                        color: #333;
                    }
                    
                    p { 
                        font-size: ${fontSizes.body}px; 
                        line-height: 1.6; 
                        margin: 0 0 0.75em 0;
                        color: #2a2a2a;
                    }

                    /* Enhanced page styling */
                    .page-preview {
                        width: 210mm;
                        height: 297mm;
                        margin: 0 auto 30px auto;
                        padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                        background: white;
                        border: 2px solid #ddd;
                        border-radius: 4px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        page-break-after: always;
                        page-break-inside: avoid;
                        position: relative;
                        overflow: hidden;
                    }

                    /* Page numbers - show if enabled */
                    .page-number-top {
                        ${showPageNumbers ? `
                            display: block !important;
                            text-align: right;
                            font-size: 10px;
                            color: #666;
                            font-weight: 400;
                            font-family: 'Inter', sans-serif;
                            padding: 0 0 8px 0;
                            margin: 0 0 12px 0;
                            border-bottom: 1px solid #e0e0e0;
                        ` : 'display: none;'}
                    }

                    /* Debug/preview page numbers - hide in print */
                    .page-number {
                        display: none;
                    }

                    /* Page content container */
                    .page-content {
                        height: calc(100% - ${showPageNumbers ? '25px' : '0px'});
                        overflow: hidden;
                        position: relative;
                    }

                    /* Math content styling */
                    .katex {
                        font-size: 1em;
                    }

                    /* Lists and spacing */
                    ul, ol {
                        margin: 0 0 0.75em 1.5em;
                        padding: 0;
                    }

                    li {
                        margin: 0 0 0.25em 0;
                    }

                    /* Tables */
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 0 0 1em 0;
                    }

                    th, td {
                        padding: 8px 12px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }

                    th {
                        background: #f8f9fa;
                        font-weight: 600;
                    }

                    /* Print-specific media query */
                    @media print {
                        body {
                            background: white;
                            padding: 0;
                            margin: 0;
                        }

                        .page-preview {
                            width: 210mm;
                            height: 297mm;
                            margin: 0;
                            padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                            border: none;
                            border-radius: 0;
                            box-shadow: none;
                            page-break-after: always;
                            page-break-inside: avoid;
                            background: white;
                        }

                        .page-number-top {
                            ${showPageNumbers ? `
                                display: block !important;
                                text-align: right;
                                font-size: 9pt;
                                color: #666;
                                font-weight: normal;
                                font-family: 'Inter', sans-serif;
                                padding: 0 0 6pt 0;
                                margin: 0 0 8pt 0;
                                border-bottom: 0.5pt solid #ccc;
                            ` : 'display: none;'}
                        }

                        .page-content {
                            height: 100%;
                            overflow: hidden;
                        }

                        /* Last page shouldn't force a page break */
                        .page-preview:last-child {
                            page-break-after: auto;
                        }
                    }

                    /* Print preview enhancements */
                    @media screen {
                        /* Add page labels for screen preview */
                        .page-preview::before {
                            content: "Page " counter(page-counter);
                            counter-increment: page-counter;
                            position: absolute;
                            top: -25px;
                            left: 0;
                            font-size: 12px;
                            color: #666;
                            font-weight: 500;
                            font-family: 'Inter', sans-serif;
                        }

                        body {
                            counter-reset: page-counter;
                        }
                    }
                </style>
            </head>
            <body>
                ${printContent}
                
                <script>
                    // Auto-print after a short delay to ensure fonts load
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
            </body>
        </html>
    `);
    
    printWindow.document.close();
} 