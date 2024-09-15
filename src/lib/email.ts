import nodemailer from "nodemailer";

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Cambia según tu proveedor de correo
  auth: {
    user: process.env.EMAIL_USER, // Usa variables de entorno para seguridad
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar correo electrónico
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  const mailOptions = {
    from: "Pod Store <your-email@gmail.com>",
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
