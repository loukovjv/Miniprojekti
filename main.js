import { addReference } from "./referenceLogic.js";

const editor = document.querySelector("#reference-editor");
const form = document.querySelector("#reference-form");
const author = form.elements.namedItem("author");
const title = form.elements.namedItem("title");
const year = form.elements.namedItem("year");
const message = document.querySelector("#message");
const referenceList = document.querySelector("#reference-list");
const emptyMessage = document.querySelector("#empty-reference-message");

// Data structure for saving references
let references = [];

try {
    references = JSON.parse(localStorage.getItem("references") || "[]");
    if (!Array.isArray(references)) {
        references = [];
    }
} catch {
    references = [];
}

function renderReferences() {
    referenceList.replaceChildren();

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

renderReferences();

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

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const reference = {
        author: author.value,
        title: title.value,
        year: year.value
    };

    if (!addReference(references, reference)) {
        message.textContent =
            "Tarkista lomakkeen tiedot tai viite on jo tallennettu.";
        return;
    }

    localStorage.setItem("references", JSON.stringify(references));
    renderReferences();

    message.textContent = "Viite tallennettu onnistuneesti!";
    form.reset();
});

