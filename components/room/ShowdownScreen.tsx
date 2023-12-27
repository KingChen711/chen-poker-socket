import { CardRank } from '@/constants/deck'
import React from 'react'
import { Button } from '../ui/button'
import { useGameStore } from '@/store/game-store'

function ShowdownScreen() {
  const { winner, room, currentPlayer } = useGameStore()
  //   const handleReadyNextMatch = async () => {
  //     try {
  //       if (room && currentUser) {
  //         await readyNextMatch({ roomId: room.id, userId: currentUser.userId })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  if (room!.status !== 'SHOWDOWN' || !currentPlayer) {
    return null
  }

  const isReady = room!.gameObj.readyPlayers.includes(currentPlayer.userId)
  if (isReady) {
    return <div className='text-center text-xl font-medium'>Waiting for other players to continue...</div>
  }

  return (
    <div className='fixed inset-0 z-10 flex flex-col bg-black/50 font-merriweather font-black'>
      <div className='mt-[3%] flex items-center justify-center text-[3cqw] font-medium text-white'>
        <p className='capitalize text-primary'>{winner!.user.username} Thắng!</p>
      </div>
      <div className='flex items-center justify-center text-[3cqw] font-medium italic text-primary'>
        {CardRank.get(winner!.hand.rank!)}
      </div>

      <Button
        // onClick={handleReadyNextMatch}
        size='lg'
        className='absolute bottom-[3%] right-[2%] h-[4.5%] w-[8%] text-[1cqw] font-bold'
      >
        Tiếp tục
      </Button>
    </div>
  )
}

export default ShowdownScreen
