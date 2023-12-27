import { Room } from '@/types'
import { CallBetParams } from '../params'

export async function callBet({ roomId, userId }: CallBetParams) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId,
      userId
    })
  }).then((response) => response.json())

  if (data.statusCode !== 200) {
    throw new Error()
  }

  return data.room as Room
}

export async function checkBet({ roomId, userId }: CallBetParams) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId,
      userId
    })
  }).then((response) => response.json())

  if (data.statusCode !== 200) {
    throw new Error()
  }

  return data.room as Room
}
