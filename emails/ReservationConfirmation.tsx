import EmailLayout from "@/emails/components/EmailLayout";
import EmailHeader from "@/emails/components/EmailHeader";
import EmailFooter from "@/emails/components/EmailFooter";
import ReservationDetails from "@/emails/components/ReservationDetails";
import ReservationItems from "@/emails/components/ReservationItems";

interface Props {
  name: string;
  reservationId: number;
  total: number;
  items: {
    title: string;
    people: number;
    date: string;
    time: string;
  }[];
}

export default function ReservationConfirmation({
  name,
  reservationId,
  total,
  items
}: Props) {
  return (
    <EmailLayout>
      <EmailHeader />

      <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
        Hello <strong>{name}</strong>, <br /><br />
        Your reservation has been confirmed successfully!  
        Here's a summary of your booked experience:
      </p>

      <ReservationDetails
        name={name}
        reservationId={reservationId}
        total={total}
      />

      <ReservationItems items={items} />

      <p style={{ marginTop: "25px", fontSize: "14px" }}>
        If you need to modify or check your reservation, we're here to help.
      </p>

      <EmailFooter />
    </EmailLayout>
  );
}
