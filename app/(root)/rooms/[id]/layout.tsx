import React from 'react'
import bgImage from '@/public/assets/images/bg-room.jpeg'
import Image from 'next/image'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  return (
    <div className='mx-auto flex min-h-screen flex-col pt-24'>
      <Image src={bgImage} className='fixed inset-0 -z-50' fill alt='bg-room' priority />
      {children}
    </div>
  )
}

export default Layout
