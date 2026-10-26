import request from "supertest";
import { createApp } from "../app";
import { Book } from "../models/Book";
import type { Application } from "express";

const mockSave = jest.fn();

jest.mock("../models/Book", () => ({
    Book: jest.fn().mockImplementation((data) => ({
        ...data,
        save: mockSave,
    })),
    BookFormats: ["hardcover", "paperback", "online"],
}));

let app: Application;

const validBook = {
    title: "Advanced TypeScript",
    authors: ["Alice"],
    publishers: ["TechPress"],
    publicationDate: "2024-06-01",
    formats: ["hardcover"],
    totalCopies: 5,
    copiesAvailable: 3,
};

beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
});

describe("POST /books", () => {
    it("returns 201 with the saved book", async () => {
        const savedBook = {
            _id: "book-1",
            ...validBook,
        };

        mockSave.mockResolvedValue(savedBook);

        const res = await request(app).post("/books").send(validBook);

        expect(Book).toHaveBeenCalledWith(validBook);
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(savedBook);
    });

    it("returns 400 when saving fails with a validation error", async () => {
        const validationError = new Error("title is required");
        validationError.name = "ValidationError";

        mockSave.mockRejectedValue(validationError);

        const res = await request(app).post("/books").send({
            ...validBook,
            title: "",
        });

        expect(Book).toHaveBeenCalledWith({
            ...validBook,
            title: "",
        });
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "title is required" });
    });

    it("returns 500 when saving fails with a non-validation error", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => undefined);

        mockSave.mockRejectedValue(new Error("database unavailable"));

        const res = await request(app).post("/books").send(validBook);

        expect(Book).toHaveBeenCalledWith(validBook);
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Internal server error" });

        consoleErrorSpy.mockRestore();
    });
});