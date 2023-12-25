import { db } from '@/firebase'
import { Player, Room, User } from '@/types'
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useCurrentUser } from './useCurrentUser'
import { getGameByRoomId } from '@/lib/_actions/room'

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
  }, [room, user])

  // useEffect(() => {
  //   if (!room || room.status === 'PRE_GAME') {
  //     return
  //   }
  //   const index = room.gameObj.turn % room.players.length
  //   setPlayingPerson(room.players[index].userId)
  // }, [room])

  // useEffect(() => {
  //   let pot = 0
  //   players.forEach((p) => {
  //     pot += p.bet!
  //   })
  //   setPot(pot)
  // }, [players])

  useEffect(() => {
    const fetchGame = async () => {
      const {
        game: { room, players }
      } = await getGameByRoomId({ id: roomId })

      setRoom(room || null)
      setPlayers(players || [])
    }

    try {
      fetchGame()
    } catch (error) {
      setRoom(null)
      setPlayers([])
    }
  }, [roomId])

  return { room, players, playingPerson, pot, currentPlayer, winner, isLoading }
}
