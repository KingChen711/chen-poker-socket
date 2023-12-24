import Header from '@/components/shared/Header'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  return (
    <main className='relative'>
      <Header />
      <div className='mx-auto w-9/12'>{children}</div>
      <Toaster />
    </main>
  )
}

export default Layout
