const editor = document.querySelector("#reference-editor");
const form = document.querySelector("#reference-form");
const author = form.elements.namedItem("author");
const title = form.elements.namedItem("title");
const year = form.elements.namedItem("year");
const message = document.querySelector("#message");

// Data structure for saving references
const references = JSON.parse(
    localStorage.getItem("references") || "[]"
);

// Focus author field when form opens
editor.addEventListener("toggle", () => {
    if (editor.open) {
        author.focus();
    }
});

// Focus author field when form is reset
form.addEventListener("reset", () => {
    author.focus();
});

// Validate form inputs
function validateReference(authorValue, titleValue, yearValue) {
    if (
        authorValue.trim() === "" ||
        titleValue.trim() === "" ||
        yearValue.trim() === ""
    ) {
        return false;
    }

    const numericYear = Number(yearValue);

    if (
        !Number.isInteger(numericYear) ||
        numericYear < 1 ||
        numericYear > 9999
    ) {
        return false;
    }

    return true;
}

// Check for duplicate references
function isDuplicate(newReference) {
    return references.some(reference =>
        reference.author.trim().toLowerCase() ===
            newReference.author.toLowerCase() &&
        reference.title.trim().toLowerCase() ===
            newReference.title.toLowerCase() &&
        Number(reference.year) === newReference.year
    );
}

// Save reference when form is submitted
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const reference = {
        author: author.value.trim(),
        title: title.value.trim(),
        year: Number(year.value)
    };

    // Validate inputs
    if (!validateReference(
        reference.author,
        reference.title,
        year.value
    )) {
        message.textContent = "Tarkista lomakkeen tiedot.";
        return;
    }

    // Check for duplicates
    if (isDuplicate(reference)) {
        message.textContent = "Tämä viite on jo tallennettu.";
        return;
    }

    // Save reference to data structure
    references.push(reference);

    // Save references to browser storage
    localStorage.setItem("references", JSON.stringify(references));

    message.textContent = "Viite tallennettu onnistuneesti!";

    // Clear form after successful saving
    form.reset();
});
