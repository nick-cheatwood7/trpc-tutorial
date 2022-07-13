import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().max(256, "Max title length is 256"),
    body: z.string().min(10)
});

export const postByIdSchema = z.object({
    id: z.string().uuid()
});

export type CreatePostInput = z.TypeOf<typeof createPostSchema>;
