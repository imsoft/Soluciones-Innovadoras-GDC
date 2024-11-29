interface EmailTemplateProps {
  products: Array<{ product: string; quantity: number; amount: number }>;
  totalAmount: number;
  businessName: string; // Nombre de la Razón Social
  rfc: string; // RFC
  orderNumber: string; // Número de orden o folio
  billingDetails: string; // Datos de página web o correo para facturar
}

export const EmailTemplate = ({
  products,
  totalAmount,
  businessName,
  rfc,
  orderNumber,
  billingDetails,
}: EmailTemplateProps) => {
  return (
    <>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#ffffff",
          padding: "0",
          margin: "0",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            padding: "20px",
            maxWidth: "600px",
            backgroundColor: "#ffffff",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ¡Gracias por tu compra!
            </h1>
            <p
              style={{
                fontSize: "18px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Te enviamos un resumen de tu pedido.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              <strong>Nombre de la Razón Social:</strong> {businessName}
            </p>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              <strong>RFC:</strong> {rfc}
            </p>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              <strong>Número de orden o folio:</strong> {orderNumber}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
              {products.map((product, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    fontSize: "16px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>
                    {product.product} - {product.quantity} pcs
                  </span>
                  <span style={{ fontSize: "16px" }}>${product.amount}</span>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
                marginTop: "20px",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                Total:
              </span>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                ${totalAmount}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                textAlign: "center",
              }}
            >
              Si tienes alguna duda, no dudes en contactarnos.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              <strong>Datos para facturar:</strong> {billingDetails}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Atentamente,
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Cloud Store
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                textAlign: "center",
              }}
            >
              tickets@cloudstore.mx
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
