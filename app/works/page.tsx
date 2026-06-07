'use client'
import Wrapper from "../components/Wrapper"
import Work from "./(components)/Work"

const page = () => {
  return (
    <section className="my-24 font-sans h-full">
      <Wrapper>

        <div className="py-12">
          <Work />
        </div>

      </Wrapper>
    </section>
  )
}

export default page