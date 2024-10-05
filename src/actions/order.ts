"use server";

import { auth } from "@clerk/nextjs/server"; // Importamos Clerk para obtener el userId
import db from "@/lib/db";

export const createOrder = async (data: {
  customerEmail: string;
  products: { productId: number; quantity: number }[];
  totalAmount: number;
}) => {
  const { userId } = auth(); // Obtenemos el userId desde Clerk

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  // Creamos el pedido utilizando el userId proporcionado por Clerk
  const order = await db.order.create({
    data: {
      userId, // Almacenamos el userId directamente
      customerEmail: data.customerEmail,
      totalAmount: data.totalAmount,
      orderProducts: {
        create: data.products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
      },
    },
    include: {
      orderProducts: true,
    },
  });

  return order;
};

export const getOrders = async () => {
  try {
    const orders = await db.order.findMany({
      include: {
        orderProducts: {
          include: {
            product: true, // Incluir detalles del producto
          },
        },
      },
    });

    const formatter = new Intl.DateTimeFormat("es-MX", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Mexico_City", // Ajustar zona horaria
    });

    // Transformar los datos al formato esperado
    const transformedOrders = orders.map((order) => ({
      id: String(order.id), // Convertir id a string
      dateOrder: formatter.format(new Date(order.createdAt)), // Formatear fecha
      customer: {
        name: "Cliente Genérico", // Puedes cambiar esto si tienes el nombre en la base de datos
        email: order.customerEmail, // El cliente es el email
      },
      products: order.orderProducts.map((orderProduct) => ({
        name: orderProduct.product.product, // Cambiado de "product" a "name"
        quantity: orderProduct.quantity, // Cantidad
        price: orderProduct.product.price, // Precio
        total: orderProduct.quantity * orderProduct.product.price, // Total
      })),
      total: order.totalAmount, // Total del pedido
    }));

    return transformedOrders;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener los pedidos: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al obtener los pedidos`);
    }
  }
};
