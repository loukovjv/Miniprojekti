import {
    addReference,
    ensureReferenceIds,
    updateReference
} from "./referenceLogic.js";

const editor = document.querySelector("#reference-editor");
const form = document.querySelector("#reference-form");
const author = form.elements.namedItem("author");
const title = form.elements.namedItem("title");
const year = form.elements.namedItem("year");
const formHeader = document.querySelector("#reference-editor > h1");
const submitButton = document.querySelector("#reference-form > button");
const message = document.querySelector("#message");
const referenceList = document.querySelector("#reference-list");
const emptyMessage = document.querySelector("#empty-reference-message");
const editButton = document.querySelector("#edit");

let editModeOn = false;
let editingReferenceId = null;

/** @type {Reference[]} */
let references = [];

try {
    references = JSON.parse(localStorage.getItem("references") || "[]");
    if (!Array.isArray(references)) {
        references = [];
    }
} catch {
    references = [];
}

if (ensureReferenceIds(references)) {
    localStorage.setItem("references", JSON.stringify(references));
}

/**
 * Renders all saved references as a sorted APA 7 reference list.
 *
 * @returns {void}
 */
function renderReferences() {
    referenceList.replaceChildren();
    editButton.textContent = "Muokkaustila";

    const sortedReferences = [...references].sort((first, second) =>
        first.author.localeCompare(second.author, "fi")
    );

    for (const reference of sortedReferences) {
        const item = document.createElement("li");
        const authorText = document.createTextNode(
            `${reference.author}. (${reference.year}). `
        );
        const titleText = document.createElement("em");
        titleText.textContent = reference.title;

        item.append(authorText, titleText, ".");
        referenceList.append(item);
    }

    emptyMessage.hidden = sortedReferences.length !== 0;
}

/**
 * Renders all saved references as a sorted APA 7 reference list as clickable links.
 *
 * @returns {void}
 */
function renderReferencesEditMode() {
    referenceList.replaceChildren();
    editButton.textContent = "Pois muokkaustilasta";

    const sortedReferences = [...references].sort((first, second) =>
        first.author.localeCompare(second.author, "fi")
    );

    for (const reference of sortedReferences) {
        const item = document.createElement("li");
        item.className = "rivi";

        const link = document.createElement("a");
        link.href = "#";
        const authorText = document.createTextNode(
            `${reference.author}. (${reference.year}). `
        );
        const titleText = document.createElement("em");
        titleText.textContent = reference.title;

        link.append(authorText, titleText, ".");
        link.addEventListener("click", (event) => {
            event.preventDefault();
            setFormMode(true, reference);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Poista";
        deleteButton.id = "delete";
        deleteButton.addEventListener("click", () => {
            const index = references.indexOf(reference);
            if (index !== -1) {
                references.splice(index, 1);
                localStorage.setItem("references", JSON.stringify(references));
                message.textContent = `Viite (${reference.author}) poistettu.`;
            }
            if (editingReferenceId === reference.id) {
                setFormMode(false);
            }
            renderReferencesEditMode();
        });

        item.append(link, deleteButton);
        referenceList.append(item);
    }

    emptyMessage.hidden = sortedReferences.length !== 0;
}

/**
 * Updates the reference form state for creating a new or editing an existing reference.
 *
 * @param {boolean} isEditing
 * @param {Reference | null} [reference]
 * @returns {void}
 */
function setFormMode(isEditing, reference = null) {
    if (isEditing && reference) {
        author.value = reference.author;
        title.value = reference.title;
        year.value = reference.year;
        editingReferenceId = reference.id;
        formHeader.textContent = "Muokkaa viitettä";
        submitButton.textContent = "Tallenna muutokset";
        return;
    }

    editingReferenceId = null;
    formHeader.textContent = "Uusi viite";
    submitButton.textContent = "Tallenna viite";
    form.reset();
}

renderReferences();
setFormMode(false);

/** Focuses the author field when the editor opens. */
editor.addEventListener("toggle", () => {
    if (editor.open) {
        author.focus();
    }
});

/** Focuses the author field after the form is reset. */
form.addEventListener("reset", () => {
    editingReferenceId = null;
    formHeader.textContent = "Uusi viite";
    submitButton.textContent = "Tallenna viite";
    author.focus();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const reference = {
        author: author.value,
        title: title.value,
        year: year.value
    };

    const isEditing = editingReferenceId !== null;
    const saved = isEditing
        ? updateReference(references, editingReferenceId, reference)
        : addReference(references, reference);

    if (!saved) {
        message.textContent =
            "Tarkista lomakkeen tiedot tai viite on jo tallennettu.";
        return;
    }

    localStorage.setItem("references", JSON.stringify(references));
    if (editModeOn) {
        renderReferencesEditMode();
    } else {
        renderReferences();
    }

    message.textContent = isEditing
        ? "Viite päivitetty onnistuneesti!"
        : "Viite tallennettu onnistuneesti!";
    setFormMode(false);
});

editButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (!editModeOn) {
        editModeOn = true;
        renderReferencesEditMode();
        formHeader.textContent = "Muokkaa viitettä";
        submitButton.textContent = "Tallenna muutokset";
        return;
    }

    editModeOn = false;
    renderReferences();
    setFormMode(false);
});