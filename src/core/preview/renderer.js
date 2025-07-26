/**
 * @module renderer
 * @description Renders the final paged preview.
 */

import { createSpaceDiv } from './utils.js';

/**
 * Generates the final, paginated preview and appends it to the container.
 *
 * @param {import('./types.js').PageGenerationParams} params - The parameters for page generation.
 */
export function generateFinalPages({ container, pageBreaks, elements, showPageNumbers, debugMode, spaceBetweenDivs, hasRepeatingHeader, repeatingHeaderElement }) {
    const totalPages = pageBreaks.length > 0 ? Math.max(...pageBreaks.map(pb => pb.page)) : 1;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // Create a wrapper for the page and its number to handle positioning
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'page-wrapper';

        const pageElement = document.createElement('div');
        pageElement.className = 'page-preview';

        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';
        
        if (hasRepeatingHeader && repeatingHeaderElement) {
            const headerClone = repeatingHeaderElement.cloneNode(true);
            if (!debugMode) headerClone.style.background = 'transparent';
            pageContent.appendChild(headerClone);
        }

        const pageElements = pageBreaks.filter(pb => pb.page === pageNum && !pb.isRepeatingHeader);

        pageElements.forEach(pb => {
            if (pb.needsSpaceBefore) {
                pageContent.appendChild(createSpaceDiv(spaceBetweenDivs, debugMode));
            }
            const elementClone = elements[pb.elementIndex].cloneNode(true);
            if (!debugMode) elementClone.style.background = 'transparent';
            pageContent.appendChild(elementClone);
        });

        pageElement.appendChild(pageContent);
        pageWrapper.appendChild(pageElement);

        if (showPageNumbers) {
            const pageNumberDiv = document.createElement('div');
            pageNumberDiv.className = 'page-number-bottom';
            pageNumberDiv.textContent = `${pageNum} / ${totalPages}`; /* X / Y format */
            pageWrapper.appendChild(pageNumberDiv);
        }

        container.appendChild(pageWrapper);
    }

    if (window.renderMathInElement) {
        window.renderMathInElement(container, {
            delimiters: [
                {left: '$$', right: '$$', display: true}, 
                {left: '$', right: '$', display: false}
            ]
        });
    }
}
