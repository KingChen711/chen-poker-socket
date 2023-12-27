import React from 'react'
import bgImage from '@/public/assets/images/bg-auth.jpeg'
import Image from 'next/image'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props) {
  return (
    <main className='relative flex min-h-screen w-full items-center justify-center'>
      <Image alt='bg-auth' src={bgImage} className='absolute inset-0 -z-10' fill priority />
      <div className='absolute inset-0 bg-black/70' />
      {children}
    </main>
  )
}

export default Layout
