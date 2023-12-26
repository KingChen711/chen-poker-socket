import { cn, getCardImage, getPlayerPosition, isWinnerCard } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { GameObj, Player, Room } from '@/types'
import { CardRank } from '@/constants/deck'
import { useGame } from '@/hooks/useGame'
import PlayerBox from './PlayerBox'
import ShowdownScreen from './ShowdownScreen'
import BetButtons from './BetButtons'

type Props = {
  //   room: Room & { status: 'PRE_FLOP' | 'THE_FLOP' | 'THE_TURN' | 'THE_RIVER' | 'SHOWDOWN' }
  //   players: Player[]
  //   playingPerson: string | null
  //   pot: number
  //   currentUser: Player | null
  //   winner: Player | null
  gameObj: GameObj
  roomId: string
}

function InGameBoard({ roomId, gameObj }: Props) {
  const { currentPlayer, winner, room, players, playingPerson, pot } = useGame(roomId)

  return (
    <div className='relative mx-auto aspect-[9.1/5] w-10/12 min-w-[600px] bg-[url("/assets/images/table.png")] !bg-cover !bg-center'>
      {room?.status === 'SHOWDOWN' && currentPlayer && (
        <ShowdownScreen isReady={gameObj.readyPlayers.includes(currentPlayer.userId)} winner={winner!} />
      )}
      {currentPlayer?.userId === playingPerson && room?.status !== 'SHOWDOWN' && (
        <BetButtons currentPlayer={currentPlayer} gameObj={gameObj} pot={pot} />
      )}
      {players.map((p, index) => {
        // spent one more position for the buttons actions
        const { x, y } = getPlayerPosition(index + 1, players.length + 1)
        return (
          <PlayerBox
            key={p.userId}
            player={p}
            posX={x}
            posY={y}
            isWinner={p.userId === winner?.userId}
            isFolded={gameObj.foldPlayers.includes(p.userId)}
            isShowdownStage={room?.status === 'SHOWDOWN'}
            showDealerIcon={p.userId === room?.gameObj?.dealer}
            showStand={p.userId === playingPerson && !winner}
            hiddenCard={p.userId !== currentPlayer?.userId}
          />
        )
      })}
      {/* <div className='absolute left-1/2 top-1/2 z-20 mx-auto flex w-[45%] -translate-x-1/2 -translate-y-1/2 gap-3'>
        {room.gameObj.communityCards.map((card) => {
          return (
            <div key={`${card.suit}-${card.value}`} className={cn('relative aspect-[0.6857] w-[20%]')}>
              {winner && <div className='absolute inset-0 z-30 rounded-lg bg-black/50'></div>}
              <Image
                fill
                src={getCardImage(card)!}
                alt='board card'
                className={cn('rounded-lg', winner && isWinnerCard(winner, card) && 'z-30')}
              />
            </div>
          )
        })}
      </div> */}
    </div>
  )
}

export default InGameBoard
