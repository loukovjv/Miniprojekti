
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
 * Assigns IDs to references that do not have a unique ID.
 *
 * @param {Reference[]} references
 * @returns {boolean} True when at least one ID was assigned.
 */
export function ensureReferenceIds(references) {
    const ids = new Set();
    let changed = false;

    for (const reference of references) {
        if (
            typeof reference.id !== "string" ||
            reference.id.trim() === "" ||
            ids.has(reference.id)
        ) {
            reference.id = globalThis.crypto.randomUUID();
            changed = true;
        }

        ids.add(reference.id);
    }

    return changed;
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
        id: globalThis.crypto.randomUUID(),
        author: newReference.author.trim(),
        title: newReference.title.trim(),
        year: Number(newReference.year)
    });

    return true;
}

/**
 * Validates and updates a reference without changing its ID or array position.
 *
 * @param {Reference[]} references
 * @param {string} id
 * @param {ReferenceInput} updatedReference
 * @returns {boolean} True when the reference was updated.
 */
export function updateReference(references, id, updatedReference) {
    if (
        !validateReference(
            updatedReference.author,
            updatedReference.title,
            updatedReference.year
        )
    ) {
        return false;
    }

    const reference = references.find(item => item.id === id);
    const duplicateExists = isDuplicate(
        references.filter(item => item.id !== id),
        updatedReference
    );
    if (!reference || duplicateExists) {
        return false;
    }

    Object.assign(reference, {
        author: updatedReference.author.trim(),
        title: updatedReference.title.trim(),
        year: Number(updatedReference.year)
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
