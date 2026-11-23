
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    validateReference,
    isDuplicate,
    addReference
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
