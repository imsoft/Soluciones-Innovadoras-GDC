import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY_JWT || "";

// Handler para el método POST
export async function POST(req: Request) {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await req.json();

    // Verificar que el token esté presente en los headers
    const token = req.headers.get("user-token");
    if (!token) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
    }

    // Verificar el token JWT
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
    }

    return NextResponse.json({ message: "Nueva orden", order: body }, { status: 201 });

  } catch (error) {
    console.error("Error al procesar la solicitud", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
