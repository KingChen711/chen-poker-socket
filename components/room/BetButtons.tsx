import React, { useState } from 'react'
import { Button } from '../ui/button'
// import { allInBet, callBet, checkBet, foldBet, raiseBet } from '@/lib/actions/game'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { Input } from '../ui/input'
import { useGameStore } from '@/store/game-store'

function BetButtons() {
  const gameStore = useGameStore()
  const room = gameStore.room!
  const gameObj = room.gameObj!
  const currentPlayer = gameStore.currentPlayer

  const [raiseValue, setRaiseValue] = useState<number | null>(null)
  //   const handleCall = async () => {
  //     try {
  //       if (room && currentPlayer) {
  //         await callBet({ roomId: room.id, userId: currentPlayer.userId })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   const handleCheck = async () => {
  //     try {
  //       if (room && currentPlayer) {
  //         await checkBet({ roomId: room.id, userId: currentPlayer.userId })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   const handleRaise = async () => {
  //     try {
  //       if (room && currentPlayer && raiseValue) {
  //         await raiseBet({ roomId: room.id, userId: currentPlayer.userId, raiseValue })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   const handleFold = async () => {
  //     try {
  //       if (room && currentPlayer) {
  //         await foldBet({ roomId: room.id, userId: currentPlayer.userId })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   const handleAllIn = async () => {
  //     try {
  //       if (room && currentPlayer) {
  //         await allInBet({ roomId: room.id, userId: currentPlayer.userId })
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  if (currentPlayer?.userId !== gameStore.playingUserId || room.status === 'SHOWDOWN') {
    return null
  }

  return (
    <div
      style={{ containerType: 'size' }}
      className='absolute left-1/2 top-[7%] flex w-2/3 -translate-x-1/2 flex-col items-center'
    >
      <div className='mb-[0.5%] text-[6cqw] font-bold text-foreground'>${gameStore.pot}</div>

      <div className='flex w-full items-center justify-center gap-[2%]'>
        {currentPlayer.bet < gameObj.callingValue &&
          currentPlayer.balance + currentPlayer.bet > gameObj.callingValue && (
            <button
              className='rounded-sm bg-primary px-[2.5%] py-[1.5%] text-[2.5cqw] font-medium leading-none text-primary-foreground'
              // onClick={handleCall}
            >
              Theo cược
            </button>
          )}

        {currentPlayer.balance + currentPlayer.bet <= gameObj.callingValue && (
          <button
            className='rounded-sm bg-primary px-[2.5%] py-[1.5%] text-[2.5cqw] font-medium leading-none text-primary-foreground'
            //   onClick={handleAllIn}
          >
            All in
          </button>
        )}

        {currentPlayer.bet === gameObj.callingValue && (
          <button
            className='rounded-sm bg-primary px-[2.5%] py-[1.5%] text-[2.5cqw] font-medium leading-none text-primary-foreground'
            //   onClick={handleCheck}
          >
            Check
          </button>
        )}

        {currentPlayer.bet < gameObj.callingValue && (
          <button
            className='rounded-sm bg-primary px-[2.5%] py-[1.5%] text-[2.5cqw] font-medium leading-none text-primary-foreground'
            // onClick={handleFold}
          >
            Bỏ bài
          </button>
        )}

        {currentPlayer.balance + currentPlayer.bet > gameObj.callingValue && (
          <Dialog>
            <DialogTrigger className='rounded-sm bg-primary px-[2.5%] py-[1.5%] text-[2.5cqw] font-medium leading-none text-primary-foreground'>
              Cược thêm
            </DialogTrigger>
            <DialogContent className='w-[400px]'>
              <DialogHeader>
                <DialogTitle className='mt-2'>Cược thêm</DialogTitle>
                <DialogDescription>
                  <div className='flex items-center gap-1 font-medium'>
                    Tài khoản của bạn: <div className='text-lg text-primary'>{currentPlayer?.balance || 0}$</div>
                  </div>
                  <div className='flex items-center gap-1 font-medium'>
                    Số tiền cần bỏ thêm:{' '}
                    <div className='text-lg text-primary'>
                      {gameObj.callingValue - currentPlayer.bet + (raiseValue || 0)}$
                    </div>
                  </div>

                  <Input
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (!isNaN(value)) {
                        setRaiseValue(value)
                      }
                    }}
                    value={raiseValue || ''}
                    type='number'
                    placeholder='Nhập số tiền cược thêm'
                    className='mt-2'
                  />

                  <div className='flex justify-end gap-3'>
                    <DialogClose asChild>
                      <Button className='mt-4' variant='secondary'>
                        Thôi
                      </Button>
                    </DialogClose>
                    <Button
                      //   onClick={handleRaise}
                      disabled={gameObj.callingValue - currentPlayer.bet + (raiseValue || 0) > currentPlayer.balance}
                      className='mt-4'
                    >
                      Cược
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
export default BetButtons
