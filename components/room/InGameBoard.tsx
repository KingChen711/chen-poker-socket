import { cn, getCardImage, getPlayerPosition, isWinnerCard } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { GameObj, Player, Room } from '@/types'
import { CardRank } from '@/constants/deck'
import PlayerBox from './PlayerBox'
import ShowdownScreen from './ShowdownScreen'
import BetButtons from './BetButtons'
import { useGameStore } from '@/store/game-store'
import ChipStack from './ChipStack'

function InGameBoard() {
  const gameStore = useGameStore()
  const room = gameStore.room!

  if (room.status === 'PRE_GAME') {
    return null
  }

  return (
    <div className='relative mx-auto aspect-[9.1/5] w-10/12 min-w-[600px] bg-[url("/assets/images/table.png")] !bg-cover !bg-center'>
      <ShowdownScreen />

      <BetButtons />

      {gameStore.players.map((p, index) => {
        // spent one more position for the buttons actions
        const { x, y } = getPlayerPosition(index + 1, gameStore.players.length + 1)

        return (
          <PlayerBox
            key={p.userId}
            player={p}
            posX={x}
            posY={y}
            isWinner={p.userId === gameStore.winner?.userId}
            isFolded={room!.gameObj!.foldPlayers.includes(p.userId)}
            winner={gameStore.winner}
            showDealerIcon={p.userId === room!.gameObj!.dealer}
            showStand={p.userId === gameStore.playingUserId && !gameStore.winner}
            hiddenCard={p.userId !== gameStore.currentPlayer?.userId && !gameStore.winner}
          />
        )
      })}

      <div className='absolute inset-[14%] z-[1]'>
        {gameStore.players.map((p, index) => {
          // spent one more position for the buttons actions
          const { x, y } = getPlayerPosition(index + 1, gameStore.players.length + 1, true)

          return <ChipStack posX={x} posY={y} key={p.userId} amount={p.balance} />
        })}
      </div>

      <div className='absolute left-1/2 top-1/2 z-20 mx-auto flex w-[45%] -translate-x-1/2 -translate-y-1/2 gap-3'>
        {room.gameObj.communityCards.map((card) => {
          return (
            <div key={`${card.suit}-${card.value}`} className={cn('relative aspect-[0.6857] w-[20%]')}>
              {gameStore.winner && <div className='absolute inset-0 z-30 rounded-lg bg-black/50'></div>}
              <Image
                fill
                src={getCardImage(card)!}
                alt='board card'
                className={cn('rounded-lg', gameStore.winner && isWinnerCard(gameStore.winner, card) && 'z-30')}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InGameBoard
