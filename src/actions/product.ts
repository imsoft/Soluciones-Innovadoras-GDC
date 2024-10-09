"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Crear un nuevo producto
export const createProduct = async (data: {
  product: string;
  price: number;
  internalSku: string;
  ean: string;
}) => {
  try {
    const { userId } = auth(); // Obtenemos el userId del usuario autenticado en Clerk

    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    // Creamos el producto con el userId de Clerk almacenado directamente
    const product = await db.product.create({
      data: {
        product: data.product,
        price: data.price,
        internalSku: data.internalSku,
        ean: data.ean,
        userId: userId,
      },
    });

    return product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al crear el producto`);
    }
  }
};

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al obtener los productos`);
    }
  }
};

// Obtener un producto por ID
export const getProductById = async (id: number) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al obtener el producto`);
    }
  }
};

// Actualizar un producto por ID
export const updateProduct = async (
  id: number,
  data: { product?: string; price?: number; internalSku?: string, ean?: string }
) => {
  try {
    const updatedProduct = await db.product.update({
      where: { id },
      data,
    });
    return updatedProduct;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al actualizar el producto`);
    }
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (id: number) => {
  try {
    const deletedProduct = await db.product.delete({
      where: { id },
    });
    return deletedProduct;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al eliminar el producto`);
    }
  }
};

export const getProductsByUser = async () => {
  const { userId } = auth(); // Obtenemos el userId del usuario autenticado

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  try {
    const products = await db.product.findMany({
      where: {
        userId: userId, // Filtrar los productos por el userId del usuario autenticado
      },
    });
    return products;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    } else {
      throw new Error(`Error desconocido al obtener los productos`);
    }
  }
};
