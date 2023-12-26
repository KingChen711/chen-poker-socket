import { db } from '@/firebase'
import { Player, Room, User } from '@/types'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { useCurrentUser } from './useCurrentUser'
import { getGameByRoomId } from '@/lib/_actions/room'
import { socket } from '@/services/socket'

export function useGame(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [playingPerson, setPlayingPerson] = useState<string | null>(null)
  const [pot, setPot] = useState(0)
  const user = useCurrentUser()
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   const winnerId = room?.gameObj?.winner
  //   setWinner(winnerId ? players.find((p) => p.userId === winnerId) || null : null)
  // }, [room, players])

  useEffect(() => {
    const currentPlayer = players.find((p) => {
      return p.userId === user?.id
    })
    setCurrentPlayer(currentPlayer || null)
  }, [user, players])

  useEffect(() => {
    if (players.length === 0 || !room || room.status === 'PRE_GAME') {
      setPlayingPerson(null)
      return
    }
    const index = room.gameObj.turn % players.length
    setPlayingPerson(players[index].userId)
  }, [room, players])

  useEffect(() => {
    let pot = 0
    players.forEach((p) => {
      pot += p.bet!
    })
    setPot(pot)
  }, [players])

  const fetchGame = useCallback(async () => {
    try {
      const { game } = await getGameByRoomId({ id: roomId })
      setRoom(game?.room || null)
      setPlayers(game?.players || [])
    } catch (error) {
      setRoom(null)
      setPlayers([])
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    fetchGame()
  }, [fetchGame])

  useEffect(() => {
    const onRoomChange = (room: Room) => {
      setRoom((prev) => room || prev)
    }

    socket.on('room-change', onRoomChange)

    return () => {
      socket.off('room-change', onRoomChange)
    }
  }, [])

  useEffect(() => {
    const onPlayersChange = (players: Player[]) => {
      setPlayers((prev) => players || prev)
    }

    socket.on('players-change', onPlayersChange)

    return () => {
      socket.off('players-change', onPlayersChange)
    }
  }, [])

  return { room, players, playingPerson, pot, currentPlayer, winner, isLoading }
}
