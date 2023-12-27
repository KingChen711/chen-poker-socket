'use client'

import { useLoadingScreenStore } from '@/store/loading-screen.store'
import React from 'react'
import Loader from './Loader'

function LoadingScreen() {
  const { isShowing, loadingText } = useLoadingScreenStore()
  if (!isShowing) {
    return null
  }

  return (
    <div className='absolute inset-0 z-[999] flex items-center justify-center bg-black/80'>
      <div className='flex items-center gap-4'>
        <Loader className='h-12 w-12 text-primary' />
        <div className='text-xl font-medium'>{loadingText}</div>
      </div>
    </div>
  )
}

export default LoadingScreen
