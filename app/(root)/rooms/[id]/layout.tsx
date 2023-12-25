import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  return (
    <div className='mx-auto flex min-h-screen flex-col pt-24'>
      <div className='fixed inset-0 -z-50 bg-[url("/assets/images/bg-room.jpeg")] bg-cover bg-no-repeat' />
      {children}
    </div>
  )
}

export default Layout
