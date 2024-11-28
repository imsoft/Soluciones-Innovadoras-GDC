import { z } from "zod";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email/email-template"; // Asegúrate de tener el template importado

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY_JWT || "";
const resend = new Resend(process.env.RESEND_API_KEY);

const orderSchema = z.object({
  storeId: z.string(),
  storeRappiId: z.string(),
  orderRappiId: z.string(),
  total: z.number(),
  netValue: z.number(),
  taxes: z.number(),
  totalWithDiscount: z.number(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  paymentMethod: z.string(),
  customerDocument: z.string(),
  customerDocumentType: z.number(),
  customerAddress: z.string(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  country: z.string(),
  city: z.string(),
  status: z.object({
    id: z.string(),
    name: z.string(),
  }),
  orderItems: z.array(
    z.object({
      quantity: z.number(),
      price: z.number(),
      priceWithDiscount: z.number(),
      lote: z.string().nullable(),
      syncProductId: z.string().nullable(),
      externalProductId: z.string().nullable(),
      name: z.string(),
      ean: z.string(),
      taxes: z.array(
        z.object({
          value: z.number(),
        })
      ),
    })
  ),
});

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
      userId = String(decodedToken.userId);
    } else {
      return NextResponse.json(
        { error: "Token inválido o falta el userId" },
        { status: 401 }
      );
    }

    // Guardar la orden en la base de datos directamente con los datos del body
    // const order = await prisma.order.create({
    //   data: {
    //     storeId: body.storeId,
    //     storeRappiId: body.storeRappiId,
    //     orderRappiId: body.orderRappiId,
    //     totalAmount: body.total,
    //     netValue: body.netValue,
    //     taxes: body.taxes,
    //     totalWithDiscount: body.totalWithDiscount,
    //     customerName: body.customerName,
    //     customerEmail: body.customerEmail,
    //     customerPhone: body.customerPhone,
    //     paymentMethod: body.paymentMethod,
    //     customerDocument: body.customerDocument,
    //     customerDocumentType: body.customerDocumentType,
    //     customerAddress: body.customerAddress,
    //     createdAt: new Date(body.createdAt),
    //     updatedAt: new Date(body.updatedAt),
    //     country: body.country,
    //     city: body.city,
    //     statusId: body.status.id,
    //     statusName: body.status.name,
    //     userId: userId,
    //     orderProducts: {
    //       create: body.orderItems.map((item: any) => ({
    //         quantity: item.quantity,
    //         price: item.price,
    //         taxes: item.taxes[0].value,
    //         priceWithDiscount: item.priceWithDiscount,
    //         lote: item.lote,
    //         // Crear un producto de Rappi si no tiene productId regular
    //         rappiProduct: {
    //           create: {
    //             syncProductId: item.syncProductId,
    //             externalProductId: item.externalProductId,
    //             name: item.name,
    //             ean: item.ean,
    //             quantity: item.quantity,
    //             price: item.price,
    //             taxes: item.taxes[0].value,
    //             priceWithDiscount: item.priceWithDiscount,
    //             lote: item.lote,
    //           },
    //         },
    //       })),
    //     },
    //   },
    // });

    const validatedData = orderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        storeId: validatedData.storeId,
        storeRappiId: validatedData.storeRappiId,
        orderRappiId: validatedData.orderRappiId,
        totalAmount: validatedData.total,
        netValue: validatedData.netValue,
        taxes: validatedData.taxes,
        totalWithDiscount: validatedData.totalWithDiscount,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        paymentMethod: validatedData.paymentMethod,
        customerDocument: validatedData.customerDocument,
        customerDocumentType: validatedData.customerDocumentType,
        customerAddress: validatedData.customerAddress,
        createdAt: new Date(validatedData.createdAt),
        updatedAt: new Date(validatedData.updatedAt),
        country: validatedData.country,
        city: validatedData.city,
        statusId: validatedData.status.id,
        statusName: validatedData.status.name,
        userId: userId,
        orderProducts: {
          create: validatedData.orderItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            taxes: item.taxes[0]?.value || 0,
            priceWithDiscount: item.priceWithDiscount,
            lote: item.lote,
            rappiProduct: {
              create: {
                syncProductId: item.syncProductId,
                externalProductId: item.externalProductId,
                name: item.name,
                ean: item.ean,
                quantity: item.quantity,
                price: item.price,
                taxes: item.taxes[0]?.value || 0,
                priceWithDiscount: item.priceWithDiscount,
                lote: item.lote,
              },
            },
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
      { error: "Error interno del servidor: ", errorMessage: error },
      { status: 500 }
    );
  }
}
