import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro
  );

  const mailOptions = {
    from: `Signalist <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Welcome to Signalist - your stock market toolkit is ready!`,
    text: `Hi ${name},\n\n${intro}\n\nWe're excited to have you on board! Explore our tools and features to enhance your stock market experience.\n\nBest regards,\nThe Signalist Team`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
