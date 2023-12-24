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
import { cleanUpInGameRoom } from './game'

export async function getCurrentRoom({ userId }: GetCurrentRoomParams) {
  const user = await getUserById(userId)

  if (!user) {
    throw new Error('Not found user!')
  }

  if (!user.currentRoomId) {
    throw new Error('Not found your current room!')
  }

  return { roomId: user.currentRoomId }
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

export async function joinRoom({ userId, roomCode }: JoinRoomParams) {
  const user = await getUserById(userId)

  if (!user) {
    throw new Error('Not found user!')
  }

  const room = await getRoomByCode(roomCode)

  if (!room) {
    throw new Error('Not found room!')
  }

  if (user.currentRoomId === room.id) {
    return room.id
  }

  if (user.currentRoomId && user.currentRoomId !== room.id) {
    throw new Error('You are already in another room!')
  }

  if (room.players.length >= 8) {
    throw new Error('This room is full!')
  }

  if (room.status !== 'PRE_GAME') {
    throw new Error('You cannot join a room is in game!')
  }

  // handle user
  user.currentRoomId = room.id

  await updateData({ collectionName: 'users', data: user })

  // handle room
  room.players.push({
    userId: user.id,
    balance: BalanceValue,
    bet: 0,
    hand: {
      holeCards: [],
      pokerCards: [],
      rank: null
    },
    user: null
  })
  await updateData({ collectionName: 'rooms', data: room })

  return room.id
}

export async function getRoomById(roomId: string): Promise<Room | null> {
  const room = (await getById({ collectionName: 'rooms', id: roomId })) as Room | null
  if (!room) return null
  return { ...room, id: roomId }
}

export async function cleanUp(userId: string) {
  const user = await getUserById(userId)

  if (!user) {
    throw new Error('Not found user!')
  }

  const room = user.currentRoomId ? await getRoomById(user.currentRoomId) : null

  if (!room) {
    throw new Error('Not found room!')
  }

  // await leaveRoom({ userId })
  await cleanUpInGameRoom({ userId, roomId: room.id })
}
