import {
    createUserSchema,
    defaultUserResponse,
    loginResponse,
    loginSchema
} from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";

export const userRouter = createRouter()
    .mutation("register", {
        input: createUserSchema,
        output: defaultUserResponse,
        resolve: async ({ input, ctx }) => {
            try {
                const hashedPassword = await bcrypt.hash(input.password, 10);
                await ctx.db.user.create({
                    data: {
                        ...input,
                        email: input.email.toLowerCase(),
                        password: hashedPassword
                    }
                });
                return {
                    message: "User created successfully!",
                    error: false
                };
            } catch (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        throw new trpc.TRPCError({
                            code: "CONFLICT",
                            message: "User already exists"
                        });
                    }
                }
                throw new trpc.TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong"
                });
            }
        }
    })
    .mutation("login", {
        input: loginSchema,
        output: loginResponse,
        resolve: async ({ input, ctx }) => {
            try {
                const user = await ctx.db.user.findUnique({
                    where: { email: input.email.toLowerCase() }
                });
                if (!user)
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Account not found"
                    });
                const isValid = await bcrypt.compare(
                    input.password,
                    user.password
                );
                if (!isValid)
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Invalid credentials"
                    });
                // update last login timestamp
                await ctx.db.user.update({
                    where: { id: user.id },
                    data: { lastLogin: new Date() }
                });
                // create a JWT
                const token = signJwt({
                    id: user.id
                });
                // Send JWT in cookie back to the client
                ctx.res.setHeader(
                    "Set-Cookie",
                    serialize("token", token, { path: "/" })
                );
                return {
                    message: "Logged in successfully!",
                    accessToken: token
                };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong"
                });
            }
        }
    })
    .query("me", {
        resolve: ({ ctx }) => {
            return ctx.user;
        }
    });
