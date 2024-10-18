import * as React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text } from '@react-email/components';

const WelcomeEmail = () => (
  <Html>
    <Head />
    <Preview>Bienvenido a nuestra plataforma</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>¡Bienvenido!</Heading>
        <Text>Gracias por unirte a nuestra plataforma.</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
};

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
};
