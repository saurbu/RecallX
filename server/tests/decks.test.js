let secondAgent;
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let app;
let agent;
let deckId;
let cardId;

before(async () => {
    process.env.JWT_SECRET = "recallx_test_secret_key_123456789";
    process.env.CLIENT_URL = "http://localhost:5173";

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const appModule = await import("../app.js");
    app = appModule.default;

    agent = request.agent(app);

    await agent.post("/api/auth/register").send({
        name: "Deck Tester",
        email: "decktester@recallx.com",
        password: "TestPassword123",
        timezone: "Asia/Kolkata"
    });
    secondAgent = request.agent(app);

    await secondAgent.post("/api/auth/register").send({
        name: "Second Tester",
        email: "secondtester@recallx.com",
        password: "TestPassword123",
        timezone: "Asia/Kolkata"
    });
});

after(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
});

test("User can create a deck", async () => {
    const response = await agent.post("/api/decks").send({
        title: "JavaScript Testing",
        description: "Testing RecallX deck APIs"
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.deck.title, "JavaScript Testing");

    deckId = response.body.deck._id;
});

test("Deck creation rejects an invalid title", async () => {
    const response = await agent.post("/api/decks").send({
        title: "A"
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

test("User can retrieve their decks", async () => {
    const response = await agent.get("/api/decks");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.count, 1);
});

test("User can create a flashcard", async () => {
    const response = await agent.post("/api/cards").send({
        front: "What is React?",
        back: "A JavaScript library for building user interfaces.",
        deckId
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.card.isNewCard, true);

    cardId = response.body.card._id;
});

test("Card creation rejects empty front and back", async () => {
    const response = await agent.post("/api/cards").send({
        front: " ",
        back: " ",
        deckId
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

test("User can retrieve their flashcards", async () => {
    const response = await agent
        .get(`/api/cards?deckId=${deckId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.count, 1);
    assert.equal(response.body.cards[0]._id, cardId);
});

test("User can submit a review", async () => {
    const response = await agent.post("/api/reviews").send({
        cardId,
        rating: "Good"
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.card.isNewCard, false);
    assert.equal(response.body.card.repetitions, 1);
    assert.equal(response.body.card.interval, 1);
});

test("Invalid review rating is rejected", async () => {
    const response = await agent.post("/api/reviews").send({
        cardId,
        rating: "Excellent"
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

test("User can retrieve their review history", async () => {
    const response = await agent.get("/api/reviews/history");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.count, 1);
});

test("User can retrieve today's review queue", async () => {
    const response = await agent.get("/api/reviews/today");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.summary.dueCount, 0);
    assert.equal(response.body.summary.newCardsAvailable, 0);
});

test("User can retrieve their deck with its cards", async () => {
    const response = await agent.get(`/api/decks/${deckId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.cards.length, 1);
});

test("Another user cannot access someone else's deck", async () => {
    const response = await secondAgent.get(`/api/decks/${deckId}`);

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
});

test("Another user cannot access someone else's cards", async () => {
    const response = await secondAgent.get(
        `/api/cards?deckId=${deckId}`
    );

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
});

test("Another user cannot review someone else's card", async () => {
    const response = await secondAgent.post("/api/reviews").send({
        cardId,
        rating: "Good"
    });

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
});

test("Another user cannot delete someone else's deck", async () => {
    const response = await secondAgent.delete(`/api/decks/${deckId}`);

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
});
