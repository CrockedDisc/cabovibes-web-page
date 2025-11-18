interface Item {
  title: string;
  people: number;
  date: string;
  time: string;
}

export default function ReservationItems({ items }: { items: Item[] }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h3
        style={{
          fontSize: "18px",
          marginBottom: "10px",
          color: "#0B3C5D",
        }}
      >
        Booked Items
      </h3>

      {items.map((i, index) => (
        <div
          key={index}
          style={{
            marginBottom: "12px",
            padding: "12px",
            border: "1px solid #e6e6e6",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
          }}
        >
          <p><strong>{i.title}</strong></p>
          <p><strong>Pax:</strong> {i.people}</p>
          <p><strong>Date:</strong> {i.date}</p>
          <p><strong>Time:</strong> {i.time}</p>
        </div>
      ))}
    </div>
  );
}