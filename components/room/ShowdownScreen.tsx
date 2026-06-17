import { CardRank } from '@/constants/deck'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useGameStore } from '@/store/game-store'
import { toast } from '../ui/use-toast'
import { readyNextMatch } from '@/lib/_actions/game'
import { useCountdown } from '@/hooks/useCountdown'
import { describeActionError } from '@/lib/action-error'

function ShowdownScreen() {
  const { winner, room, currentPlayer } = useGameStore()
  const [pending, setPending] = useState(false)
  // At showdown the server arms a "ready" deadline in turnEndsAt and auto-continues on expiry.
  const secondsLeft = useCountdown(room?.gameObj?.turnEndsAt)

  const handleReadyNextMatch = async () => {
    if (pending || !room || !currentPlayer) {
      return
    }
    setPending(true)
    try {
      await readyNextMatch({ roomId: room.id, userId: currentPlayer.userId })
    } catch (error) {
      toast(describeActionError(error))
    } finally {
      setPending(false)
    }
  }

  if (room!.status !== 'SHOWDOWN') {
    return null
  }

  const autoContinueLabel = secondsLeft !== null ? `Auto-continue in ${secondsLeft}s` : ''

  const isReady = currentPlayer && room!.gameObj.readyPlayers.includes(currentPlayer.userId)
  if (isReady) {
    return (
      <div className='text-center text-xl font-medium'>
        Waiting for other players to continue...
        {autoContinueLabel && <span className='ml-1 text-primary'>({autoContinueLabel})</span>}
      </div>
    )
  }

  return (
    <div className='fixed inset-0 z-10 flex flex-col bg-black/50 font-merriweather font-black'>
      <div className='mt-[3%] flex items-center justify-center text-[3cqw] font-medium text-white'>
        <p className='capitalize text-primary'>{winner?.user.username} Win!</p>
      </div>
      <div className='flex items-center justify-center text-[3cqw] font-medium italic text-primary'>
        {winner && CardRank.get(winner.hand.rank!)}
      </div>

      {autoContinueLabel && (
        <div className='absolute bottom-[8%] right-[2%] text-[1cqw] font-medium text-white'>{autoContinueLabel}</div>
      )}

      {currentPlayer && (
        <Button
          onClick={handleReadyNextMatch}
          disabled={pending}
          size='lg'
          className='absolute bottom-[3%] right-[2%] h-[4.5%] w-[8%] text-[1cqw] font-bold'
        >
          Continue
        </Button>
      )}
    </div>
  )
}

export default ShowdownScreen
