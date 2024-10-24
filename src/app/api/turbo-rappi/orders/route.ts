import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template"; // Asegúrate de tener el template importado

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY_JWT || "";
const resend = new Resend(process.env.RESEND_API_KEY);

// Handler para el método POST
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificar que el token esté presente en los headers
    const token = req.headers.get("user-token");
    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    // Verificar el token JWT y obtener el userId
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    // Verificar que el token incluye el userId
    let userId: string;
    if (typeof decodedToken !== "string" && "userId" in decodedToken) {
      userId = decodedToken.userId;
    } else {
      return NextResponse.json(
        { error: "Token inválido o falta el userId" },
        { status: 401 }
      );
    }

    // Guardar la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        storeId: body.storeId,
        storeRappiId: body.storeRappiId,
        orderRappiId: body.orderRappiId,
        totalAmount: body.total,
        netValue: body.netValue,
        taxes: body.taxes,
        totalWithDiscount: body.totalWithDiscount,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        paymentMethod: body.paymentMethod,
        customerDocument: body.customerDocument,
        customerDocumentType: body.customerDocumentType,
        customerAddress: body.customerAddress,
        createdAt: new Date(body.createdAt),
        updatedAt: new Date(body.updatedAt),
        country: body.country,
        city: body.city,
        statusId: body.status.id,
        statusName: body.status.name,
        userId: userId, // Asegurarse de añadir el userId aquí
        orderProducts: {
          create: body.orderItems.map((item: any) => ({
            syncProductId: item.syncProductId,
            externalProductId: item.externalProductId,
            name: item.name,
            ean: item.ean,
            quantity: item.quantity,
            price: item.price,
            taxes: item.taxes[0].value,
            priceWithDiscount: item.priceWithDiscount,
            lote: item.lote,
          })),
        },
      },
    });

    // Preparar los productos para la plantilla de correo
    const products = body.orderItems.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Enviar un correo electrónico con Resend usando un template
    const { data, error } = await resend.emails.send({
      from: "Cloud Store <tickets@cloudstore.mx>",
      to: [body.customerEmail],
      subject: "Detalles de tu pedido",
      react: EmailTemplate({ products, totalAmount: body.total }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Orden guardada y correo enviado", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
