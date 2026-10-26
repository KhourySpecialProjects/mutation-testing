import { createApp } from "./app";
import { connectDB } from "./db/connection";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/library";

async function main(): Promise<void> {
  // uncomment when you have MongoDB running and want to connect
  // await connectDB(MONGO_URI);

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});