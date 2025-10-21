import React from "react";
import Image from "next/image";
import Header from "@/components/Header";

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
    </>
  );
}

export default page;
