import { TRPCError } from "@trpc/server";
import { createPostSchema, postByIdSchema } from "../../schema/post.schema";
import { createRouter } from "../createRouter";

export const postRouter = createRouter()
    .mutation("createPost", {
        input: createPostSchema,
        resolve: async ({ input, ctx }) => {
            if (!ctx.user) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You must be logged in to create Posts"
                });
            }
            const post = await ctx.db.post.create({
                data: {
                    ...input,
                    user: {
                        connect: {
                            id: ctx.user.id
                        }
                    }
                }
            });
            return post;
        }
    })
    .query("posts", {
        resolve: async ({ ctx }) => {
            return ctx.db.post.findMany();
        }
    })
    .query("postById", {
        input: postByIdSchema,
        resolve: async ({ input, ctx }) => {
            return ctx.db.post.findUnique({
                where: {
                    id: input.id
                }
            });
        }
    });
