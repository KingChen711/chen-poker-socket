import { addData, deleteData, getById, readData, updateData } from '@/firebase/services'
import { generateRoomCode } from '../utils'
import { Room } from '@/types'
import { getUserById, updateUser } from './user'
import { BalanceValue } from '@/constants/deck'
import {
  CleanUpInGameRoomParams,
  CreateRoomParams,
  GetCurrentRoomParams,
  JoinRoomParams,
  LeaveRoomParams
} from '../params'
// import { cleanUpInGameRoom } from './game'

export async function getCurrentRoom({ userId }: GetCurrentRoomParams) {
  const user = await getUserById(userId)

  if (!user) {
    throw new Error('Not found user!')
  }

  // if (!user.currentRoomId) {
  //   throw new Error('Not found your current room!')
  // }

  // return { roomId: user.currentRoomId }
}

// export async function leaveRoom({ userId }: LeaveRoomParams) {
// const user = await getUserById(userId)

// if (!user) {
//   throw new Error('Not found user!')
// }

// const roomId = user.currentRoomId
// if (!roomId) {
//   throw new Error('Not found current room!')
// }

// // handle user
// await updateData({ collectionName: 'users', data: { ...user, currentRoom: null } })

// // handle room
// const room = await getRoomById(roomId)

// if (!room) {
//   throw new Error('Not found room!')
// }

// room.players = room.players.filter((p) => p.userId !== userId)
// if (room.players.length === 0) {
//   await deleteData({ collectionName: 'rooms', id: roomId })
//   return
// }

// if (room.roomOwner === userId) {
//   // need to change roomOwner
//   room.roomOwner = room.players[0].userId
// }

// await updateData({ collectionName: 'rooms', data: room })
// }

export const getRoomByCode = async (roomCode: string) => {
  const rooms = (await readData({ collectionName: 'rooms' })) as Room[]
  return rooms.find((r) => r.roomCode === roomCode)
}
