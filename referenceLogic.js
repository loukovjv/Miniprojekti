
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

export function isDuplicate(references, newReference) {
    return references.some(reference =>
        reference.author.trim().toLowerCase() ===
            newReference.author.trim().toLowerCase() &&
        reference.title.trim().toLowerCase() ===
            newReference.title.trim().toLowerCase() &&
        Number(reference.year) === Number(newReference.year)
    );
}

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
