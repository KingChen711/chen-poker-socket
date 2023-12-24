import { Room } from '@/types'
import { CreateRoomParams, LeaveRoomParams } from '../params'

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
