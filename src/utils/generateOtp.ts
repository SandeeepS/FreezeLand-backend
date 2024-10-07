import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPOTER_EMAIL,
    pass: process.env.TRANSPOTER_PASS,
  },
});

export const generateAndSendOTP = async (
  toEmail: string
): Promise<string | null> => {
  try {
    console.log("provider email is ", process.env.TRANSPOTER_EMAIL);
    console.log("provider password is ", process.env.TRANSPOTER_PASS);
    const otp: string | null = generateRandomOTP();
    console.log("the reciver email is ", toEmail);
    const mailOptions = {
      from: process.env.TRANSPOTER_EMAIL,
      to: toEmail,
      subject: "OTP Verification",
      text: `Welcome to FreezeLand. Your OTP for registration is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.log("error while generating the otp ", error as Error);
    return null;
  }
};

function generateRandomOTP(): string {
  const otpLength = 6;
  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  const randomOTP = Math.floor(min + Math.random() * (max - min + 1));
  return randomOTP.toString();
}
