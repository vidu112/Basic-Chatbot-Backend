// demoEmail.js
import dotenv from "dotenv";
import { sendVerificationEmail } from "../src/services/mailService.js";

dotenv.config();

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: node demoEmail.js your-email@example.com");
    process.exit(1);
  }
  try {
    // We’ll reuse the same template as verification
    await sendVerificationEmail(to, "DEMO_TOKEN");
    console.log("✅ Demo email sent to", to);
  } catch (err) {
    console.error("❌ Failed to send demo email:", err);
  }
}

main();
