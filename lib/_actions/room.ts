import { Room } from '@/types'
import { CreateRoomParams, GetRoomByIdParams, JoinRoomParams, LeaveRoomParams, StartGameParams } from '../params'
import { createRoomErrorMessages, joinRoomErrorMessages } from '@/constants/error-message'

export async function createRoom({ clerkId }: CreateRoomParams) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clerkId
      })
    }).then((response) => response.json())

    if (data.statusCode !== 200) {
      throw new Error(data.message)
    }

    return data.room as Room
  } catch (error: any) {
    let errorMessage = error?.message
    if (!createRoomErrorMessages.includes(errorMessage)) {
      errorMessage = 'Something went wrong when creating room'
    }
    throw new Error(errorMessage)
  }
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
  try {
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

    if (data.statusCode !== 200) {
      throw new Error(data.message)
    }

    return data.room as Room
  } catch (error: any) {
    let errorMessage = error?.message
    if (!joinRoomErrorMessages.includes(errorMessage)) {
      errorMessage = 'Something went wrong when joining room'
    }
    throw new Error(errorMessage)
  }
}

export async function getGameByRoomId({ id }: GetRoomByIdParams) {
  return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/${id}`).then((response) => response.json())
}

export async function startGame({ roomId }: StartGameParams) {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId
      })
    }).then((response) => response.json())

    if (data.statusCode !== 200) {
      throw new Error(data.message)
    }
  } catch (error: any) {
    const message = error?.message
    if (message === 'At least 2 players to start a game!') {
      throw new Error(message)
    }
    throw new Error('Something went wrong!')
  }
}
