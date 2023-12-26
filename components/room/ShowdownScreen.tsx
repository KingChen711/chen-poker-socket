import { CardRank } from '@/constants/deck'
import React from 'react'
import { Button } from '../ui/button'
import { Player } from '@/types'

type Props = { winner: Player; isReady: boolean }

function ShowdownScreen({ winner, isReady }: Props) {
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
    <>
      {isReady ? (
        <div className='text-center text-xl font-medium'>Waiting for other players to continue...</div>
      ) : (
        <div className='fixed inset-0 z-10 flex flex-col bg-black/50 font-merriweather font-black'>
          <div className='mt-[3%] flex items-center justify-center text-[3cqw] font-medium text-white'>
            <p className='capitalize text-primary'>{winner.user.username} Thắng!</p>
          </div>
          <div className='flex items-center justify-center text-[3cqw] font-medium italic text-primary'>
            {CardRank.get(winner.hand.rank!)}
          </div>

          <Button
            // onClick={handleReadyNextMatch}
            size='lg'
            className='absolute bottom-[3%] right-[2%] h-[4.5%] w-[8%] text-[1cqw] font-bold'
          >
            Tiếp tục
          </Button>
        </div>
      )}
    </>
  )
}

export default ShowdownScreen
