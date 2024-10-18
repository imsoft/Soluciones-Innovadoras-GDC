import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  products: Array<{ product: string; quantity: number; amount: number }>;
  totalAmount: number;
}

export const EmailTemplate = ({
  products,
  totalAmount,
}: EmailTemplateProps) => {
  return (
    <>
      <Html lang="es">
        <Head>
          <title>Resumen de tu pedido</title>
        </Head>
        <Preview>Resumen de tu pedido en Soluciones Innovadoras GDC</Preview>
        <Body style={bodyStyle}>
          <Container style={containerStyle}>
            <Section style={sectionStyle}>
              <Text style={headingStyle}>¡Gracias por tu compra!</Text>
              <Text style={subheadingStyle}>
                Te enviamos un resumen de tu pedido.
              </Text>
            </Section>

            <Section style={sectionStyle}>
              <ul style={listStyle}>
                {products.map((product, index) => (
                  <li key={index} style={listItemStyle}>
                    <Text style={productTextStyle}>
                      {product.product} - {product.quantity} pcs
                    </Text>
                    <Text style={amountTextStyle}>${product.amount}</Text>
                  </li>
                ))}
              </ul>

              <div style={totalStyle}>
                <Text style={totalLabelStyle}>Total:</Text>
                <Text style={totalAmountStyle}>${totalAmount}</Text>
              </div>
            </Section>

            <Section style={sectionStyle}>
              <Text style={footerTextStyle}>
                Si tienes alguna duda, no dudes en contactarnos.
              </Text>
            </Section>

            {/* Firma de correo */}
            <Section style={sectionStyle}>
              <Text style={signatureLabelStyle}>Atentamente,</Text>
              <Text style={signatureCompanyStyle}>
                Soluciones Innovadoras GDC
              </Text>
              <Text style={contactTextStyle}>
                tickets@solucionesinnovadorasgdc.com
              </Text>
              <Text style={contactTextStyle}>+52 81 1038 6975</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </>
  );
};

const bodyStyle = {
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#ffffff",
  padding: "0",
  margin: "0",
};

const containerStyle = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
};

const sectionStyle = {
  marginBottom: "20px",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
};

const subheadingStyle = {
  fontSize: "18px",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const listStyle = {
  listStyleType: "none" as const,
  padding: "0",
  margin: "0",
};

const listItemStyle = {
  display: "flex",
  justifyContent: "space-between" as const,
  marginBottom: "10px",
  fontSize: "16px",
};

const productTextStyle = {
  fontSize: "16px",
};

const amountTextStyle = {
  fontSize: "16px",
};

const totalStyle = {
  display: "flex",
  justifyContent: "space-between" as const,
  borderTop: "1px solid #ddd",
  paddingTop: "10px",
  marginTop: "20px",
};

const totalLabelStyle = {
  fontSize: "18px",
  fontWeight: "bold" as const,
};

const totalAmountStyle = {
  fontSize: "18px",
  fontWeight: "bold" as const,
};

const footerTextStyle = {
  fontSize: "14px",
  color: "#555",
  textAlign: "center" as const,
};

const signatureLabelStyle = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
};

const signatureCompanyStyle = {
  fontSize: "16px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
};

const contactTextStyle = {
  fontSize: "14px",
  color: "#555",
  textAlign: "center" as const,
};
