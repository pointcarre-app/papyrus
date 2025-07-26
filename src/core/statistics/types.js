/**
 * @module types
 * @description Shared type definitions for the statistics module.
 */

/**
 * @typedef {object} Margins
 * @property {number} top - The top margin in millimeters.
 * @property {number} right - The right margin in millimeters.
 * @property {number} bottom - The bottom margin in millimeters.
 * @property {number} left - The left margin in millimeters.
 */

/**
 * @typedef {object} PageBreak
 * @property {number} page - The page number.
 * @property {number} elementIndex - The index of the element in the content model.
 * @property {boolean} [isRepeatingHeader] - Whether the element is a repeating header.
 */

/**
 * @typedef {object} SpacingBreakdown
 * @property {number} totalSpacing - Total spacing in millimeters.
 * @property {number} headerSpacing - Spacing related to headers in millimeters.
 * @property {number} elementSpacing - Spacing between regular elements in millimeters.
 * @property {number} totalContentHeight - Total height of content without spacing.
 */

/**
 * @typedef {object} Statistics
 * @property {number} totalPages - The total number of pages.
 * @property {number} totalItems - The total number of content items.
 * @property {Margins} margins - The page margins.
 * @property {number} spaceBetweenDivs - The space between content elements.
 * @property {boolean} hasRepeatingHeader - Whether a repeating header is present.
 * @property {number} repeatingHeaderHeight - The height of the repeating header.
 * @property {PageBreak[]} [pageBreaks] - An array of page break information.
 */

export {};
