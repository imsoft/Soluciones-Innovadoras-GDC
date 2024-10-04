"use server";

import db from "@/lib/db";

// Crear un nuevo producto
export const createProduct = async (data: {
  product: string;
  price: number;
  internalSku: string;
  userId: string;
}) => {
  try {
    const product = await db.product.create({
      data: {
        product: data.product,
        price: data.price,
        internalSku: data.internalSku,
        createdBy: {
          connect: { id: data.userId }, // Conectamos el producto con el usuario que lo creó
        },
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
  data: { product?: string; price?: number; internalSku?: string }
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
