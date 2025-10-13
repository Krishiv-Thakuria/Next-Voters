import { NextRequest, NextResponse } from "next/server";
import { handleCreateToken } from "@/server-actions/jwt"; 
import { transporter } from "@/lib/nodemailer";
import { handleGetUser } from "@/lib/admin-user";
import returnErrorResponse from "@/lib/error";

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    if (!email) {
      throw new Error("Email has not been provided.")
    }

    // checking the db here
    const userAdminDb = await handleGetUser(email)

    if (userAdminDb === 0) {
        throw new Error("User is not an admin.")
    }

    const token = await handleCreateToken(email);

    await transporter.sendMail({
      from: `Next Voter's Internal Platform`,
      to: email,
      subject: "Your access token (only valid for 5 minutes)",
      text: `Use the following token: ${token}`,
    });

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error: any) {
    return returnErrorResponse(error);  
  }
};
