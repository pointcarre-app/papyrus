/**
 * @module calculator
 * @description Page layout calculation logic for the preview generator.
 */

/**
 * Calculates the page breaks for the given content elements.
 * This is the core of the pagination logic.
 *
 * @param {import('./types.js').PageBreakCalculationParams} params - The parameters for calculation.
 * @returns {import('../../core/statistics/types.js').PageBreak[]} An array of page break objects.
 */
export function calculatePageBreaks({ elements, elementHeights, usablePageHeight, spaceBetweenDivs, repeatingHeaderHeight, hasRepeatingHeader }) {
    const pageBreaks = [];
    let currentPage = 1;
    let currentContentHeight = 0; // Tracks content height within the usable area

    // Initialize first page with header overhead if it exists
    if (hasRepeatingHeader) {
        currentContentHeight = repeatingHeaderHeight;
    }

    elements.forEach((element, index) => {
        const elementHeightMm = elementHeights[index];
        const isRepeatingHeader = hasRepeatingHeader && index === 0;

        if (isRepeatingHeader) {
            pageBreaks.push({ elementIndex: index, page: currentPage, isRepeatingHeader: true });
            return; // Skip to next element
        }

        const elementsOnCurrentPage = pageBreaks.filter(pb => pb.page === currentPage && !pb.isRepeatingHeader);
        let spaceNeededBefore = (elementsOnCurrentPage.length > 0 || hasRepeatingHeader) && spaceBetweenDivs > 0 ? spaceBetweenDivs : 0;
        
        let totalNeededHeight = elementHeightMm + spaceNeededBefore;

        if (currentContentHeight + totalNeededHeight > usablePageHeight) {
            currentPage++;
            currentContentHeight = hasRepeatingHeader ? repeatingHeaderHeight : 0;
            
            // Recalculate space needed for the new page
            spaceNeededBefore = hasRepeatingHeader && spaceBetweenDivs > 0 ? spaceBetweenDivs : 0;
            totalNeededHeight = elementHeightMm + spaceNeededBefore;

            if (currentContentHeight + totalNeededHeight > usablePageHeight) {
                console.error(`CRITICAL: Element ${index + 1} (${totalNeededHeight.toFixed(1)}mm) is too tall to fit on a page.`);
            }
        }

        pageBreaks.push({ 
            elementIndex: index, 
            page: currentPage, 
            isRepeatingHeader: false,
            needsSpaceBefore: spaceNeededBefore > 0
        });

        currentContentHeight += totalNeededHeight;
    });

    return pageBreaks;
}
