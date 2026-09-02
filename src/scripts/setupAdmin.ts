import dotenv from "dotenv";
import { AdminModel } from "../models/index.js";
import { hashPassword } from "../utils/bcrypt.js";

dotenv.config();

async function setupAdmin() {
  console.log("\n?? Admin Account Setup\n");

  const username = "admin";
  const email = "admin@example.com";
  const password = "Admin123456";

  try {
    const existing = await AdminModel.findOne({ username });
    
    if (existing) {
      console.log("\n? Admin with this username already exists.");
      return;
    }

    const hashedPassword = await hashPassword(password);
    const admin = await AdminModel.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("\n? Admin account created successfully!");
    console.log("   Username: " + username);
    console.log("   Password: " + password);
    console.log("   Email: " + email);
    console.log("\nYou can now log in at: http://localhost:5173/admin/login");

  } catch (error) {
    console.error("\n? Error creating admin:", error);
  }
}

setupAdmin();
