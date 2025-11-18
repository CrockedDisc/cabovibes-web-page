interface ReservationDetailsProps {
  name: string;
  reservationId: number;
  total: number;
}

export default function ReservationDetails({
  name,
  reservationId,
  total,
}: ReservationDetailsProps) {
  return (
    <div style={{ marginBottom: "25px", lineHeight: "1.6", fontSize: "15px" }}>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Booking ID:</strong> #{reservationId}</p>
      <p><strong>Total:</strong> ${total} USD</p>
    </div>
  );
}
