import { Img } from "@react-email/components";

export default function EmailHeader() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "25px 0 10px 0",
        borderBottom: "1px solid #e6e6e6",
        marginBottom: "25px",
      }}
    >
      <Img
        src="https://vsdvaupohzzibwlvubnq.supabase.co/storage/v1/object/public/Cabovibes/logo/logo_barco-removebg-preview.png"
        width="150"
        alt="Cabovibes"
        style={{
          margin: "0 auto",
          display: "block",
        }}
      />

      <h2
        style={{
          fontSize: "22px",
          color: "#0B3C5D",
          marginTop: "15px",
          marginBottom: "0",
          fontWeight: "600",
        }}
      >
        Booking Confirmed!
      </h2>
    </div>
  );
}
