import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { ItemGroup, Item} from "@/components/ui/item";

function page() {
  return (
    <>
      <Header 
      ratio={16 / 9}
      image="/images/what-are-you-interested-in/sport-fishing.jpg"
      ariaLabel="Sport fishing"
      title="Sport Fishing"
      description="..."
      />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ItemGroup>
            
        </ItemGroup>
      </section>
    </>
  );
}

export default page;
