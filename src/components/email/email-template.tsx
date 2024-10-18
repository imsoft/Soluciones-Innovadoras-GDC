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
      <div style={bodyStyle}>
        <div style={containerStyle}>
          <div style={sectionStyle}>
            <h1 style={headingStyle}>¡Gracias por tu compra!</h1>
            <p style={subheadingStyle}>Te enviamos un resumen de tu pedido.</p>
          </div>

          <div style={sectionStyle}>
            <ul style={listStyle}>
              {products.map((product, index) => (
                <li key={index} style={listItemStyle}>
                  <span style={productTextStyle}>
                    {product.product} - {product.quantity} pcs
                  </span>
                  <span style={amountTextStyle}>${product.amount}</span>
                </li>
              ))}
            </ul>

            <div style={totalStyle}>
              <span style={totalLabelStyle}>Total:</span>
              <span style={totalAmountStyle}>${totalAmount}</span>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={footerTextStyle}>
              Si tienes alguna duda, no dudes en contactarnos.
            </p>
          </div>

          <div style={sectionStyle}>
            <p style={signatureLabelStyle}>Atentamente,</p>
            <p style={signatureCompanyStyle}>Soluciones Innovadoras GDC</p>
            <p style={contactTextStyle}>tickets@solucionesinnovadorasgdc.com</p>
            <p style={contactTextStyle}>+52 81 1038 6975</p>
          </div>
        </div>
      </div>
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
