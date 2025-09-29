import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // your App Password (not your normal Gmail password)
      },
});