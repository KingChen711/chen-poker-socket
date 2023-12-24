'use client'

import InGameBoard from '@/components/room/InGameBoard'
import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useRoom } from '@/hooks/useRoom'
import { startGame } from '@/lib/actions/game'
import { leaveRoom } from '@/lib/_actions/room'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'

type Props = {
  params: {
    id: string
  }
}

function RoomDetailPage({ params }: Props) {
  const router = useRouter()
  // const { room, players, playingPerson, pot, currentUser, winner, isLoading } = useRoom(params.id)
  const [isLeavingRoom, setIsLeavingRoom] = useState(false)
  const currentUser = useCurrentUser()

  const handleLeaveRoom = useCallback(async () => {
    setIsLeavingRoom(true)
    try {
      if (currentUser) {
        await leaveRoom({ clerkId: currentUser.clerkId })
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLeavingRoom(false)
    }
  }, [router, currentUser])

  const handleStartGame = async () => {
    try {
      await startGame({ roomId: params.id })
    } catch (error) {
      // @ts-ignore
      if (error.message === 'At least 2 players to start a game!') {
        toast({
          variant: 'destructive',
          title: 'Số người chơi quá ít!',
          description: 'Cần ít nhất 2 người chơi để bắt đầu, hãy chia sẽ mã phòng cho bạn bè của bạn'
        })
      }
      console.log(error)
    }
  }

  // if (!room) {
  //   if (isLoading) {
  //     return <div className='inset-0 mt-96 flex items-center justify-center text-3xl'>Is loading</div>
  //   } else {
  //     return <div className='inset-0 mt-96 flex items-center justify-center text-3xl'>Not found the room</div>
  //   }
  // }

  return (
    <div className='mx-auto flex min-h-screen flex-col pt-24'>
      <div className='fixed inset-0 -z-50 bg-[url("/assets/images/bg-room.jpeg")] bg-cover bg-no-repeat' />
      <div className='mt-2 flex justify-between gap-6'>
        <div>
          <div className='text-lg font-medium'>Mã phòng: xxxx</div>
        </div>

        <div className='flex gap-3'>
          {/* {room.roomOwner === currentUser?.userId && room.status === 'PRE_GAME' && (
            <Button onClick={handleStartGame}>Bắt đầu {isLeavingRoom && <Loader />}</Button>
          )} */}
          {/* {room.status === 'PRE_GAME' && ( */}
          <Button disabled={isLeavingRoom} onClick={handleLeaveRoom} variant='secondary'>
            Rời phòng {isLeavingRoom && <Loader />}
          </Button>
          {/* )} */}
        </div>
      </div>

      {/* {room.status === 'PRE_GAME' ? (
        <div className='mt-4 flex flex-wrap gap-8'>
          {players.map((p) => {
            if (!p.user) return null
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
        <InGameBoard
          room={room}
          currentUser={currentUser}
          players={players}
          playingPerson={playingPerson}
          pot={pot}
          winner={winner}
        />
        <></>
      )} */}
    </div>
  )
}

export default RoomDetailPage
