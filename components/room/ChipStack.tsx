import { denominationToChipImage, denominationToPosChip } from '@/constants/deck'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { CSSProperties, useEffect, useState } from 'react'

export type Stack = {
  denomination: number
  count: number
}

interface Props {
  amount: number
  posX: number
  posY: number
  pot?: boolean
}

const denominations = [1000, 500, 100, 10, 1]
const ChipStack = ({ amount, posX, posY, pot = false }: Props) => {
  let remainingAmount = amount
  const chips = denominations.map((denomination) => {
    const count = Math.floor(remainingAmount / denomination)
    remainingAmount -= count * denomination
    return { denomination, count }
  })
  const stacks: { denomination: number; count: number }[] = []
  chips.forEach((chip) => {
    while (chip.count > 0) {
      if (chip.count > 10) {
        stacks.push({ ...chip, count: 10 })
        chip.count -= 10
        continue
      }
      stacks.push({ ...chip, count: chip.count })
      break
    }
  })

  return (
    <div
      style={{
        left: `${posX}%`,
        top: `${posY}%`
      }}
      className={cn('absolute aspect-square w-[10%] -translate-x-1/2 -translate-y-1/2', pot && 'w-[230%]')}
    >
      {stacks.map((stack, index) => (
        <StackComponent
          style={{
            transform: `${denominationToPosChip.get(stack.denomination.toString())}`,
            zIndex: -index
          }}
          key={`${stack.denomination}-${stack.count}-${index}`}
          stack={stack}
        />
      ))}
    </div>
  )
}

export default ChipStack

interface StackProps {
  stack: Stack
  style: CSSProperties
}

const StackComponent = ({ stack, style }: StackProps) => {
  const ChipImage = denominationToChipImage.get(stack.denomination.toString())!
  return (
    <div style={style} className='absolute aspect-square w-full'>
      {Array(stack.count)
        .fill(null)
        .map((_, index) => {
          return (
            <div
              style={{
                transform: `translate(0,${-index * 9}%)`,
                zIndex: `${index}`
              }}
              key={index}
              className='absolute h-[40%] w-[40%]'
            >
              <Image alt='chip' fill src={ChipImage} />
            </div>
          )
        })}
    </div>
  )
}
