// import { cn } from '@/lib/utils'
// import { Player } from '@/types'
// import Image from 'next/image'
// import React from 'react'
// import HoleCard from './HoleCard'

// type Props = {
//   player: Player
//   winner: Player | null
//   currentUser: Player
//   posX: number
//   posY: number
//   showStand?: boolean
//   showDealer?: boolean
//   showSmallBlind?: boolean
//   showBigBlind?: boolean
//   folded?: boolean
// }

// function PlayerBox({
//   player,
//   winner,
//   currentUser,
//   posX,
//   posY,
//   showStand,
//   showBigBlind,
//   showDealer,
//   showSmallBlind,
//   folded = false
// }: Props) {
//   if (!player.user) {
//     return
//   }

//   return (
//     <div
//       style={{
//         left: `${posX}%`,
//         top: `${posY}%`
//       }}
//       className={cn(
//         'absolute flex aspect-[1.08/1] w-[17%] -translate-x-1/2 -translate-y-1/2 flex-col',
//         winner?.userId === player.userId && 'z-20'
//       )}
//     >
//       <div
//         style={{ containerType: 'size' }}
//         className='absolute bottom-[57%] left-1/2 z-10 flex w-[75%] -translate-x-1/2 flex-col'
//       >
//         <div className='flex justify-center rounded-md border-2 border-black bg-primary text-[15cqw] font-medium text-primary-foreground'>
//           ${player.bet}
//         </div>
//         <div className='mx-auto flex w-[87%] justify-center rounded-md border-2 border-black bg-accent text-[13cqw] font-medium text-accent-foreground'>
//           ${player.balance}
//         </div>
//       </div>

//       <div
//         style={{ containerType: 'size' }}
//         className='absolute bottom-[11%] z-10 flex w-full items-center justify-center'
//       >
//         <div className='relative mr-1 aspect-square w-[13%]'>
//           <Image fill src={player.user.picture} alt='avatar' className='rounded-full' />
//         </div>
//         <div className='text-[12cqw] font-medium'>{player.user.username}</div>
//       </div>

//       {folded ? (
//         <div style={{ containerType: 'size' }} className='absolute z-10 w-full'>
//           <div className='flex justify-center text-[20cqw] font-medium'>Fold</div>
//         </div>
//       ) : (
//         <HoleCard
//           winner={winner}
//           firstCard={player.hand.holeCards[0]}
//           secondCard={player.hand.holeCards[1]}
//           hidden={currentUser.userId !== player.userId && !winner}
//         />
//       )}

//       {showDealer && (
//         <div className='absolute right-0 top-[61%] z-10 mr-1 aspect-square w-[25%]'>
//           <Image fill src='/assets/icons/dealer.jpg' alt='dealer' className='rounded-full' />
//         </div>
//       )}
//       {showBigBlind && (
//         <div className='absolute right-0 top-[61%] z-10 mr-1 aspect-square w-[25%]'>
//           <Image fill src='/assets/icons/big-blind.jpg' alt='big-blind' className='rounded-full' />
//         </div>
//       )}
//       {showSmallBlind && (
//         <div className='absolute right-0 top-[61%] z-10 mr-1 aspect-square w-[25%]'>
//           <Image fill src='/assets/icons/small-blind.jpg' alt='small-blind' className='rounded-full' />
//         </div>
//       )}

//       {showStand && !winner && (
//         <div className='stand-player'>
//           <div className='absolute inset-[2%] -z-40 rounded-[50%] bg-background'></div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PlayerBox
