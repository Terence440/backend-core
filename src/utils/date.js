/**
 * Returns the current date and hour formatted as 'YYMMDD_HH'.
 *
 * @returns {string} The formatted date string, e.g., '240606_15' for June 6, 2024, 3 PM.
 */
const getFormattedDate = () => {
    const now = new Date();
    const YY = String(now.getFullYear()).slice(2);
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    return `${YY}${MM}${DD}_${HH}`;
};
exports.getFormattedDate = getFormattedDate;
