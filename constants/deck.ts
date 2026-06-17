import { CardSuit, CardValue, Rank } from '@/types'

export const CardImage: Map<string, string> = new Map<string, string>([
  [JSON.stringify({ value: CardValue.Two, suit: CardSuit.Spade }), '/assets/cards/2-spades.jpg'],
  [JSON.stringify({ value: CardValue.Two, suit: CardSuit.Club }), '/assets/cards/2-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Two, suit: CardSuit.Diamond }), '/assets/cards/2-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Two, suit: CardSuit.Heart }), '/assets/cards/2-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Three, suit: CardSuit.Spade }), '/assets/cards/3-spades.jpg'],
  [JSON.stringify({ value: CardValue.Three, suit: CardSuit.Club }), '/assets/cards/3-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Three, suit: CardSuit.Diamond }), '/assets/cards/3-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Three, suit: CardSuit.Heart }), '/assets/cards/3-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Four, suit: CardSuit.Spade }), '/assets/cards/4-spades.jpg'],
  [JSON.stringify({ value: CardValue.Four, suit: CardSuit.Club }), '/assets/cards/4-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Four, suit: CardSuit.Diamond }), '/assets/cards/4-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Four, suit: CardSuit.Heart }), '/assets/cards/4-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Five, suit: CardSuit.Spade }), '/assets/cards/5-spades.jpg'],
  [JSON.stringify({ value: CardValue.Five, suit: CardSuit.Club }), '/assets/cards/5-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Five, suit: CardSuit.Diamond }), '/assets/cards/5-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Five, suit: CardSuit.Heart }), '/assets/cards/5-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Six, suit: CardSuit.Spade }), '/assets/cards/6-spades.jpg'],
  [JSON.stringify({ value: CardValue.Six, suit: CardSuit.Club }), '/assets/cards/6-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Six, suit: CardSuit.Diamond }), '/assets/cards/6-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Six, suit: CardSuit.Heart }), '/assets/cards/6-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Seven, suit: CardSuit.Spade }), '/assets/cards/7-spades.jpg'],
  [JSON.stringify({ value: CardValue.Seven, suit: CardSuit.Club }), '/assets/cards/7-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Seven, suit: CardSuit.Diamond }), '/assets/cards/7-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Seven, suit: CardSuit.Heart }), '/assets/cards/7-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Eight, suit: CardSuit.Spade }), '/assets/cards/8-spades.jpg'],
  [JSON.stringify({ value: CardValue.Eight, suit: CardSuit.Club }), '/assets/cards/8-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Eight, suit: CardSuit.Diamond }), '/assets/cards/8-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Eight, suit: CardSuit.Heart }), '/assets/cards/8-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Nine, suit: CardSuit.Spade }), '/assets/cards/9-spades.jpg'],
  [JSON.stringify({ value: CardValue.Nine, suit: CardSuit.Club }), '/assets/cards/9-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Nine, suit: CardSuit.Diamond }), '/assets/cards/9-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Nine, suit: CardSuit.Heart }), '/assets/cards/9-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Ten, suit: CardSuit.Spade }), '/assets/cards/10-spades.jpg'],
  [JSON.stringify({ value: CardValue.Ten, suit: CardSuit.Club }), '/assets/cards/10-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Ten, suit: CardSuit.Diamond }), '/assets/cards/10-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Ten, suit: CardSuit.Heart }), '/assets/cards/10-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Jack, suit: CardSuit.Spade }), '/assets/cards/jack-spades.jpg'],
  [JSON.stringify({ value: CardValue.Jack, suit: CardSuit.Club }), '/assets/cards/jack-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Jack, suit: CardSuit.Diamond }), '/assets/cards/jack-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Jack, suit: CardSuit.Heart }), '/assets/cards/jack-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Queen, suit: CardSuit.Spade }), '/assets/cards/queen-spades.jpg'],
  [JSON.stringify({ value: CardValue.Queen, suit: CardSuit.Club }), '/assets/cards/queen-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Queen, suit: CardSuit.Diamond }), '/assets/cards/queen-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Queen, suit: CardSuit.Heart }), '/assets/cards/queen-hearts.jpg'],
  [JSON.stringify({ value: CardValue.King, suit: CardSuit.Spade }), '/assets/cards/king-spades.jpg'],
  [JSON.stringify({ value: CardValue.King, suit: CardSuit.Club }), '/assets/cards/king-clubs.jpg'],
  [JSON.stringify({ value: CardValue.King, suit: CardSuit.Diamond }), '/assets/cards/king-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.King, suit: CardSuit.Heart }), '/assets/cards/king-hearts.jpg'],
  [JSON.stringify({ value: CardValue.Ace, suit: CardSuit.Spade }), '/assets/cards/ace-spades.jpg'],
  [JSON.stringify({ value: CardValue.Ace, suit: CardSuit.Club }), '/assets/cards/ace-clubs.jpg'],
  [JSON.stringify({ value: CardValue.Ace, suit: CardSuit.Diamond }), '/assets/cards/ace-diamonds.jpg'],
  [JSON.stringify({ value: CardValue.Ace, suit: CardSuit.Heart }), '/assets/cards/ace-hearts.jpg']
])

export const SmallBlindValue = 1
export const BigBlindValue = 2
export const BalanceValue = 1000

// @ts-ignore
// type TCardRank = { [key: any]: string }

export const CardRank: Map<Rank, string> = new Map([
  [Rank.HighCard, 'High Card'],
  [Rank.OnePair, '1 Pair'],
  [Rank.TwoPair, '2 Pair'],
  [Rank.ThreeOfKind, 'Three Of Kind'],
  [Rank.Straight, 'Straight'],
  [Rank.Flush, 'Flush'],
  [Rank.FullHouse, 'Full House'],
  [Rank.FourOfKind, 'Four Of Kind'],
  [Rank.StraightFlush, 'Straight Flush'],
  [Rank.RoyalFlush, 'Royal Flush']
])

export const denominationToChipImage: Map<string, string> = new Map<string, string>([
  ['1', '/assets/chips/chip-1.png'],
  ['10', '/assets/chips/chip-10.png'],
  ['100', '/assets/chips/chip-100.png'],
  ['500', '/assets/chips/chip-500.png'],
  ['1000', '/assets/chips/chip-1000.png']
])

export const denominationToPosChip: Map<string, string> = new Map<string, string>([
  ['1', 'translate(0%,0%)'],
  ['10', 'translate(45%,0%)'],
  ['100', 'translate(0%,42%)'],
  ['500', 'translate(45%,42%)'],
  ['1000', 'translate(85%,20%)']
])
