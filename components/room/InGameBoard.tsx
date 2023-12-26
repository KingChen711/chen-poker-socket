import { cn, getCardImage, getPlayerPosition, isWinnerCard } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { GameObj, Player, Room } from '@/types'
import { CardRank } from '@/constants/deck'
import { useGame } from '@/hooks/useGame'
import PlayerBox from './PlayerBox'

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
  const { currentPlayer, winner, room, players, playingPerson } = useGame(roomId)
  //   const handleReadyNextMatch = async () => {
  //     try {
  //       if (room && currentUser) {
  //         await readyNextMatch({ roomId: room.id, userId: currentUser.userId })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  return (
    <div className='relative mx-auto aspect-[9.1/5] w-10/12 min-w-[600px] bg-[url("/assets/images/table.png")] !bg-cover !bg-center'>
      {room?.status === 'SHOWDOWN' &&
        currentPlayer &&
        (gameObj.readyPlayers.includes(currentPlayer.userId) ? (
          <div className='text-center text-xl font-medium'>Đang chờ người chơi khác tiếp tục...</div>
        ) : (
          <div className='fixed inset-0 z-10 flex flex-col bg-black/50 font-merriweather font-black'>
            <div className='mt-[3%] flex items-center justify-center text-[3cqw] font-medium text-white'>
              <p className='capitalize text-primary'>{winner!.user.username} Thắng!</p>
            </div>
            <div className='flex items-center justify-center text-[3cqw] font-medium italic text-primary'>
              {CardRank.get(winner!.hand.rank!)}
            </div>

            {players?.map((p) => p.userId).includes(currentPlayer.userId) && (
              <Button
                // onClick={handleReadyNextMatch}
                size='lg'
                className='absolute bottom-[3%] right-[2%] h-[4.5%] w-[8%] text-[1cqw] font-bold'
              >
                Tiếp tục
              </Button>
            )}
          </div>
        ))}

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
            // showBigBlind={room.gameObj.bigBlind === p.userId}
            // showDealer={room.gameObj.dealer === p.userId}
            // showSmallBlind={room.gameObj.smallBlind === p.userId}
            // currentUser={currentUser}
            // winner={winner}
            // folded={room.gameObj.foldPlayers.includes(p.userId)}
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

      {/* <BetButtons currentUser={currentUser} playingPerson={playingPerson} pot={pot} room={room} winner={winner} /> */}
    </div>
  )
}

export default InGameBoard
