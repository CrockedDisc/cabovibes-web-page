import React from 'react'
import Header from '@/components/Header'
import MarkdownRenderer from '@/components/MarkdownRenderer'
function page() {
  return (
    <>
      <Header
        ratio={16 / 9}
        image="/images/what-are-you-interested-in/sunset-ballena.jpg"
        ariaLabel="Sunset & Ballena"
        title="Sunset & Ballena"
        description="..."
      />
      <section>
        <MarkdownRenderer content={""} />
      </section>
    </>
  )
}

export default page