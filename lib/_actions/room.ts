// import { CreateRoomParams } from '../params'

// export async function createRoom({ userId }: CreateRoomParams) {
//   const user = await getUserById(userId)

//   if (!user) {
//     throw new Error('Not found user!')
//   }

//   if (user.currentRoom) {
//     throw new Error('You are already in a room!')
//   }

// const newRoom: Omit<Room, 'id'> = {
//   roomCode: generateRoomCode(),
//   status: 'pre-game',
//   roomOwner: userId,
//   players: [
//     {
//       userId: user.id,
//       balance: BalanceValue,
//       bet: 0,
//       hand: {
//         holeCards: [],
//         pokerCards: [],
//         rank: null
//       },
//       user: null
//     }
//   ],
//   gameObj: null
// }

// const roomId = await addData({
//   collectionName: 'rooms',
//   data: newRoom
// })

// await updateUser({ ...user, currentRoom: roomId })

// return { roomId }
// }
