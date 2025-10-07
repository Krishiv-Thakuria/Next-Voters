"use server";

import jwt from "jsonwebtoken";

export const handleCreateToken = async (email: string): Promise<string> => {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT_PRIVATE_KEY is not defined in environment");
  }

  const payload = {
    allowed: true,
    email,
    iat: Math.floor(Date.now() / 1000), 
  };

  const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "2m", 
  });

  return token;
};


export const handleVerifyToken = async (token: string): Promise<boolean> => {
  try {
    if (!process.env.JWT_PRIVATE_KEY) {
      throw new Error("JWT_PRIVATE_KEY is not defined");
    }

    jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    return true; 
  } catch (err) {
    return false; 
  }
};
