"use server";
import jwt from "jsonwebtoken";

// returns a string token
export const handleCreateToken = async (email: string): Promise<string> => {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT_PRIVATE_KEY is not defined in environment");
  }

  const payload = {
    allowed: true,
    email,
    iat: Math.floor(Date.now() / 1000), // issued at
  };

  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "5m", // set expiration for safety
  });

  return token;
};
