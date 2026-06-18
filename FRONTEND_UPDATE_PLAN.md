# Front-End Update Plan — sync with backend changes, fix bugs, improve UX

Context: the server (`../server`) went through a large game-state correctness pass (new `GAME_OVER`
state, optimistic-concurrency `409`s, stricter action validation, a 60s turn timer with
`turnEndsAt`, reconnection-grace on socket `disconnect`, side/split pots, heads-up, etc.). This
document audits the Next.js client for (1) logic that must change to stay consistent with the
backend, (2) genuine front-end bugs, and (3) UI/UX improvements. Each item lists the file(s), the
reason, and a concrete step. Phases are ordered by priority.

## TL;DR — is any FE logic affected?

**Yes.** The betting-button visibility logic itself is still correct (it derives from
`callingValue` / `bet` / `balance`, which are unchanged). But three things are now broken or
missing against the new backend:

1. The client `Room` type has **no `GAME_OVER` state**, and no UI renders it → after a game ends the
   board freezes with stale action buttons and no champion announcement.
2. `join-room` **doesn't send `clerkId`**, so the backend's new disconnect/reconnection-grace
   cleanup can never identify the player → ghost players + a refresh permanently deletes your seat.
3. Raise input and error handling don't reflect the new validation (`409` conflicts, min-raise,
   positive-int) → users get a generic "something went wrong".

Plus two standalone FE bugs and a dead-code poker mirror. Details below.

## Severity legend

- 🔴 **Breaks with the new backend** (wrong/again-stuck UI, lost chips)
- 🟠 **Visible UX problem**
- 🟡 **Minor bug / polish**
- ⚪ **Cleanup**

---

## Phase 1 — Required to stay consistent with the backend (🔴) ✅ DONE

> Implemented and verified with `bun install` + `tsc --noEmit` — all changed files have **0 type
> errors**. 1.1 types, 1.2 `clerkId` on `join-room`, 1.3 `GAME_OVER` rendering (`BetButtons` guard,
> `playingUserId` guard, new `GameOverScreen`), 1.4 removed the `beforeunload` leave.
>
> Caveat: `package.json` pins build tooling to `"latest"` (TypeScript→6, ESLint→flat-config major,
> Tailwind→4) and the lockfile is gitignored, so a fresh install drifts the toolchain. The only `tsc`
> error is a pre-existing `globals.css` side-effect import in untouched `app/layout.tsx` (bare `tsc`
> doesn't load Next's CSS shim; `next build` handles it). A full `next build`/`next lint` will trip on
> that tooling drift, not on this change — worth pinning the dev tooling separately.

### 1.1 Add `GAME_OVER` (and the new gameObj/room/player fields) to the client types

**File:** `types/index.ts`

The server now emits `status: 'GAME_OVER'` and added fields. The client `Room` discriminated union
only knows `PRE_GAME | PRE_FLOP | THE_FLOP | THE_TURN | THE_RIVER | SHOWDOWN`, so every
`status === 'GAME_OVER'` check is a TS error and narrowing is wrong.

Steps:

- Add a `GAME_OVER` arm to the `Room` union: `{ gameObj: GameObj & { winner: string }; status: 'GAME_OVER' }`.
- Add to `GameObj`: `actedPlayers: string[]` and `turnEndsAt: string | null` (ISO string over the wire).
- Add `version: number` to `Room` and `seat: number` to `Player` (keep types in lockstep with the
  schema even if unused today; `turnEndsAt` is needed for 2.1).
- _Acceptance:_ `tsc`/`next lint` pass and `room.status === 'GAME_OVER'` narrows `gameObj` to non-null.

### 1.2 Send `clerkId` on `join-room`

**File:** `app/(root)/rooms/[id]/page.tsx` (the `join-room` emit, ~line 125)

The backend maps `socket → { roomId, clerkId, username }` on `join-room` and uses `clerkId` to (a)
remove the player after the reconnection grace on `disconnect`, and (b) cancel a pending removal when
the same `clerkId` rejoins. Today only `{ roomId, username }` is sent, so none of that works.

Steps:

- Change the emit to `socket.emit('join-room', { roomId, username: user.username, clerkId: user.clerkId })`.
- _Acceptance:_ on a hard refresh, the player is **not** removed (they reconnect within the grace
  window); closing the tab removes them after the grace window.

### 1.3 Render the `GAME_OVER` state

**Files:** `components/room/BetButtons.tsx`, `components/room/ShowdownScreen.tsx` (or a new
`GameOverScreen.tsx`), `app/(root)/rooms/[id]/page.tsx`

After the table ends, the backend keeps `gameObj.winner` and sets `GAME_OVER`. Currently:

- `BetButtons` only returns `null` for `SHOWDOWN`, so in `GAME_OVER` it can still show
  Call/Check/Raise/Fold/All-in to whoever `turn % length` points at (clicking → backend `400`).
- `ShowdownScreen` returns `null` unless `SHOWDOWN`, so **no champion is announced** in `GAME_OVER`.
- The `playingUserId` effect computes `turn % players.length` for any non-`PRE_GAME` status, so a
  stale "current player" is set during `GAME_OVER`.

Steps:

- `BetButtons`: bail out for `SHOWDOWN` **and** `GAME_OVER` (or simply `if (gameStore.winner) return null`).
- `playingUserId` effect: treat `GAME_OVER` like a terminal state — clear `playingUserId` (extend the
  existing `status === 'PRE_GAME'` guard to also cover `GAME_OVER`).
- Add a game-over overlay: "🏆 {champion} wins the game!" with **Leave room / Back home** (no
  "Continue" — there is no next match). Reuse `ShowdownScreen`'s layout; branch on
  `status === 'GAME_OVER'`.
- _Acceptance:_ when the table busts down to one player, the board shows the champion and offers exit,
  with no betting buttons and no "Continue".

### 1.4 Stop deleting the player on refresh — rely on the disconnect grace

**File:** `app/(root)/rooms/[id]/page.tsx` (the `beforeunload` handler, ~lines 130-146)

`beforeunload` fires on refresh/navigation/close and emits `leave-room`, which **permanently deletes
the player** (and forfeits their chips). With the backend's new 20s reconnection grace (enabled by
1.2), a refresh should keep the seat.

Steps:

- Remove the `beforeunload` → `leave-room` emit (let socket `disconnect` + grace handle it). The
  explicit **Leave Room** button (`RoomButtons`, HTTP `leaveRoom`) remains the deliberate exit.
- _Acceptance:_ refresh keeps your seat/chips; closing the tab removes you after the grace window.
- _Note:_ depends on 1.2; without `clerkId` the grace can't identify the player.

---

## Phase 2 — UX tied to new backend behavior (🟠) ✅ DONE

> Implemented and type-checked (0 TS errors in changed files). New `hooks/useCountdown.ts` and
> `lib/action-error.ts`; `lib/_actions/game.ts` refactored to one helper that carries the server's
> `message` + `statusCode`. **2.1** turn countdown in `BetButtons` (active player) and ready-deadline
> countdown in `ShowdownScreen`. **2.2** raise dialog enforces positive-int / `≥ BigBlindValue` /
> affordable with inline hints. **2.3** real backend error messages surfaced; `409` shown as a soft
> "board changed — try again". **2.4** `pending` flag disables action buttons mid-request.

### 2.1 Turn countdown (the backend auto-acts after 60s)

**Files:** `types/index.ts` (done in 1.1), a small `TurnTimer` UI, used in `BetButtons` / `PlayerBox`

The server auto-checks/folds the active player at `gameObj.turnEndsAt` and auto-advances the
showdown ready phase. Players currently get **no warning** before being auto-folded.

Steps:

- Read `gameObj.turnEndsAt`; render a countdown (ring or seconds) for the active player (and a
  "starting next hand in N…" at `SHOWDOWN`). Recompute from `Date(turnEndsAt) - now` on an interval.
- Optional: when it's _your_ turn and time is low, visually emphasize the action buttons.
- _Acceptance:_ the active player sees the remaining time and understands the auto-action.

### 2.2 Match the raise dialog to backend validation

**File:** `components/room/BetButtons.tsx` (raise dialog) + import `BigBlindValue` from `constants/deck.ts`

Backend `raiseBet` now requires `raiseValue` to be a **positive integer**, **≥ BigBlindValue**
(min-raise), and affordable. The dialog only checks affordability, so `0`, negatives, or decimals
pass client-side and then `400` on the server.

Steps:

- Constrain the input: `min={BigBlindValue}`, `step={1}`, reject non-integers/≤0.
- Disable **Bet** unless `Number.isInteger(raiseValue) && raiseValue >= BigBlindValue` _and_ the
  existing affordability check holds; show an inline hint ("Minimum raise is {BigBlindValue}").
- _Acceptance:_ you cannot submit a raise the server would reject; hints explain why.

### 2.3 Surface backend messages and handle `409` gracefully

**Files:** `lib/_actions/game.ts`, `components/room/BetButtons.tsx`, `components/room/ShowdownScreen.tsx`

Every game action throws a bare `new Error()` and the UI shows "Some thing went wrong!". The backend
returns `{ statusCode, message }` (e.g. _"You cannot check while facing a bet"_, _"The minimum raise
is 2"_, _"The game state changed, please retry."_ for `409`).

Steps:

- In `lib/_actions/game.ts`, throw `new Error(data.message)` on non-200 (carry the server message).
- In handlers, show `error.message` in the toast. For the `409` conflict, prefer a soft notice
  ("The board changed — try again") or suppress it (the socket re-emit already refreshes state).
- _Acceptance:_ action failures explain themselves; a lost optimistic-concurrency race isn't shown as
  a hard error.

### 2.4 Disable action buttons while a request is in flight

**File:** `components/room/BetButtons.tsx`, `components/room/ShowdownScreen.tsx`

Buttons aren't disabled during the async call, so a double-click fires two requests (the backend now
no-ops the second via the version claim, but it surfaces as a `409`).

Steps: add a local `pending` flag; disable buttons while awaiting. _Acceptance:_ no duplicate
requests / spurious conflict toasts from double-clicks.

---

## Phase 3 — Standalone front-end bugs (🟡) ✅ DONE

> Verified complete. 3.1 `PlayerBox` second hole card now keys its winner highlight off
> `holeCards[1]`. 3.2 `CardRank` maps `RoyalFlush → 'Royal Flush'`. Typecheck clean.

### 3.1 Winner highlight on the 2nd hole card checks the wrong card

**File:** `components/room/PlayerBox.tsx` (~line 91)

The second card's highlight uses `isWinnerCard(winner, player.hand.holeCards[0])` — it should be
`holeCards[1]`. The first card (line 74) is correct. Result: the glow on the second hole card tracks
the first card.

Step: change `holeCards[0]` → `holeCards[1]` on the second-card `className`. _Acceptance:_ both
winning hole cards highlight correctly.

### 3.2 Royal flush is labeled "Straight Flush"

**File:** `constants/deck.ts` (`CardRank`, ~line 146)

`[Rank.RoyalFlush, 'Straight Flush']` — a royal flush (server can emit `rank = RoyalFlush`) shows as
"Straight Flush".

Step: map `Rank.RoyalFlush` → `'Royal Flush'`. _Acceptance:_ a royal flush is named correctly at
showdown.

---

## Phase 4 — Cleanup (⚪) ✅ DONE

> Verified complete (deleted, not ported). The unused `lib/poker/*` mirror plus `CardValueToBigInt`,
> the client `deck`, and `drawCard`/`shuffleDeck` are removed; no dangling references remain and the
> empty `lib/poker` directory was cleaned up. Bonus: the dev toolchain that was pinned to `"latest"`
> (TS→6 drift) is now on TypeScript 5.9.3, so a plain `tsc --noEmit` is clean.

### 4.1 The client `lib/poker/*` mirror is dead code with the bugs we just fixed server-side

**Files:** `lib/poker/*`, `constants/deck.ts` (`CardValueToBigInt`, `deck`), `lib/utils.ts`
(`drawCard`, `shuffleDeck`)

No component imports `assignRankHand`/`compareHand`; ranks and winners come from the server, and
`isWinnerCard` only compares card identity. So the mirror **does not run** — but it still contains the
exact bugs fixed on the backend (`compareHand` suit tiebreak, `CardValueToBigInt` King/Queen swap,
no-wheel `checkStraight`, no-steel-wheel straight flush). Leaving it invites someone to "reuse" buggy
logic later.

Steps (pick one):

- **Recommended:** delete the unused mirror (`lib/poker/*`, `CardValueToBigInt`, client `deck`,
  `drawCard`/`shuffleDeck`) — the server is authoritative.
- _Or_ keep it and port the server fixes (value-only `compareHand`, drop `CardValueToBigInt`, Ace-low
  wheel in `check-straight` and `check-royal-or-straight-flush`).
- _Acceptance:_ no dead, contradictory poker logic in the client.

---

## Phase 5 — UI/UX polish (🟡 / nice-to-have) ✅ DONE (with noted deferrals)

> Implemented and type-checked. Done:
>
> - ✅ **Amount-to-call** label in `BetButtons` (shows `To call: $X` on your turn when facing a bet),
>   alongside the Phase-2 turn countdown; the `showStand` ring remains the active-player indicator.
> - ✅ **Status badges** on `PlayerBox`: an **All in** pill (destructive color) and a **Check** pill,
>   sourced from `gameObj.allInPlayers` / `gameObj.checkingPlayers` (folded already shows "Fold").
>   Threaded through `InGameBoard`.
> - ✅ **Pre-game lobby** (`PreGamePlayers`): "Waiting for players to join…", a "share room code {code}"
>   line, and a live player count.
> - ✅ **Start Game UX** (`RoomButtons`): disabled with a "Need at least 2 players" hint until ≥2
>   players, plus a loading spinner while starting.
> - ✅ **Copy**: the "Some thing went wrong!" typos are already gone (Phase 2 replaced action toasts
>   with `describeActionError`).
>
> Deferred / not code-changed:
>
> - **Split-pot announcement** — needs the backend to emit `winners[]`; today only a single headline
>   `winner` is sent, and detecting a chop client-side would be a fragile balance-diff heuristic. Left
>   for a backend follow-up.
> - **Heads-up layout** — `getPlayerPosition` already lays out 2 players (+1 button slot); this is a
>   visual-only check best done by running the app, no code change made.
> - **"Play again"** — already handled: `GameOverScreen` (Phase 1.3) routes cleanly home via "Back
>   home". A true rematch still needs a backend reset endpoint (clear `gameObj` → `PRE_GAME`).

---

## Suggested order of execution

1. **1.1 → 1.2 → 1.3 → 1.4** (correctness with the new backend; do as one PR — they interlock).
2. **2.1 + 2.3** (countdown + real error messages — biggest UX wins).
3. **2.2 + 2.4** (raise validation + pending states).
4. **3.1 + 3.2** (quick bug fixes — tiny, ship anytime).
5. **4.1** (delete dead mirror).
6. **Phase 5** polish as time allows.

## Out of scope / product decisions

- A "play again" flow needs a backend reset (clear `gameObj`, `PRE_GAME`).
- Split-pot announcement needs a backend `winners[]` (only a single `winner` is emitted today).
- `clerkId`-on-`join-room` is the only hard client contract the backend relies on (1.2).
