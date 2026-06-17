import { useEffect, useState } from 'react'

// Returns whole seconds remaining until `endsAt` (an ISO string from the server's `gameObj.turnEndsAt`),
// recomputed every second. Returns null when there is no active deadline.
export function useCountdown(endsAt: string | null | undefined) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!endsAt) {
      setSecondsLeft(null)
      return
    }

    const end = new Date(endsAt).getTime()
    const tick = () => setSecondsLeft(Math.max(0, Math.ceil((end - Date.now()) / 1000)))

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  return secondsLeft
}
