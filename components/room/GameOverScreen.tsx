import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { useGameStore } from '@/store/game-store'
import { leaveRoom } from '@/lib/_actions/room'
import Loader from '../shared/Loader'

function GameOverScreen() {
  const router = useRouter()
  const { winner, room, currentPlayer } = useGameStore()
  const [isLeaving, setIsLeaving] = useState(false)

  if (room?.status !== 'GAME_OVER') {
    return null
  }

  // The table is terminal server-side (no next match). Leaving frees the seat / room.
  const handleBackHome = async () => {
    setIsLeaving(true)
    try {
      if (currentPlayer) {
        await leaveRoom({ clerkId: currentPlayer.user.clerkId })
      }
    } catch (error) {
      // ignore — we navigate home regardless
    } finally {
      router.push('/')
    }
  }

  return (
    <div className='fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/70 text-center font-merriweather'>
      <div className='text-5xl font-black text-primary'>🏆 Game Over</div>
      <div className='text-2xl font-medium text-white'>
        <span className='capitalize text-primary'>{winner?.user.username ?? 'The last player'}</span> wins the game!
      </div>
      <Button size='lg' disabled={isLeaving} onClick={handleBackHome}>
        Back home {isLeaving && <Loader className='ml-1' />}
      </Button>
    </div>
  )
}

export default GameOverScreen
