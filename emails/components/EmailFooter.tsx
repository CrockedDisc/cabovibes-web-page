export default function EmailFooter() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
        fontSize: "13px",
        color: "#8b8b8b",
        paddingTop: "20px",
        borderTop: "1px solid #e6e6e6",
      }}
    >
      Thank you for booking with <strong>CaboVibes</strong> 🌴  
      <br />
      Need help? Write to us:{" "}
      <a
        href="mailto:contact@cabovibes.tours"
        style={{ color: "#0B3C5D", textDecoration: "none" }}
      >
        contact@cabovibes.tours
      </a>
      <br />
      <br />
      <span style={{ fontSize: "11px" }}>
        © {new Date().getFullYear()} Cabovibes. All rights reserved.
      </span>
    </div>
  );
}
