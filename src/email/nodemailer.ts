import nodemailer from "nodemailer";

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: true,
  },
  auth: {
    // type: 'login',
    user: email,
    pass: password,
  },
  debug: true,
  logger: true,
});

export const mailOptions = {
  from: email,
  // to:email,
};
