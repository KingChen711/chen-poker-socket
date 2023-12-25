'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { createRoom, joinRoom } from '@/lib/_actions/room'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { useToast } from '../ui/use-toast'

function HomeButtons() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const { userId: clerkId } = useAuth()
  const { toast } = useToast()

  const handleCreateNewRoom = async () => {
    if (!clerkId) {
      return
    }

    try {
      const room = await createRoom({ clerkId })
      router.push(`/rooms/${room.id}`)
    } catch (error: any) {
      if (error?.message) {
        toast({
          variant: 'destructive',
          title: error.message
        })
      }
    }
  }

  const handleJoinRoom = async () => {
    if (!clerkId || !roomCode) {
      return
    }

    try {
      const room = await joinRoom({ roomCode, clerkId })
      router.push(`/rooms/${room.id}`)
    } catch (error: any) {
      if (error.message) {
        toast({
          variant: 'destructive',
          title: error.message
        })
      }
    }
  }

  return (
    <div className='mb-4 flex flex-wrap gap-4'>
      <Button size='lg' onClick={handleCreateNewRoom}>
        <Image className='mr-2 invert' alt='room' src='/assets/icons/room.svg' width={24} height={24} />
        Create new room
      </Button>

      <div className='flex items-center'>
        <div className='flex h-full items-center rounded-md border px-4'>
          <Image className='mr-2 invert' alt='room' src='/assets/icons/keyboard.svg' width={24} height={24} />
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className='h-full border-none bg-transparent py-0 outline-none'
            placeholder='Enter room code here...'
          />
        </div>
        <Button className='text-base' onClick={handleJoinRoom} disabled={!roomCode} variant='link'>
          Join
        </Button>
      </div>
    </div>
  )
}

export default HomeButtons
