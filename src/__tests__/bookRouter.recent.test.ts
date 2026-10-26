import request from "supertest";
import { createApp } from "../app";
import { Book } from "../models/Book";
import type { IBook } from "../models/Book";

// ── Mock the entire Book model module ─────────────────────────────────────
//
// jest.mock hoists this to the top of the file before any imports are
// evaluated, so the real Mongoose model is never instantiated and no
// MongoDB connection is needed.

jest.mock("../models/Book", () => ({
  Book: {
    find: jest.fn(),
  },
}));

// ── Fixture data ───────────────────────────────────────────────────────────
//
// Three books in descending publicationDate order — exactly what the
// handler should return when n=3.

const mockBooks: Partial<IBook>[] = [
  {
    title: "Advanced TypeScript",
    authors: ["Alice"],
    publishers: ["TechPress"],
    publicationDate: new Date("2024-06-01"),
    formats: ["hardcover"],
    totalCopies: 5,
    copiesAvailable: 3,
  },
  {
    title: "Node.js in Practice",
    authors: ["Bob"],
    publishers: ["DevBooks"],
    publicationDate: new Date("2023-03-15"),
    formats: ["paperback", "online"],
    totalCopies: 10,
    copiesAvailable: 7,
    onlineUrl: "https://example.com/nodejs",
  },
  {
    title: "Clean Code",
    authors: ["Charlie"],
    publishers: ["OldPress"],
    publicationDate: new Date("2022-01-10"),
    formats: ["paperback"],
    totalCopies: 8,
    copiesAvailable: 8,
  },
];

/**
 * Reusable helper to set up the mock chain for Book.find().sort().limit().lean()
 * @param books the array of book objects that the mock should return when lean() is called
 */
function createMockChain(books: Partial<IBook>[]) {
  const leanMock = jest.fn().mockResolvedValue(books);
  const limitMock = jest.fn().mockReturnValue({ lean: leanMock });
  const sortMock = jest.fn().mockReturnValue({ limit: limitMock });
  (Book.find as jest.Mock).mockReturnValue({ sort: sortMock });
}

// ── Test suite for GET /books/recent ────────────────────────────────────
describe("GET /books/recent", () => {
  const app = createApp();

  beforeEach(() => {
    createMockChain(mockBooks);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with books sorted by publicationDate descending", async () => {
    const res = await request(app).get("/books/recent?n=3");

    expect(Book.find().sort().limit).toHaveBeenCalledWith(3);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);

    // Verify descending order by publicationDate
    const dates = (res.body as Array<{ publicationDate: string }>).map(
      (b) => new Date(b.publicationDate).getTime()
    );
    expect(dates[0]).toBeGreaterThan(dates[1]);
    expect(dates[1]).toBeGreaterThan(dates[2]);
  });

  it("undefined n defaults to 10", async () => {
    await request(app).get("/books/recent");

    expect(Book.find().sort).toHaveBeenCalledWith({ publicationDate: -1 });
    expect(Book.find().sort().limit).toHaveBeenCalledWith(10);
  });

  it("returns 400 for invalid n (negative)", async () => {
    const res = await request(app).get("/books/recent?n=-5");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Query parameter 'n' must be a positive integer",
    });
  });

  it("returns 400 for invalid n (non-integer)", async () => {
    const res = await request(app).get("/books/recent?n=abc");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Query parameter 'n' must be a positive integer",
    });
  });

  it("limit needs to be called with 1 when n=1", async () => {
    const res = await request(app).get("/books/recent?n=1");

    expect(Book.find().sort().limit).toHaveBeenCalledWith(1);
    expect(res.status).toBe(200);
  });

  it("returns 500 when Book.find throws", async () => {
  (Book.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error("DB connection lost")),
      }),
    }),
  });

  const res = await request(app).get("/books/recent?n=3");
  expect(res.status).toBe(500);
  });
});
