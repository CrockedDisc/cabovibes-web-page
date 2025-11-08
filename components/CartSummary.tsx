import { Item, ItemContent, ItemTitle } from "./ui/item";
import type { ReservationItem as ReservationItemType } from "@/lib/stores/reservation-store";

function CartSummary({ items }: { items: ReservationItemType[] }) {
  return (
    <div className="flex flex-col gap-2 w-full border rounded-md">
      <Item className="h-full">
        <ItemContent className="flex flex-col justify-between h-full">
          <ItemTitle>Summary</ItemTitle>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between">
              <span>Subtotal</span>
              <span>
                ${items.reduce((total, item) => total + item.basePrice, 0)}
              </span>
            </div>
            <div className="flex flex-row justify-between text-base font-semibold">
              <span>Total</span>
              <span>
                ${items.reduce((total, item) => total + item.basePrice, 0)}
              </span>
            </div>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}

export default CartSummary;
