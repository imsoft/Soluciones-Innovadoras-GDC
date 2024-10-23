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

  // Obtener detalles de los productos desde la base de datos
  const productDetails = await db.product.findMany({
    where: {
      id: {
        in: data.products.map((product) => product.productId),
      },
    },
  });

  if (productDetails.length !== data.products.length) {
    throw new Error(
      "Algunos productos no fueron encontrados en la base de datos."
    );
  }

  // Creamos el pedido utilizando el userId proporcionado por Clerk
  const order = await db.order.create({
    data: {
      userId, // Almacenamos el userId directamente
      customerEmail: data.customerEmail,
      totalAmount: data.totalAmount,
      orderRappiId: "rappi-order-id", // Reemplaza con el valor real
      storeId: "store-id", // Reemplaza con el valor real
      storeRappiId: "store-rappi-id", // Reemplaza con el valor real
      netValue: data.totalAmount * 0.8, // Suponiendo 80% del total como valor neto
      taxes: data.totalAmount * 0.2, // Ejemplo: 20% del total son impuestos
      totalWithDiscount: data.totalAmount, // Cambia esto si tienes descuentos
      customerName: "Cliente Genérico", // Si tienes el nombre real, úsalo
      customerPhone: "5555555555", // Cambia esto por el valor real
      paymentMethod: "credit_card", // Cambia esto por el método real
      customerDocument: "123456789", // Cambia esto por el documento del cliente
      customerDocumentType: 1, // Ejemplo: 1 podría ser un RFC o similar
      customerAddress: "Dirección del cliente", // Dirección del cliente
      country: "MX", // País del cliente
      city: "Ciudad de México", // Ciudad del cliente
      statusId: "10", // Estado del pedido, cambiar según tu lógica
      statusName: "FINISHED", // Cambia según el estado de tu pedido

      orderProducts: {
        create: data.products.map((product) => {
          const productDetail = productDetails.find(
            (p) => p.id === product.productId
          );
          if (!productDetail) {
            throw new Error(
              `Producto con ID ${product.productId} no encontrado.`
            );
          }

          return {
            productId: product.productId,
            quantity: product.quantity,
            price: productDetail.price, // Usamos el precio desde la base de datos
            taxes: 0, // Si no tienes impuestos, déjalo en 0
            priceWithDiscount: productDetail.price, // Suponemos que no hay descuento
          };
        }),
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
    // Obtener las órdenes y sus productos desde la base de datos
    const orders = await db.order.findMany({
      include: {
        orderProducts: {
          include: {
            product: true, // Incluir detalles del producto asociado
          },
        },
      },
    });

    // Formateador de fecha en el formato deseado
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
        name: order.customerName || "Cliente Genérico", // Usa el nombre del cliente si está disponible
        email: order.customerEmail, // El email del cliente
      },
      products: order.orderProducts.map((orderProduct) => ({
        name: orderProduct.product.product, // Nombre del producto
        quantity: orderProduct.quantity, // Cantidad pedida
        price: orderProduct.product.price, // Precio del producto
        total: orderProduct.quantity * orderProduct.product.price, // Total del producto en el pedido
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
