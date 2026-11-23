import { addReference } from "./referenceLogic.js";

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

    message.textContent = "Viite tallennettu onnistuneesti!";
    form.reset();
});

