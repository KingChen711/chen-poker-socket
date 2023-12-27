import { Player, Room } from '@/types'
import { create } from 'zustand'

interface GameState {
  room: Room | null
  players: Player[]
  playingUserId: string
  pot: number
  currentPlayer: Player | null
  winner: Player | null
}

export const useGameStore = create<GameState>()((set) => ({
  room: null,
  players: [],
  playingUserId: '',
  pot: 0,
  currentPlayer: null,
  winner: null
}))
