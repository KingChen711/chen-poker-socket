import { cn, getCardImage, isWinnerCard } from '@/lib/utils'
import { Player } from '@/types'
import Image from 'next/image'
import React from 'react'

type Props = {
  player: Player
  posX: number
  posY: number
  isWinner: boolean
  isFolded: boolean
  winner: Player | null
  showDealerIcon: boolean
  showStand: boolean
  hiddenCard: boolean
}

function PlayerBox({ player, posX, posY, isWinner, showDealerIcon, isFolded, winner, showStand, hiddenCard }: Props) {
  return (
    <div
      style={{
        left: `${posX}%`,
        top: `${posY}%`
      }}
      className={cn(
        'absolute flex aspect-[1.08/1] w-[17%] -translate-x-1/2 -translate-y-1/2 flex-col z-[2]',
        isWinner && 'z-20'
      )}
    >
      <div
        style={{ containerType: 'size' }}
        className='absolute bottom-[57%] left-1/2 z-10 flex w-[75%] -translate-x-1/2 flex-col'
      >
        <div className='flex justify-center rounded-md border-2 border-black bg-primary text-[15cqw] font-medium text-primary-foreground'>
          ${player.bet}
        </div>
        <div className='mx-auto flex w-[87%] justify-center rounded-b-md border-2 border-black bg-accent text-[13cqw] font-medium text-accent-foreground'>
          ${player.balance}
        </div>
      </div>

      <div
        style={{ containerType: 'size' }}
        className='absolute bottom-[11%] z-10 flex w-full items-center justify-center'
      >
        <div className='relative mr-1 aspect-square w-[13%]'>
          <Image fill src={player.user.picture} alt='avatar' className='rounded-full' />
        </div>
        <div className='text-[12cqw] font-medium'>{player.user.username}</div>
      </div>

      {isFolded ? (
        <div style={{ containerType: 'size' }} className='absolute z-10 w-full'>
          <div className='flex justify-center text-[20cqw] font-medium'>Fold</div>
        </div>
      ) : (
        <div className='-z-20 h-full w-full'>
          <div
            className={cn(
              'absolute left-1/2 z-[5] aspect-[4.78/6.7] w-[50%] -translate-x-2/3',
              !hiddenCard && 'hover:scale-125'
            )}
          >
            {winner && <div className='absolute inset-0 z-30 translate-x-[30%] rotate-12 rounded-md bg-black/50'></div>}
            <Image
              fill
              src={hiddenCard || !player.hand ? '/assets/cards/back-card.jpg' : getCardImage(player.hand.holeCards[0])!}
              alt='first card'
              className={cn(
                'rounded-md absolute translate-x-[30%] rotate-12',
                winner && isWinnerCard(winner, player.hand.holeCards[0]) && 'z-50'
              )}
            />
          </div>
          <div
            className={cn(
              'absolute left-1/2 aspect-[4.78/6.7] w-[50%] -translate-x-2/3 rounded-md',
              !hiddenCard && 'hover:scale-125 hover:z-10'
            )}
          >
            {winner && <div className='absolute inset-0 z-30 -rotate-12 bg-black/50'></div>}
            <Image
              fill
              src={hiddenCard || !player.hand ? '/assets/cards/back-card.jpg' : getCardImage(player.hand.holeCards[1])!}
              alt='second card'
              className={cn(
                'rounded-md absolute -rotate-12 z-10',
                winner && isWinnerCard(winner, player.hand.holeCards[0]) && 'z-50'
              )}
            />
          </div>
        </div>
      )}

      {showDealerIcon && (
        <div className='absolute right-0 top-[57%] z-10 mr-1 aspect-square w-[25%]'>
          <Image fill src='/assets/icons/dealer.png' alt='dealer' className='rounded-full' />
        </div>
      )}

      {showStand && (
        <div className='stand-player'>
          <div className='absolute inset-[2%] -z-40 rounded-[50%] bg-background'></div>
        </div>
      )}
    </div>
  )
}

export default PlayerBox
