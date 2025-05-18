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
.connect(uri, {
  // Accept self-signed or unverified certs (dev only!)
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  // optional: fail fast if it can’t connect
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default mongoose;
