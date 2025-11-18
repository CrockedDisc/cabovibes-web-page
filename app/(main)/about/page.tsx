import React from "react";
import Header from "@/components/Header";
import MarkdownRenderer from "@/components/MarkdownRenderer";
function page() {
  const ABOUT_US_CONTENT = `More than a company, we are a different way of experiencing Los Cabos.  

Inspired by the sea, the land, and the culture that make this destination truly unique, we create authentic experiences that blend adventure, comfort, and a genuine connection with the local spirit.  

Our fleet is carefully curated: from traditional pangas and sport boats for those seeking an authentic maritime experience, to luxury yachts for navigating with style and comfort.  

We offer sport fishing, sunset cruises, whale watching, ga, personalized tours, and cultural experiences that reveal the soul of the region: the San José Estuary, the Jesuit mission, Plaza Mijares, and the vibrant artistic and nightlife scene of Los Cabos.  

Every detail of our experiences is designed not just to take you on a trip, but to create memories that stay with you.  

At Cabovibes, we believe in a warm, human approach to tourism. We do not seek clients, but partners in adventure—people who want to take a piece of Cabo with them.  

This is Cabovibes: passion, detail, and the true essence of Los Cabos.`;
  return (
    <>
      <Header
        ratio={16 / 9}
        image="/images/about/about-us-header.jpg"
        ariaLabel="About Us"
        title="About Us"
        description=""
      />
      <section className="">
        <h2 className="text-xl sm:text-3xl md:text-5xl font-bold">
          Welcome to Cabovibes
        </h2>
        <div className="text-lg md:text-xl lg:text-2xl">
          <MarkdownRenderer content={ABOUT_US_CONTENT} />
        </div>
      </section>
    </>
  );
}

export default page;
