
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let app;
let agent;

before(async () => {
    process.env.JWT_SECRET = "recallx_test_secret_key_123456789";
    process.env.CLIENT_URL = "http://localhost:5173";

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    const appModule = await import("../app.js");
    app = appModule.default;

    agent = request.agent(app);
});

after(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
});

test("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
});

test("Protected profile route should reject unauthenticated users", async () => {
    const response = await request(app).get("/api/auth/me");

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
});

test("User should be able to register", async () => {
    const response = await agent
        .post("/api/auth/register")
        .send({
            name: "RecallX Tester",
            email: "tester@recallx.com",
            password: "TestPassword123",
            timezone: "Asia/Kolkata"
        });

    assert.ok([200, 201].includes(response.status));
    assert.equal(response.body.success, true);
});

test("Duplicate email registration should be rejected", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Another Tester",
            email: "tester@recallx.com",
            password: "TestPassword123",
            timezone: "Asia/Kolkata"
        });

    assert.notEqual(response.body.success, true);
    assert.ok(response.status >= 400);
});

test("User should be able to log in", async () => {
    const response = await agent
        .post("/api/auth/login")
        .send({
            email: "tester@recallx.com",
            password: "TestPassword123"
        });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
});

test("Authenticated user should access their profile", async () => {
    const response = await agent.get("/api/auth/me");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
});

test("User should be able to log out", async () => {
    const response = await agent.post("/api/auth/logout");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    const profileResponse = await agent.get("/api/auth/me");

    assert.equal(profileResponse.status, 401);
});
