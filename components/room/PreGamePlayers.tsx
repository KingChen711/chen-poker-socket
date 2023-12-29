import { useGameStore } from '@/store/game-store'
import Image from 'next/image'
import React from 'react'

function PreGamePlayers() {
  const gameStore = useGameStore()
  const room = gameStore.room!

  if (room.status !== 'PRE_GAME') {
    return null
  }

  return (
    <div className='mt-4 flex flex-wrap gap-8'>
      {gameStore.players.map((p) => {
        return (
          <div key={p.userId} className='flex items-center gap-2'>
            <Image src={p.user.picture} alt='player avatar' width={32} height={32} className='rounded-full' />
            <div className='font-medium'>
              {p.user.username}
              {room.roomOwner === p.userId && "(room's owner)"}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PreGamePlayers
