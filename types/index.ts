export enum CardValue {
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14
}
export enum CardSuit {
  Spade,
  Club,
  Diamond,
  Heart
}

export type Card = {
  value: CardValue
  suit: CardSuit
}

export enum Rank {
  Fold = -1,
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfKind,
  Straight,
  Flush,
  FullHouse,
  FourOfKind,
  StraightFlush,
  RoyalFlush
}

// we work with firebase in this project, and the firebase will be error with undefined values, so we use '| null' instead '?:'
export type User = {
  id: string
  clerkId: string
  picture: string
  email: string
  username: string
  name: string
  createdAt: string
}

export type Hand = { holeCards: Card[]; rank: Rank | null; pokerCards: Card[] }

// just use in room
export type Player = {
  userId: string
  user: User
  hand: Hand
  balance: number
  bet: number
}

export type GameObj = {
  dealerIndex: number
  turn: number
  callingValue: number
  deck: Card[]
  dealer: string
  smallBlind: string
  bigBlind: string
  foldPlayers: string[]
  communityCards: Card[]
  checkingPlayers: string[]
  allInPlayers: string[]
  readyPlayers: string[]
  winner: string | null
}

export type Room = {
  id: string
  roomCode: string
  roomOwner: string
  players: Player[]
} & (
  | {
      gameObj: GameObj
      status: 'PRE_FLOP' | 'THE_FLOP' | 'THE_TURN' | 'THE_RIVER'
    }
  | {
      gameObj: GameObj & { winner: string }
      status: 'SHOWDOWN'
    }
  | {
      gameObj: null
      status: 'PRE_GAME'
    }
)
