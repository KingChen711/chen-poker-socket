import z from 'zod'

export const CreateUserSchema = z.object({
  body: z.object({
    clerkId: z.coerce.string().trim().min(1),
    email: z.coerce.string().trim().email(),
    name: z.coerce.string().trim().min(1),
    picture: z.coerce.string().trim().url(),
    username: z.coerce.string().trim().min(1)
  })
})

export type TCreateUserSchema = z.infer<typeof CreateUserSchema>
