import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY_JWT || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validar que el cuerpo tenga user y password
    if (!body || !body.user || !body.password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar usuario por nombre de usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { username: body.user },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Comparar la contraseña ingresada con la almacenada (hasheada)
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Generar un token JWT
    // const newToken = jwt.sign({ userId: user.id }, SECRET_KEY, {
    //   expiresIn: "1h",
    // });
    const newToken = jwt.sign({ userId: user.id }, SECRET_KEY);

    // Devolver el token en la cabecera 'user-token'
    const response = NextResponse.json({ token: newToken }, { status: 200 });
    response.headers.set("user-token", newToken);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
