import db from "../db/knex";
import bcrypt from "bcryptjs";

const User = {
  queryOne: async function (query: Record<string, any>) {
    try {
      const user = await db("users").where(query).first();
      return user || null;
    } catch (error) {
      console.error("Error querying user:", error);
      throw new Error("Error querying user");
    }
  },
  create: async (username: string, email: string, password: string) => {
    try {
      const user = await db("users")
        .insert({
          username,
          email,
          hashedPassword: password,
          signed_agreement: "NO",
        })
        .returning("*");
      return user || null;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  },
  comparePassword: async (password: string, hashedPassword: string) => {
    try {
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      return isPasswordValid;
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw new Error("Error comparing passwords");
    }
  },
};

export default User;
