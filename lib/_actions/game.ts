import { Room } from '@/types'
import { CallBetParams, CheckBetParams, FoldBetParams, RaisePetParams } from '../params'

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

export async function checkBet({ roomId, userId }: CheckBetParams) {
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

export async function raiseBet({ roomId, userId, raiseValue }: RaisePetParams) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/raise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId,
      userId,
      raiseValue
    })
  }).then((response) => response.json())

  if (data.statusCode !== 200) {
    throw new Error()
  }

  return data.room as Room
}

export async function foldBet({ roomId, userId }: FoldBetParams) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/games/fold`, {
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
