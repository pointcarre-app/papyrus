/**
 * @module preview-generator
 * @description Main entry point for generating the multi-page preview.
 */

import { getJSONFromTextarea, createElementFromJSON, updateDebugHeightIndicators } from '../../utils/json-handler.js';
import { contentModel } from '../content-model.js';
import { updateStatisticsDisplay } from '../statistics/index.js';
import { getCurrentMargins, getCurrentSpaceBetweenDivs } from '../margin-config.js';
import { getShowPageNumbers } from '../page-number-config.js';
import { A4_HEIGHT_MM, MM_TO_PX, createTempMeasurePage } from './utils.js';
import { calculatePageBreaks } from './calculator.js';
import { generateFinalPages } from './renderer.js';

/**
 * Updates the content model and statistics display with the latest data.
 *
 * @param {object} params - The parameters for updating the content model.
 * @param {object[]} params.jsonData - The raw JSON data.
 * @param {number[]} params.elementHeights - The heights of the elements in millimeters.
 * @param {import('../statistics/types.js').PageBreak[]} params.pageBreaks - The calculated page breaks.
 * @param {import('../statistics/types.js').Margins} params.margins - The page margins.
 * @param {number} params.spaceBetweenDivs - The space between divs in millimeters.
 * @param {number} params.repeatingHeaderHeight - The height of the repeating header in millimeters.
 * @param {boolean} params.hasRepeatingHeader - Whether there is a repeating header.
 */
function updateContentModelAndStats({ jsonData, elementHeights, pageBreaks, margins, spaceBetweenDivs, repeatingHeaderHeight, hasRepeatingHeader }) {
    contentModel.loadFromJSON(jsonData);
    contentModel.updateMargins(margins);

    contentModel.items.forEach((item, index) => {
        item.heightMm = elementHeights[index] || 0;
        const pageBreak = pageBreaks.find(pb => pb.elementIndex === index);
        item.pageNumber = pageBreak ? pageBreak.page : 1;
    });

    if (hasRepeatingHeader) {
        contentModel.repeatingHeaderHeightMm = repeatingHeaderHeight;
    }

    const totalPages = Math.max(1, Math.max(...pageBreaks.map(pb => pb.page)));

    updateStatisticsDisplay({
        totalItems: jsonData.length,
        totalPages: totalPages,
        margins,
        spaceBetweenDivs,
        repeatingHeaderHeight,
        hasRepeatingHeader,
        pageBreaks
    });
}

/**
 * Main function to generate the preview from the JSON content.
 * This orchestrates the entire process of measuring, calculating, and rendering.
 */
function generatePreviewFromJSON() {
    const container = document.getElementById('pages-container');
    container.innerHTML = '';

    const jsonData = getJSONFromTextarea();
    if (!jsonData || !jsonData.length === 0) {
        window.contentModel = contentModel;
        updateStatisticsDisplay(null);
        return;
    }

    window.contentModel = contentModel;
    const debugMode = window.papyrusDebugMode || false;
    const spaceBetweenDivs = getCurrentSpaceBetweenDivs();
    const margins = getCurrentMargins();
    const showPageNumbers = getShowPageNumbers();
    
    const pageNumberHeight = showPageNumbers ? 8 : 0;
    const usablePageHeight = A4_HEIGHT_MM - margins.top - margins.bottom - pageNumberHeight;
    
    const hasRepeatingHeader = jsonData.length > 0 && jsonData[0].isPapyrusHeader === true;
    let repeatingHeaderHeight = 0;
    let repeatingHeaderElement = null;

    if (hasRepeatingHeader) {
        repeatingHeaderElement = createElementFromJSON(jsonData[0], debugMode);
    }
    
    const elements = jsonData.map(item => createElementFromJSON(item, debugMode));
    const tempPage = createTempMeasurePage();
    document.body.appendChild(tempPage); // Append to body to ensure it's not a child of the container
    const tempContent = tempPage.querySelector('.page-content');
    elements.forEach(el => tempContent.appendChild(el));

    if (window.renderMathInElement) {
        window.renderMathInElement(tempPage, {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]
        });
    }
    
    setTimeout(() => {
        if (hasRepeatingHeader && elements[0]) {
            repeatingHeaderHeight = elements[0].getBoundingClientRect().height / MM_TO_PX;
        }
        
        const elementHeights = elements.map(el => el.getBoundingClientRect().height / MM_TO_PX);
        document.body.removeChild(tempPage); // Remove from the body
        
        const pageBreaks = calculatePageBreaks({
            elements,
            elementHeights,
            usablePageHeight,
            spaceBetweenDivs,
            repeatingHeaderHeight,
            hasRepeatingHeader
        });
        
        generateFinalPages({
            container,
            pageBreaks,
            elements,
            elementHeights,
            jsonData,
            margins,
            showPageNumbers,
            debugMode,
            spaceBetweenDivs,
            hasRepeatingHeader,
            repeatingHeaderElement,
            repeatingHeaderHeight
        });
        
        updateContentModelAndStats({
            jsonData,
            elementHeights,
            pageBreaks,
            margins,
            spaceBetweenDivs,
            repeatingHeaderHeight,
            hasRepeatingHeader
        });
    }, 100);
}

/**
 * Kicks off the preview generation process and updates debug indicators.
 */
export function generatePages() {
    generatePreviewFromJSON();
    
    if (window.papyrusDebugMode) {
        setTimeout(updateDebugHeightIndicators, 150);
    }
}
