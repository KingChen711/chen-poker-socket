import { useGame } from '@/hooks/useGame'
import { Player } from '@/types'
import Image from 'next/image'
import React from 'react'

type Props = {
  roomId: string
}

function PreGamePlayers({ roomId }: Props) {
  const { room, players } = useGame(roomId)
  return (
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
  )
}

export default PreGamePlayers
