"use server";

import db from "@/lib/db";

const createOrder = async (data: {
  userId: string;
  customerEmail: string;
  products: { productId: number; quantity: number }[];
  totalAmount: number;
}) => {
  const order = await db.order.create({
    data: {
      userId: data.userId,
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
          // Debes incluir 'orderProducts', que es la tabla intermedia
          include: {
            product: true, // Incluir los detalles del producto desde 'OrderProduct'
          },
        },
      },
    });
    return orders;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener los pedidos: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al obtener los pedidos`);
    }
  }
};
