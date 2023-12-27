'use client'

import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
import { leaveRoom, startGame } from '@/lib/_actions/room'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { socket } from '@/services/socket'
import { useToast } from '@/components/ui/use-toast'
import { useGame } from '@/hooks/useGame'
import NoResult from '@/components/shared/NoResult'
import PreGamePlayers from '@/components/room/PreGamePlayers'
import InGameBoard from '@/components/room/InGameBoard'

type Props = {
  params: {
    id: string
  }
}

function RoomDetailPage({ params }: Props) {
  const roomId = params.id
  const router = useRouter()
  const { room, currentPlayer, isLoading } = useGame(roomId)
  const [isLeavingRoom, setIsLeavingRoom] = useState(false)
  const { toast } = useToast()

  const handleLeaveRoom = async () => {
    setIsLeavingRoom(true)
    try {
      if (currentPlayer) {
        await leaveRoom({ clerkId: currentPlayer.user.clerkId })
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
      await startGame({ roomId })
    } catch (error: any) {
      if (error?.message) {
        toast({
          variant: 'destructive',
          title: error?.message
        })
      }
    }
  }

  useEffect(() => {
    const onRoomMessage = async (message: string) => {
      toast({
        title: message
      })
    }

    socket.on('room-message', onRoomMessage)

    if (currentPlayer) {
      socket.emit('join-room', { roomId, username: currentPlayer?.user?.username })
    }

    return () => {
      socket.off('room-message', onRoomMessage)
    }
  }, [currentPlayer, roomId, toast])

  useEffect(() => {
    const onBeforeunload = () => {
      if (currentPlayer) {
        socket.emit('leave-room', {
          roomId,
          username: currentPlayer.user.username,
          clerkId: currentPlayer.user.clerkId
        })
      }
    }

    window.addEventListener('beforeunload', onBeforeunload)

    return () => {
      window.removeEventListener('beforeunload', onBeforeunload)
    }
  }, [currentPlayer, roomId])

  if (!room) {
    if (!isLoading) {
      return (
        <NoResult
          title='404 - No Poker Room Available – Time for a New Deal!'
          description="🔍 Seems all the tables are full house right now. Don't fold just yet! ✨ Create Your Own Room and invite friends to play. Whether you're a high roller or a casual player, we've got a seat with your name on it. 🃏🍀"
          link='/'
          linkTitle='Return Home'
        />
      )
    } else {
      // TODO: display finding room and other loading of buttons
      return null
    }
  }

  return (
    <>
      <div className='mt-2 flex justify-between gap-6'>
        <div className='text-lg font-medium'>Mã phòng: {room.roomCode}</div>
        <div className='flex gap-3'>
          {room.roomOwner === currentPlayer?.userId && room.status === 'PRE_GAME' && (
            <Button disabled={isLeavingRoom} onClick={handleStartGame}>
              Bắt đầu
            </Button>
          )}
          <Button disabled={isLeavingRoom} onClick={handleLeaveRoom} variant='secondary'>
            Rời phòng {isLeavingRoom && <Loader />}
          </Button>
        </div>
      </div>

      {room.status === 'PRE_GAME' ? (
        <PreGamePlayers roomId={roomId} />
      ) : (
        <InGameBoard gameObj={room.gameObj} roomId={roomId} />
      )}
    </>
  )
}

export default RoomDetailPage
