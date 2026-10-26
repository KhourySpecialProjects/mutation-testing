import request from "supertest";
import { createApp } from "../app";
import type { Application } from "express";

let app: Application;

beforeEach(() => {
  app = createApp();
});

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
