export async function getUserByClerkId(clerkId: string) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/get-by-clerk-id?clerkId=${clerkId}`).then(
    (response) => response.json()
  )
  return data.user
}

export async function getUserById(id: string) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`).then((response) => response.json())
  return data.user
}
