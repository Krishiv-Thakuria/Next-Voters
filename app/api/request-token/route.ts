import { NextRequest, NextResponse } from "next/server";
import { handleCreateToken } from "@/lib/jwt"; 
import { transporter } from "@/lib/nodemailer";

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const token = handleCreateToken(email);

    await transporter.sendMail({
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your access token (only valid for 5 minutes)",
      text: `Use the following token: ${token}`,
    });

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
};
