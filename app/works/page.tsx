import Wrapper from "../components/Wrapper"
import Work from "./(components)/Work"

const page = () => {
  return (
    <section className="my-24 font-sans h-full">
      <Wrapper>
        <div className="text-background flex gap-1 md:gap-2 text-body font-medium">
          <span className="hover:text-grey-400 duration-300 cursor-pointer">All</span>/
          <span className="hover:text-grey-400 duration-300 cursor-pointer">Reels</span>/
          <span className="hover:text-grey-400 duration-300 cursor-pointer">Snippets</span>
        </div>

        <div className="py-12">
          <Work />
        </div>

      </Wrapper>
    </section>
  )
}

export default page