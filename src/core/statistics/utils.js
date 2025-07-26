/**
 * @module utils
 * @description Utility functions for the statistics module.
 */

/**
 * Retrieves all content elements that are rendered on a specific page.
 * It uses the `pageBreaks` data from the `stats` object for accuracy,
 * but falls back to the `pageNumber` property on content model items if needed.
 *
 * @param {number} pageNum - The page number to retrieve elements for.
 * @param {import('./types.js').Statistics} stats - The statistics object containing page break information.
 * @returns {object[]} An array of content elements for the specified page.
 */
export function getElementsForPage(pageNum, stats) {
    const contentModel = window.contentModel;
    if (!contentModel || !contentModel.items) return [];

    // If we have page breaks info from stats, use it (preferred method for accuracy)
    if (stats.pageBreaks) {
        const elementsOnPage = stats.pageBreaks
            .filter(pb => pb.page === pageNum && !pb.isRepeatingHeader)
            .map(pb => {
                const item = contentModel.items[pb.elementIndex];
                if (!item) {
                    console.warn(`📊 Element ${pb.elementIndex} not found in content model for page ${pageNum}`);
                    return null;
                }
                return {
                    ...item,
                    originalIndex: pb.elementIndex,
                    pageNumber: pageNum
                };
            })
            .filter(item => item !== null);
        
        console.log(`📊 Page ${pageNum}: Found ${elementsOnPage.length} elements using pageBreaks data`);
        return elementsOnPage;
    }
    
    // Fallback: use pageNumber from content model items
    const fallbackElements = contentModel.items
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter(item => item.pageNumber === pageNum);
    
    console.log(`📊 Page ${pageNum}: Found ${fallbackElements.length} elements using fallback method`);
    return fallbackElements;
}
