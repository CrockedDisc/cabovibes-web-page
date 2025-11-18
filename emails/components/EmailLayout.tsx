import { Html, Body, Container } from "@react-email/components";
import React from "react";

export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Body
        style={{
          backgroundColor: "#f3f4f6",
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "620px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
          }}
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
}
