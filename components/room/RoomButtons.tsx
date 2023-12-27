import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { leaveRoom, startGame } from '@/lib/_actions/room'
import { toast } from '../ui/use-toast'
import { useGameStore } from '@/store/game-store'
import Loader from '../shared/Loader'

function RoomButtons() {
  const router = useRouter()
  const gameStore = useGameStore()
  const room = gameStore.room!
  const [isLeavingRoom, setIsLeavingRoom] = useState(false)

  const handleLeaveRoom = async () => {
    setIsLeavingRoom(true)
    try {
      if (gameStore.currentPlayer) {
        await leaveRoom({ clerkId: gameStore.currentPlayer.user.clerkId })
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLeavingRoom(false)
    }
  }

  const handleStartGame = async () => {
    try {
      await startGame({ roomId: room!.id })
    } catch (error: any) {
      if (error?.message) {
        toast({
          variant: 'destructive',
          title: error?.message
        })
      }
    }
  }

  if (!gameStore.currentPlayer) {
    return null
  }

  return (
    <div className='mt-2 flex justify-between gap-6'>
      <div className='text-lg font-medium'>Mã phòng: {room.roomCode}</div>
      <div className='flex gap-3'>
        {room.roomOwner === gameStore.currentPlayer.userId && room.status === 'PRE_GAME' && (
          <Button disabled={isLeavingRoom} onClick={handleStartGame}>
            Bắt đầu
          </Button>
        )}
        <Button disabled={isLeavingRoom} onClick={handleLeaveRoom} variant='secondary'>
          Rời phòng {isLeavingRoom && <Loader className='ml-1' />}
        </Button>
      </div>
    </div>
  )
}

export default RoomButtons
