import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationCode(email, code) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Foodies verification code",
    html: `<p>Your Foodies verification code is: <strong>${code}</strong></p>`,
  });

  if (error) {
    throw new Error(error.message || "Unable to send verification email.");
  }
}
