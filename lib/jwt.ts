"use server"
import jwt from "jsonwebtoken";

export const handleCreateToken = (): string => {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT_PRIVATE_KEY is not defined in environment");
  }

  const payload = {
    allowed: true,
    iat: Math.floor(Date.now() / 1000), // issued at
  };

  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: "5m", // set expiration for safety
  });

  return token;
};
