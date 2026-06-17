import React, { useState } from 'react'
import { Button } from '../ui/button'
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
import { toast } from '../ui/use-toast'
import { allInBet, callBet, checkBet, foldBet, raiseBet } from '@/lib/_actions/game'
import ChipStack from './ChipStack'
import { BigBlindValue } from '@/constants/deck'
import { useCountdown } from '@/hooks/useCountdown'
import { describeActionError } from '@/lib/action-error'
import { cn } from '@/lib/utils'

const actionButtonClass =
  'rounded-sm bg-primary px-[2.5%] py-[1.5%] text-[2.5cqw] font-medium leading-none text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50'

function BetButtons() {
  const gameStore = useGameStore()
  const room = gameStore.room!
  const gameObj = room.gameObj!
  const currentPlayer = gameStore.currentPlayer
  const [raiseValue, setRaiseValue] = useState<number | null>(null)
  const [pending, setPending] = useState(false)
  const secondsLeft = useCountdown(gameObj?.turnEndsAt)

  // No betting actions once the hand is at showdown or the table is over.
  if (room.status === 'SHOWDOWN' || room.status === 'GAME_OVER') {
    return null
  }

  const runAction = async (action: () => Promise<unknown>) => {
    if (pending) {
      return
    }
    setPending(true)
    try {
      await action()
    } catch (error) {
      toast(describeActionError(error))
    } finally {
      setPending(false)
    }
  }

  // Raise validation mirrors the server (B3): positive whole number, >= BigBlindValue, affordable.
  const extraToPay = gameObj.callingValue - (currentPlayer?.bet ?? 0) + (raiseValue ?? 0)
  const isValidRaise =
    raiseValue !== null &&
    Number.isInteger(raiseValue) &&
    raiseValue >= BigBlindValue &&
    extraToPay <= (currentPlayer?.balance ?? 0)
  const raiseHint =
    raiseValue === null
      ? ''
      : !Number.isInteger(raiseValue)
        ? 'Enter a whole number.'
        : raiseValue < BigBlindValue
          ? `Minimum raise is ${BigBlindValue}.`
          : extraToPay > (currentPlayer?.balance ?? 0)
            ? 'Not enough chips for this raise.'
            : ''

  const handleCall = () => runAction(() => callBet({ roomId: room.id, userId: currentPlayer!.userId }))
  const handleCheck = () => runAction(() => checkBet({ roomId: room.id, userId: currentPlayer!.userId }))
  const handleFold = () => runAction(() => foldBet({ roomId: room.id, userId: currentPlayer!.userId }))
  const handleAllIn = () => runAction(() => allInBet({ roomId: room.id, userId: currentPlayer!.userId }))
  const handleRaise = () => {
    if (raiseValue === null || !isValidRaise) {
      return
    }
    return runAction(() => raiseBet({ roomId: room.id, userId: currentPlayer!.userId, raiseValue }))
  }

  return (
    <div
      // @ts-ignore
      style={{ containerType: 'size' }}
      className='absolute left-1/2 top-[-2%] z-[2] flex w-2/3 -translate-x-1/2 flex-col items-center'
    >
      <div className='relative mb-[12%] text-[4cqw] font-bold text-foreground'>${gameStore.pot}</div>

      <ChipStack posX={50} posY={0} amount={gameStore.pot} pot />

      {currentPlayer && currentPlayer.userId === gameStore.playingUserId && (
        <>
          {secondsLeft !== null && (
            <div
              className={cn(
                'mb-[2%] text-[2.5cqw] font-bold',
                secondsLeft <= 5 ? 'text-destructive' : 'text-foreground'
              )}
            >
              {secondsLeft}s to act
            </div>
          )}

          <div className='z-[2] flex w-full items-center justify-center gap-[2%]'>
            {currentPlayer.bet < gameObj.callingValue &&
              currentPlayer.balance + currentPlayer.bet > gameObj.callingValue && (
                <button className={actionButtonClass} disabled={pending} onClick={handleCall}>
                  Call
                </button>
              )}

            {currentPlayer.balance + currentPlayer.bet <= gameObj.callingValue && (
              <button className={actionButtonClass} disabled={pending} onClick={handleAllIn}>
                All in
              </button>
            )}

            {currentPlayer.bet === gameObj.callingValue && (
              <button className={actionButtonClass} disabled={pending} onClick={handleCheck}>
                Check
              </button>
            )}

            {currentPlayer.bet < gameObj.callingValue && (
              <button className={actionButtonClass} disabled={pending} onClick={handleFold}>
                Fold
              </button>
            )}

            {currentPlayer.balance + currentPlayer.bet > gameObj.callingValue && (
              <Dialog>
                <DialogTrigger disabled={pending} className={actionButtonClass}>
                  Raise
                </DialogTrigger>
                <DialogContent className='w-[400px]'>
                  <DialogHeader>
                    <DialogTitle className='mt-2'>Raise</DialogTitle>
                    <DialogDescription>
                      <div className='flex items-center gap-1 font-medium'>
                        Your balance: <div className='text-lg text-primary'>{currentPlayer?.balance || 0}$</div>
                      </div>
                      <div className='flex items-center gap-1 font-medium'>
                        Need to pay extra: <div className='text-lg text-primary'>{extraToPay}$</div>
                      </div>

                      <Input
                        onChange={(e) => {
                          const raw = e.target.value
                          if (raw === '') {
                            setRaiseValue(null)
                            return
                          }
                          const value = Number(raw)
                          if (!isNaN(value)) {
                            setRaiseValue(value)
                          }
                        }}
                        value={raiseValue ?? ''}
                        type='number'
                        min={BigBlindValue}
                        step={1}
                        placeholder={`Min ${BigBlindValue} — enter the raise value...`}
                        className='mt-2'
                      />

                      {raiseHint && <div className='mt-1 text-sm text-destructive'>{raiseHint}</div>}

                      <div className='flex justify-end gap-3'>
                        <DialogClose asChild>
                          <Button className='mt-4' variant='secondary'>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button onClick={handleRaise} disabled={!isValidRaise || pending} className='mt-4'>
                          Bet
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default BetButtons
