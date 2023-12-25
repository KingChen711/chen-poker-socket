'use client'

import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
// import { startGame } from '@/lib/actions/game'
import { leaveRoom, startGame } from '@/lib/_actions/room'
import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { socket } from '@/services/socket'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@clerk/nextjs'
import { useGame } from '@/hooks/useGame'
import Link from 'next/link'
import NoResult from '@/components/shared/NoResult'
import PreGamePlayers from '@/components/room/PreGamePlayers'

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
          description='This is not the room you are looking for'
          title='Not found the room to show'
          link='/'
          linkTitle='Return Home'
        />
      )
    } else {
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
        // <InGameBoard
        //   room={room}
        //   currentUser={currentUser}
        //   players={players}
        //   playingPerson={playingPerson}
        //   pot={pot}
        //   winner={winner}
        // />
        <>Game bắt đầu</>
      )}
    </>
  )
}

export default RoomDetailPage
