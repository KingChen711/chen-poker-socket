'use client'

import { useEffect, useState } from 'react'
import { socket } from '@/services/socket'
import { toast } from '@/components/ui/use-toast'
import NoResult from '@/components/shared/NoResult'
import PreGamePlayers from '@/components/room/PreGamePlayers'
import InGameBoard from '@/components/room/InGameBoard'
import { useLoadingScreenStore } from '@/store/loading-screen.store'
import RoomButtons from '@/components/room/RoomButtons'
import { getGameByRoomId } from '@/lib/_actions/room'
import { useGameStore } from '@/store/game-store'
import { Player, Room } from '@/types'
import { useCurrentUser } from '@/hooks/useCurrentUser'

type Props = {
  params: {
    id: string
  }
}

function RoomDetailPage({ params }: Props) {
  const roomId = params.id
  const { room, players } = useGameStore()
  const [isLoading, setIsLoading] = useState(true)
  const user = useCurrentUser()

  // fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { game } = await getGameByRoomId({ id: roomId })
        useGameStore.setState({ room: game?.room || null, players: game?.players || [] })
      } catch (error) {
        useGameStore.setState({ room: null, players: [] })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGame()
  }, [roomId])

  // handle winner
  useEffect(() => {
    const winnerId = room?.gameObj?.winner
    useGameStore.setState({ winner: winnerId ? players.find((p) => p.userId === winnerId) || null : null })
  }, [room, players])

  // handle playing user id
  useEffect(() => {
    if (players.length === 0 || !room || room.status === 'PRE_GAME' || room.status === 'GAME_OVER') {
      useGameStore.setState({ playingUserId: '' })
      return
    }
    const index = room.gameObj.turn % players.length
    useGameStore.setState({ playingUserId: players[index].userId })
  }, [room, players])

  // handle current player
  useEffect(() => {
    const currentPlayer = players.find((p) => {
      return p.userId === user?.id
    })
    useGameStore.setState({ currentPlayer: currentPlayer || null })
  }, [user, players])

  // handle pot
  useEffect(() => {
    let pot = 0
    players.forEach((p) => {
      pot += p.bet!
    })
    useGameStore.setState({ pot })
  }, [players])

  // handle real-time players change
  useEffect(() => {
    const onPlayersChange = (players: Player[]) => {
      useGameStore.setState((state) => ({
        players: players || state.players
      }))
    }

    socket.on('players-change', onPlayersChange)

    return () => {
      socket.off('players-change', onPlayersChange)
    }
  }, [])

  // handle real-time room change
  useEffect(() => {
    const onRoomChange = (room: Room) => {
      useGameStore.setState((state) => ({
        room: room || state.room
      }))
    }

    socket.on('room-change', onRoomChange)

    return () => {
      socket.off('room-change', onRoomChange)
    }
  }, [])

  // handle real-time message
  useEffect(() => {
    const onRoomMessage = async (message: string) => {
      toast({
        title: message
      })
    }

    socket.on('room-message', onRoomMessage)

    return () => {
      socket.off('room-message', onRoomMessage)
    }
  }, [])

  // handle emit join room
  // Send clerkId so the server can identify this socket for disconnect/reconnection-grace cleanup,
  // and so a fresh join (e.g. after a refresh) cancels a pending removal.
  useEffect(() => {
    if (user) {
      socket.emit('join-room', { roomId, username: user.username, clerkId: user.clerkId })
    }
  }, [roomId, user])

  // NOTE: we intentionally do NOT emit `leave-room` on `beforeunload`. That permanently deleted the
  // player (forfeiting chips) on every refresh. The server now removes a player only after a
  // reconnection-grace window on socket `disconnect`, so a refresh reconnects and keeps the seat;
  // closing the tab disconnects and is cleaned up after the grace window. The explicit "Leave Room"
  // button (RoomButtons) remains the deliberate exit.

  // handle loading screen
  useEffect(() => {
    if (!room && isLoading) {
      useLoadingScreenStore.getState().showLoading('Is loading the room...')
    } else {
      useLoadingScreenStore.getState().hiddenLoading()
    }
  }, [room, isLoading])

  if (!room) {
    if (!isLoading) {
      return (
        <NoResult
          title='404 - No Poker Room Available – Time for a New Deal!'
          description="🔍 Seems all the tables are full house right now. Don't fold just yet! ✨ Create Your Own Room and invite friends to play. Whether you're a high roller or a casual player, we've got a seat with your name on it. 🃏🍀"
          link='/'
          linkTitle='Return Home'
        />
      )
    } else {
      return null
    }
  }

  return (
    <>
      <RoomButtons />
      <PreGamePlayers />
      <InGameBoard />
    </>
  )
}

export default RoomDetailPage
