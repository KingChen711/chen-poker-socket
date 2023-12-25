'use client'

import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
// import { startGame } from '@/lib/actions/game'
import { leaveRoom } from '@/lib/_actions/room'
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

type Props = {
  params: {
    id: string
  }
}

function RoomDetailPage({ params }: Props) {
  const roomId = params.id
  const router = useRouter()
  const { room, players, playingPerson, pot, currentPlayer, winner, isLoading } = useGame(roomId)
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

  // const handleStartGame = async () => {
  //   try {
  //     await startGame({ roomId: params.id })
  //   } catch (error) {
  //     // @ts-ignore
  //     if (error.message === 'At least 2 players to start a game!') {
  //       toast({
  //         variant: 'destructive',
  //         title: 'Số người chơi quá ít!',
  //         description: 'Cần ít nhất 2 người chơi để bắt đầu, hãy chia sẽ mã phòng cho bạn bè của bạn'
  //       })
  //     }
  //     console.log(error)
  //   }
  // }

  // if (!room) {
  //   if (isLoading) {
  //     return <div className='inset-0 mt-96 flex items-center justify-center text-3xl'>Is loading</div>
  //   } else {
  //     return <div className='inset-0 mt-96 flex items-center justify-center text-3xl'>Not found the room</div>
  //   }
  // }

  // useEffect(() => {
  //   console.log({ currentUser })
  // }, [currentUser])

  useEffect(() => {
    const onRoomMessage = async (message: string) => {
      console.log({ message })

      toast({
        title: message
      })
    }

    socket.on('room-message', onRoomMessage)

    if (currentPlayer) {
      socket.emit('join-room', { roomId: roomId, username: currentPlayer?.user?.username })
    }

    console.log(currentPlayer)

    return () => {
      socket.off('room-message', onRoomMessage)
    }
  }, [currentPlayer])

  useEffect(() => {
    const onBeforeunload = () => {
      socket.emit('leave-room', {
        roomId: roomId,
        username: currentPlayer?.user.username,
        clerkId: currentPlayer?.user.clerkId
      })
    }

    window.addEventListener('beforeunload', onBeforeunload)

    return () => {
      window.removeEventListener('beforeunload', onBeforeunload)
    }
  }, [currentPlayer])

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
            <Button disabled={isLeavingRoom}>Bắt đầu</Button>
          )}
          <Button disabled={isLeavingRoom} onClick={handleLeaveRoom} variant='secondary'>
            Rời phòng {isLeavingRoom && <Loader />}
          </Button>
        </div>
      </div>

      {room.status === 'PRE_GAME' ? (
        <div className='mt-4 flex flex-wrap gap-8'>
          {players.map((p) => {
            return (
              <div key={p.userId} className='flex items-center gap-2'>
                <Image src={p.user.picture} alt='player avatar' width={32} height={32} className='rounded-full' />
                <div className='font-medium'>
                  {p.user.username}
                  {room?.roomOwner === p.userId && '(chủ phòng)'}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // <InGameBoard
        //   room={room}
        //   currentUser={currentUser}
        //   players={players}
        //   playingPerson={playingPerson}
        //   pot={pot}
        //   winner={winner}
        // />
        <></>
      )}
    </>
  )
}

export default RoomDetailPage
