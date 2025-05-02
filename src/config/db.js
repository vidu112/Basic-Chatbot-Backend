import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("🚨 [db.js] MONGODB_URI is not defined in .env");
  process.exit(1);
}

mongoose.set("strictQuery", false);

mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default mongoose;
