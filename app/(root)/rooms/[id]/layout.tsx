import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  return (
    <div className='mx-auto flex min-h-screen flex-col pt-24'>
      <div
        style={{
          backgroundImage: 'url("/assets/images/bg-room-2.jpeg")'
        }}
        className='fixed inset-0 -z-50'
      />
      {children}
    </div>
  )
}

export default Layout
