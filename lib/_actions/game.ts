import { Room } from '@/types'
import {
  AllInBetParams,
  CallBetParams,
  CheckBetParams,
  FoldBetParams,
  RaisePetParams,
  ReadyNextMatchParams
} from '../params'

type ActionError = Error & { statusCode?: number }

// Shared POST for every game action. On a non-200 it throws an Error carrying the server's message
// and statusCode (so callers can surface a real reason and treat 409 conflicts gently).
async function postGameAction(path: string, body: Record<string, unknown>): Promise<Room> {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((response) => response.json())

  if (data.statusCode !== 200) {
    const error: ActionError = new Error(data.message || 'Something went wrong!')
    error.statusCode = data.statusCode
    throw error
  }

  return data.room as Room
}

export async function callBet({ roomId, userId }: CallBetParams) {
  return postGameAction('/api/games/call', { roomId, userId })
}

export async function checkBet({ roomId, userId }: CheckBetParams) {
  return postGameAction('/api/games/check', { roomId, userId })
}

export async function raiseBet({ roomId, userId, raiseValue }: RaisePetParams) {
  return postGameAction('/api/games/raise', { roomId, userId, raiseValue })
}

export async function foldBet({ roomId, userId }: FoldBetParams) {
  return postGameAction('/api/games/fold', { roomId, userId })
}

export async function allInBet({ roomId, userId }: AllInBetParams) {
  return postGameAction('/api/games/all-in', { roomId, userId })
}

export async function readyNextMatch({ roomId, userId }: ReadyNextMatchParams) {
  return postGameAction('/api/games/ready-next-match', { roomId, userId })
}
