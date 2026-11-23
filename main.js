const editor = document.querySelector("#reference-editor");
const form = document.querySelector("#reference-form");
const author = form.elements.namedItem("author");

editor.addEventListener("toggle", () => {
  if (editor.open) {
    author.focus();
  }
});

form.addEventListener("reset", () => {
  author.focus();
});
