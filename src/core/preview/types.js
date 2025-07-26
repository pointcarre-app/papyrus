/**
 * @module types
 * @description Shared type definitions for the preview module.
 */

/**
 * @typedef {object} PageBreakCalculationParams
 * @property {HTMLElement[]} elements - The array of content elements.
 * @property {number[]} elementHeights - The heights of the content elements in millimeters.
 * @property {number} usablePageHeight - The usable height of a page in millimeters.
 * @property {number} spaceBetweenDivs - The space between divs in millimeters.
 * @property {number} repeatingHeaderHeight - The height of the repeating header in millimeters.
 * @property {boolean} hasRepeatingHeader - Whether there is a repeating header.
 */

/**
 * @typedef {object} PageGenerationParams
 * @property {HTMLElement} container - The main container for the pages.
 * @property {import('../../core/statistics/types.js').PageBreak[]} pageBreaks - The calculated page breaks.
 * @property {HTMLElement[]} elements - The array of content elements.
 * @property {number[]} elementHeights - The heights of the content elements in millimeters.
 * @property {object[]} jsonData - The raw JSON data.
 * @property {import('../../core/statistics/types.js').Margins} margins - The page margins.
 * @property {boolean} showPageNumbers - Whether to show page numbers.
 * @property {boolean} debugMode - Whether debug mode is enabled.
 * @property {number} spaceBetweenDivs - The space between divs in millimeters.
 * @property {boolean} hasRepeatingHeader - Whether there is a repeating header.
 * @property {HTMLElement} repeatingHeaderElement - The repeating header element.
 * @property {number} repeatingHeaderHeight - The height of the repeating header in millimeters.
 */

export {};
