import { Router, Request, Response, NextFunction } from "express";
import { Book, BookFormats } from "../models/Book";

export const bookRouter = Router();


/**
 * GET request handler for /books/recent endpoint. 
 * It retrieves the most recently published books, 
 * with an optional query parameter 'n' to specify how many books 
 * to return (default is 10, maximum is 100).
 * 
 * E.g. GET /books/recent?n=5 will return the 5 most recently published books.
 * 
 * @param req The Express Request object, which contains the query parameter 'n' that specifies how many recent books to return.
 * @param res The Express Response object, which is used to send the JSON array of book objects back to the client.
 * @param next the error-handling middleware function that is 
 *              called if an error occurs during the processing of 
 *              the request. If an error is caught, it will be 
 *              passed to next(err) specifically the function with the 
 *              signature (err, req, res, next) at the bottom of app.ts
 * 
 * @returns A JSON array of book objects sorted by publication date in descending order.
 *              In case of an error (e.g. invalid 'n' parameter), it returns a 500 status with an error message.
 */

bookRouter.get(
  "/recent",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const raw = req.query.n;
      const n = raw !== undefined ? parseInt(String(raw), 10) : 10;
      if (isNaN(n) || n < 1) {
        return res
          .status(400)
          .json({ error: "Query parameter 'n' must be a positive integer" });
      }

      const limit = Math.min(n, 100);
      const books = await Book.find()
        .sort({ publicationDate: -1 })
        .limit(limit)
        .lean();

      return res.json(books);
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * POST request handler for /books endpoint. 
 * It creates a new book document in the database using the 
 * data provided in the request body.
 * 
 * @param req The Express Request object, which contains the book data in req.body that should conform to the IBook interface.
 * @param res The Express Response object, which is used to send the created book object back to the client with a 201 status code.
 * @param next the error-handling middleware function that is called if an error occurs during the processing of the request. If an error is caught, it will be passed to next(err) specifically the function with the signature (err, req, res, next) at the bottom of app.ts
 * 
 * @returns The created book object in JSON format with a 201 status code. 
 *          In case of a validation error (e.g. missing required fields), it returns a 400 status with an error message.
 *          Or in case of other errors, it passes the error to the next error-handling middleware.
 */
bookRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = new Book(req.body);
      const saved = await book.save();
      return res.status(201).json(saved);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.name === "ValidationError"
      ) {
        return res.status(400).json({ error: err.message });
      }
      return next(err);
    }
  }
);