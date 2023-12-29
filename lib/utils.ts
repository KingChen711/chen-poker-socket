import { CardImage } from '@/constants/deck'
import { Card, Player } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { getPlaiceholder } from 'plaiceholder'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// chatgpt
export function generateRoomCode() {
  // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal)
  const randomDecimal = Math.floor(Math.random() * 16777215)

  // Convert the decimal number to hexadecimal and pad with zeros if needed
  const hexCode = randomDecimal.toString(16).padStart(6, '0')

  return hexCode.toUpperCase()
}

export function drawCard(deck: Card[], numberOfCards: number): Card[] {
  // Check if the deck has enough cards
  if (numberOfCards > deck.length) {
    throw new Error('Not enough cards in the deck')
  }

  // Shuffle the deck to get a random order of cards
  const shuffledDeck = shuffleDeck(deck)

  // Draw the specified number of cards from the shuffled deck
  const drawnCards = shuffledDeck.splice(0, numberOfCards)

  return drawnCards
}

function shuffleDeck(deck: Card[]): Card[] {
  // Implementation of Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

export function getCardImage(card: Card) {
  return CardImage.get(JSON.stringify({ value: card.value, suit: card.suit }))
}

export function isWinnerCard(winner: Player, card: Card) {
  const winnerCards = winner.hand?.pokerCards?.map((card) => {
    return JSON.stringify({ value: card.value, suit: card.suit })
  })
  const checkedCard = JSON.stringify({ value: card.value, suit: card.suit })

  return winnerCards?.includes(checkedCard)
}

export function getPlayerPosition(index: number, amountOfPlayers: number, chip = false) {
  const angle = Math.PI * (1 / 2 - (2 * index) / amountOfPlayers)

  let x = 0.5 * (Math.cos(angle) + 1) * 100
  const y = 0.5 * (1 - Math.sin(angle)) * 100

  if (chip) {
    if (y >= 80) {
      x += 10
    }

    if (y <= 20) {
      x -= 10
    }
  }

  return { x, y }
}

export default async function getBase64(imageUrl: string) {
  try {
    const res = await fetch(imageUrl)

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
    }

    // const buffer = await res.arrayBuffer()

    // const { base64 } = await getPlaiceholder(Buffer.from(buffer))

    // return base64
  } catch (e) {
    if (e instanceof Error) console.log(e.stack)
  }
}
