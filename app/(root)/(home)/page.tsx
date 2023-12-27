import HomeButtons from '@/components/home/HomeButtons'
import Image from 'next/image'
import bannerImage from '@/public/assets/images/banner-2.png'
import { auth } from '@clerk/nextjs'

function Home() {
  const { userId: clerkId } = auth()
  return (
    <main className='grid min-h-screen grid-cols-12 pb-6 pt-24'>
      <div className='col-span-12 flex flex-col items-center justify-center py-6 lg:col-span-6 lg:items-start'>
        <div className='mb-6 max-w-lg text-pretty text-center text-3xl lg:text-start lg:text-5xl'>
          Play Poker with Friends. Now Free for Everyone.
        </div>

        <p className='mb-16 max-w-lg text-pretty text-center text-sm text-muted-foreground lg:text-start lg:text-lg'>
          Invite your friends, deal the cards, and experience the excitement of poker night anytime, anywhere. No costs,
          just pure fun.
        </p>

        <HomeButtons clerkId={clerkId!} />
      </div>

      <div className='col-span-12 flex items-center justify-center p-6 lg:col-span-6'>
        <div className='relative aspect-square w-[95%]'>
          <Image fill src={bannerImage} priority alt='banner' />
        </div>
      </div>
    </main>
  )
}

export default Home
