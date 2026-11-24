
/**
 * @typedef {Object} Reference
 * @property {string} author
 * @property {string} title
 * @property {number} year
 */

/**
 * @typedef {Object} ReferenceInput
 * @property {string} author
 * @property {string} title
 * @property {string | number} year
 */

/**
 * Checks whether the reference fields contain valid values.
 *
 * @param {string} author
 * @param {string} title
 * @param {string | number} year
 * @returns {boolean} True when all fields are valid.
 */
export function validateReference(author, title, year) {
    if (
        author.trim() === "" ||
        title.trim() === "" ||
        String(year).trim() === ""
    ) {
        return false;
    }

    const numericYear = Number(year);

    return (
        Number.isInteger(numericYear) &&
        numericYear >= 1 &&
        numericYear <= 9999
    );
}

/**
 * Checks whether a reference already exists in the reference collection.
 *
 * @param {Reference[]} references
 * @param {ReferenceInput} newReference
 * @returns {boolean} True when an identical reference exists.
 */
export function isDuplicate(references, newReference) {
    return references.some(reference =>
        reference.author.trim().toLowerCase() ===
            newReference.author.trim().toLowerCase() &&
        reference.title.trim().toLowerCase() ===
            newReference.title.trim().toLowerCase() &&
        Number(reference.year) === Number(newReference.year)
    );
}

/**
 * Validates and adds a reference to the collection.
 *
 * @param {Reference[]} references
 * @param {ReferenceInput} newReference
 * @returns {boolean} True when the reference was added.
 */
export function addReference(references, newReference) {
    if (!validateReference(
        newReference.author,
        newReference.title,
        newReference.year
    )) {
        return false;
    }

    if (isDuplicate(references, newReference)) {
        return false;
    }

    references.push({
        author: newReference.author.trim(),
        title: newReference.title.trim(),
        year: Number(newReference.year)
    });

    return true;
}

/**
 * Formats a reference in APA 7 style.
 *
 * @param {Reference} reference
 * @returns {string} The formatted reference.
 */
export function formatReference(reference) {
    return `${reference.author}. (${reference.year}). ${reference.title}.`;
}
