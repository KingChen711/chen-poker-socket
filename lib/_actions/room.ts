import { Room } from '@/types'
import { CreateRoomParams, GetRoomByIdParams, JoinRoomParams, LeaveRoomParams, StartGameParams } from '../params'

export async function createRoom({ clerkId }: CreateRoomParams) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clerkId
    })
  }).then((response) => response.json())

  return data.room as Room
}

export async function leaveRoom({ clerkId }: LeaveRoomParams) {
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clerkId
    })
  })
}

export async function joinRoom({ roomCode, clerkId }: JoinRoomParams) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomCode,
      clerkId
    })
  }).then((response) => response.json())

  return data.room as Room
}

export async function getGameByRoomId({ id }: GetRoomByIdParams) {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/${id}`).then((response) => response.json())
}

export async function startGame({ roomId }: StartGameParams) {
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId
    })
  })
}
