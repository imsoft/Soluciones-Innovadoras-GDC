import { EmailTemplate } from "@/components/email/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, products, totalAmount } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Soluciones Innovadoras GDC <tickets@solucionesinnovadorasgdc.com>",
      to: [email],
      subject: "Detalles de tu pedido",
      react: EmailTemplate({ products, totalAmount }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}