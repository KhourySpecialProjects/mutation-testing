import { Schema, model, Document, Model } from "mongoose";


/**
 * A readonly list of valid book formats.
 * This is used to define enum types in the Mongoose schema for Books.
 */
export const BookFormats = ["hardcover", "paperback", "online"] as const;

/**
 * BookFormat is a union type of the valid book formats defined in BookFormats.
 * This ensures that any variable of type BookFormat can only be one of the specified formats.
 * It is derived from the BookFormats array using TypeScript's typeof and indexed access types,
 * which means that if we ever change the BookFormats array, the BookFormat type will automatically update to reflect those changes.
 * 
 * @uses BookFormats A readonly array of valid book formats.  
*/
export type BookFormat = (typeof BookFormats)[number];

/**
 * IBook is the TypeScript interface that represents the structure of a Book document in MongoDB.
 * It extends Mongoose's Document interface, which includes properties like _id and methods for interacting with the database.
 
 * @field title The title of the book. Required.
 * @field authors An array of authors of the book. At least one author is required.
 * @field publishers An array of publishers of the book. At least one publisher is required.
 * @field publicationDate The date when the book was published. Required.
 * @field formats An array of formats in which the book is available (e.g., hardcover, paperback, online). At least one format is required.
 * @field totalCopies The total number of copies of the book that exist (physical or digital). Required and must be >= 0.
 * @field copiesAvailable The number of copies currently available for checkout. Required and must be >= 0. Cannot exceed totalCopies.
 * @field onlineUrl The URL where the book can be accessed online. Required if formats includes "online".
 */
export interface IBook extends Document {
  title: string;
  authors: string[];
  publishers: string[];
  publicationDate: Date;
  formats: BookFormat[];
  totalCopies: number;
  copiesAvailable: number;
  onlineUrl?: string;
}

/**
 * The Mongoose schema for the Book model. It defines the structure of the Book documents in MongoDB, including field types, validation rules, and indexes.
 * 
 * Validation rules are similar to those defined in the IBook interface, but they are enforced at the database level when documents are created or updated.
 */
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,   // removes leading/trailing whitespace
    },
    authors: {
      type: [String],
      required: [true, "at least one author is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "authors must not be empty",
      },
    },
    publishers: {
      type: [String],
      required: [true, "at least one publisher is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "publishers must not be empty",
      },
    },
    publicationDate: {
      type: Date,
      required: [true, "publicationDate is required"],
    },
    formats: {
      type: [String],
      enum: {
        values: BookFormats,
        message: "{VALUE} is not a valid book format",
      },
      required: [true, "at least one format is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "formats must not be empty",
      },
    },
    totalCopies: {
      type: Number,
      required: [true, "totalCopies is required"],
      min: [0, "totalCopies must be >= 0"],
    },
    copiesAvailable: {
      type: Number,
      required: [true, "copiesAvailable is required"],
      min: [0, "copiesAvailable must be >= 0"],
    },
    onlineUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
    versionKey: false,
  }
);

/**
* @param "validate" The name of the Mongoose middleware hook to run before validation.
* @param function The synchronous middleware function that runs custom validation logic.
* If any validation errors are added with this.invalidate(), Mongoose will handle
* them and prevent the document from being saved until they are resolved.
*/
bookSchema.pre("validate", function () {
    if (this.formats?.includes("online") && !this.onlineUrl) {
        this.invalidate(
            "onlineUrl",
            "onlineUrl is required when formats includes online"
        );
    }
    if (this.copiesAvailable > this.totalCopies) {
        this.invalidate(
            "copiesAvailable",
            "copiesAvailable cannot exceed totalCopies"
        );
    }
});

/**
 * Indexes are used to improve the performance of database queries
 * by keeping a sorted copy of the data based on the specified fields
 * on disk. In this case, we create an index on the 
 * publicationDate field in descending order (-1) to optimize 
 * queries that sort or filter by publication date, such as 
 * finding the most recently published books.
 */
bookSchema.index({ publicationDate: -1 });

// create and export the Book model based on the IBook interface and bookSchema.
export const Book: Model<IBook> = model<IBook>("Book", bookSchema);