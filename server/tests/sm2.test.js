
import test from "node:test";
import assert from "node:assert/strict";
import { calculateNextReview } from "../utils/sm2.js";

const baseCard = {
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5
};

test("Good rating schedules first review after 1 day", () => {
    const result = calculateNextReview(baseCard, "Good");

    assert.equal(result.repetitions, 1);
    assert.equal(result.interval, 1);
    assert.equal(result.easeFactor, 2.5);
});

test("Good rating schedules second review after 6 days", () => {
    const card = {
        ...baseCard,
        repetitions: 1,
        interval: 1
    };

    const result = calculateNextReview(card, "Good");

    assert.equal(result.repetitions, 2);
    assert.equal(result.interval, 6);
});

test("Good rating calculates the next interval correctly", () => {
    const card = {
        ...baseCard,
        repetitions: 2,
        interval: 6
    };

    const result = calculateNextReview(card, "Good");

    assert.equal(result.repetitions, 3);
    assert.equal(result.interval, 15);
});

test("Again rating resets repetitions and schedules after 1 day", () => {
    const card = {
        ...baseCard,
        repetitions: 3,
        interval: 15
    };

    const result = calculateNextReview(card, "Again");

    assert.equal(result.repetitions, 0);
    assert.equal(result.interval, 1);
    assert.equal(result.easeFactor, 1.7);
});

test("Easy rating increases the ease factor", () => {
    const result = calculateNextReview(baseCard, "Easy");

    assert.equal(result.repetitions, 1);
    assert.equal(result.easeFactor, 2.6);
});

test("Invalid rating throws an error", () => {
    assert.throws(
        () => calculateNextReview(baseCard, "Invalid"),
        { message: "Invalid review rating" }
    );
});
