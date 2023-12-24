'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast } from '../ui/use-toast'
import { createRoom, getCurrentRoom, joinRoom } from '@/lib/actions/room'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import Image from 'next/image'

function HomeButtons() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const user = useCurrentUser()

  const handleCreateNewRoom = async () => {
    if (!user) {
      return
    }
    try {
      const response = await createRoom({ userId: user.id })
      router.push(`/rooms/${response?.roomId}`)
    } catch (error) {
      console.log(error)

      // @ts-ignore
      if (error.message === 'You are already in a room!') {
        toast({
          variant: 'destructive',
          title: 'Bạn đang ở trong một phòng khác!',
          description: 'Hãy vào phòng hiện tại đó, và rời khỏi phòng nếu bạn muốn tạo phòng mới'
        })
      }
    }
  }

  const handleJoinRoom = async () => {
    if (!user || !roomCode) {
      return
    }

    try {
      const roomId = await joinRoom({ roomCode, userId: user.id })
      router.push(`/rooms/${roomId}`)
    } catch (error) {
      // @ts-ignore
      if (error.message === 'Not found your current room!') {
        toast({
          variant: 'destructive',
          title: 'Không tìm thấy phòng hiện tại của bạn!',
          description: 'Hãy tham gia hoặc tạo phòng mới'
        })
      }
      // @ts-ignore
      if (error.message === 'You are already in a room!') {
        toast({
          variant: 'destructive',
          title: 'Bạn đang ở trong một phòng khác!',
          description: 'Hãy vào phòng hiện tại đó, và rời khỏi phòng nếu bạn muốn tạo phòng mới'
        })
      }
      // @ts-ignore
      if (error.message === 'Not found room!') {
        toast({
          variant: 'destructive',
          title: 'Không tìm thấy phòng!',
          description: 'Hãy kiểm tra lại mã phòng của bạn'
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
