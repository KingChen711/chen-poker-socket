export type CreateRoomParams = {
  clerkId: string
}

export type GetCurrentRoomParams = {
  userId: string
}

export type LeaveRoomParams = {
  clerkId: string
}

export type JoinRoomParams = {
  clerkId: string
  roomCode: string
}

export type StartGameParams = {
  roomId: string
}

export type CallBetParams = {
  roomId: string
  userId: string
}

export type CheckBetParams = {
  roomId: string
  userId: string
}

export type AllInBetParams = {
  roomId: string
  userId: string
}

export type FoldBetParams = {
  roomId: string
  userId: string
}

export type RaisePetParams = {
  roomId: string
  userId: string
  raiseValue: number
}

export type ShowDownFoldParams = {
  roomId: string
  lastFoldPlayer: string
}

export type CleanUpInGameRoomParams = {
  roomId: string
  userId: string
}

export type GetRoomByIdParams = {
  id: string
}
