import HomeButtons from '@/components/home/HomeButtons'
import Image from 'next/image'

function Home() {
  return (
    <main className='grid min-h-screen grid-cols-12 pb-6 pt-24'>
      <div className='col-span-12 flex flex-col items-center justify-center py-6 lg:col-span-6 lg:items-start'>
        <div className='mb-6 max-w-lg text-pretty text-center text-3xl lg:text-start lg:text-5xl'>
          Play Poker games with your friends completely for free
        </div>

        <p className='text-muted-foreground mb-16 max-w-lg text-pretty text-center text-sm lg:text-start lg:text-lg'>
          Shuffle the cards and deal in for an exciting round of poker with your friends absolutely free! Immerse
          yourself in the thrill of the game without any cost.
        </p>

        <HomeButtons />
      </div>

      <div className='col-span-12 flex items-center justify-center p-6 lg:col-span-6'>
        <div className='relative aspect-square w-[95%]'>
          <Image fill src='/assets/images/banner.png' alt='banner' />
        </div>
      </div>
    </main>
  )
}

export default Home
