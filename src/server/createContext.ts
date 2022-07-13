import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";

interface CtxUser {
    id: string;
    email: string;
    iat: string;
    exp: number;
}

function getCurrentUser(req: NextApiRequest): CtxUser | null {
    const token = req.cookies.token;
    if (token) {
        try {
            const verified = verifyJwt<CtxUser>(token);
            return verified;
        } catch (error) {
            return null;
        }
    }
    return null;
}

interface ContextInner {
    req: NextApiRequest;
    res: NextApiResponse;
    db: PrismaClient;
}

export const createContext = ({ req, res }: ContextInner) => {
    const user = getCurrentUser(req);
    return { req, res, db: prisma, user };
};

export type Context = ReturnType<typeof createContext>;
