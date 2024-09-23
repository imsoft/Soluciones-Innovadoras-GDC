import { NextResponse, NextRequest } from "next/server";
import { mailOptions, transporter } from "@/email";

interface Product {
  product: string;
  quantity: number;
  amount: number;
}

export async function POST(request: NextRequest) {
  const { recipientEmail, productList, totalAmount } = await request.json();

  try {
    const productListHtml = productList
      .map(
        (product: Product) => `
        <tr>
          <td>${product.product}</td>
          <td>${product.quantity} pcs</td>
          <td>${product.amount}</td>
        </tr>`
      )
      .join("");

    const htmlContent = `
      <h2>Nuevo pedido</h2>
      <p>Estimado cliente, aquí está el resumen de su pedido:</p>
      <table border="1">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${productListHtml}
        </tbody>
      </table>
      <h3>Total del pedido: ${totalAmount}</h3>
    `;

    await transporter.sendMail({
      ...mailOptions,
      to: recipientEmail,
      subject: "Resumen de su pedido",
      html: htmlContent,
    });

    return NextResponse.json({ message: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: "Unknown error" }, { status: 400 });
    }
  }
}
