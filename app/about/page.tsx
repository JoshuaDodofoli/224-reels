import Nav from "../components/navbar/Nav"
import Wrapper from "../components/Wrapper"

const page = () => {
  return (
    <>
      <Nav />
      <section className='pt-32 font-sans'>
        <Wrapper>
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-10 pt-8 text-grey-500">
           
            <div>
              
              <p className='text-body text-grey-450'>224 Reels is a personal archive of moving images and experiments created in my free time. This space exists to document and showcase moments, places, and the people closest to me. Some of these shots are polished films; others are simply fragments, creative tests, or ideas in motion. Ultimately, this archive grows alongside the work and the life that inspires it.</p>
            </div>
            <div className='bg-red-500 w-full aspect-video' />
            <div>
              
              <p className='text-sm text-grey-400'>Shot on iPhone XR.</p>
            </div>
           
          </div>
        </Wrapper>
      </section>
  
</>
  )
}

export default page