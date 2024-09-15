import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  // Configura el transportador SMTP usando las credenciales de GoDaddy
  const transporter = nodemailer.createTransport({
    service: "Godaddy",
    host: "smtpout.secureserver.net", // Servidor SMTP de GoDaddy
    port: 465, // Puerto SMTP seguro de GoDaddy
    secure: true, // true para usar SSL/TLS
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    debug: true,
    auth: {
      user: "tickets@solucionesinnovadorasgdc.com", // Tu correo electrónico de GoDaddy
      pass: "Godaddy.123", // La contraseña de tu correo electrónico
    },
  });

  try {
    await transporter.sendMail({
      from: '"Nombre del Remitente" <tickets@solucionesinnovadorasgdc.com>', // Remitente
      to,
      subject,
      html,
    });
    return NextResponse.json({
      success: true,
      message: "Correo enviado exitosamente",
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json({
      success: false,
      message: "Error al enviar el correo",
    });
  }
}
