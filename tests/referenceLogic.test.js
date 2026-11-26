
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    validateReference,
    isDuplicate,
    addReference,
    ensureReferenceIds,
    updateReference,
    formatReference
} from "../referenceLogic.js";

test("Valid reference is accepted", () => {
    assert.equal(
        validateReference("Matti", "JavaScript", "2024"),
        true
    );
});

test("Empty author is rejected", () => {
    assert.equal(
        validateReference("", "JavaScript", "2024"),
        false
    );
});

test("Empty title is rejected", () => {
    assert.equal(
        validateReference("Matti", "", "2024"),
        false
    );
});

test("Empty year is rejected", () => {
    assert.equal(
        validateReference("Matti", "JavaScript", ""),
        false
    );
});

test("Decimal year is rejected", () => {
    assert.equal(
        validateReference("Matti", "JavaScript", "2024.5"),
        false
    );
});

test("Year over 9999 is rejected", () => {
    assert.equal(
        validateReference("Matti", "JavaScript", "10000"),
        false
    );
});

test("Duplicate reference is detected", () => {
    const references = [
        { author: "Matti", title: "JavaScript", year: 2024 }
    ];

    assert.equal(
        isDuplicate(references, {
            author: "matti",
            title: "javascript",
            year: 2024
        }),
        true
    );
});

test("Different reference is not a duplicate", () => {
    const references = [
        { author: "Matti", title: "JavaScript", year: 2024 }
    ];

    assert.equal(
        isDuplicate(references, {
            author: "Liisa",
            title: "Testing",
            year: 2023
        }),
        false
    );
});

test("Valid reference is added", () => {
    const references = [];

    assert.equal(
        addReference(references, {
            author: "Matti",
            title: "JavaScript",
            year: "2024"
        }),
        true
    );

    assert.equal(references.length, 1);
    assert.equal(typeof references[0].id, "string");
});

test("Duplicate reference is not added", () => {
    const references = [
        { author: "Matti", title: "JavaScript", year: 2024 }
    ];

    assert.equal(
        addReference(references, {
            author: "Matti",
            title: "JavaScript",
            year: "2024"
        }),
        false
    );

    assert.equal(references.length, 1);
});

test("Existing references receive IDs while unique IDs are preserved", () => {
    const references = [
        { author: "Matti", title: "JavaScript", year: 2024 },
        { id: "kept-id", author: "Liisa", title: "Testing", year: 2023 },
        { id: "kept-id", author: "Pekka", title: "Design", year: 2022 }
    ];

    assert.equal(ensureReferenceIds(references), true);
    assert.equal(typeof references[0].id, "string");
    assert.equal(references[1].id, "kept-id");
    assert.equal(new Set(references.map(reference => reference.id)).size, 3);
    assert.equal(ensureReferenceIds(references), false);
});

test("Reference is updated in place by ID", () => {
    const reference = {
        id: "reference-id",
        author: "Matti",
        title: "JavaScript",
        year: 2024
    };
    const references = [reference];

    assert.equal(
        updateReference(references, "reference-id", {
            author: "Liisa",
            title: "Testing",
            year: "2023"
        }),
        true
    );

    assert.equal(references[0], reference);
    assert.deepEqual(reference, {
        id: "reference-id",
        author: "Liisa",
        title: "Testing",
        year: 2023
    });
});

test("Duplicate reference is not updated", () => {
    const references = [
        { id: "first", author: "Matti", title: "JavaScript", year: 2024 },
        { id: "second", author: "Liisa", title: "Testing", year: 2023 }
    ];
    const original = { ...references[0] };

    assert.equal(
        updateReference(references, "first", {
            author: "Liisa",
            title: "Testing",
            year: "2023"
        }),
        false
    );
    assert.deepEqual(references[0], original);
});

test("Reference is formatted in APA 7 style", () => {
    assert.equal(
        formatReference({
            author: "Matti Meikalainen",
            title: "JavaScript",
            year: 2024
        }),
        "Matti Meikalainen. (2024). JavaScript."
    );
});
