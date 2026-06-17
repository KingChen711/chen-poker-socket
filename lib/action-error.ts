// Turns an error thrown by a game action into a toast description. Game actions attach the server's
// `statusCode`; a 409 is an optimistic-concurrency conflict (the board already refreshed over the
// socket), so it's shown as a soft notice rather than a hard error.
export function describeActionError(error: unknown): { title: string; variant?: 'destructive' } {
  const statusCode = (error as { statusCode?: number })?.statusCode

  if (statusCode === 409) {
    return { title: 'The board changed — please try again.' }
  }

  const message = error instanceof Error && error.message ? error.message : 'Something went wrong!'
  return { title: message, variant: 'destructive' }
}
