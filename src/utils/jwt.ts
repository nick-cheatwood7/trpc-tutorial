import jwt from "jsonwebtoken";

const SECRET = process.env.TOKEN_SECRET || "changeme";

export function signJwt(data: object) {
    return jwt.sign(data, SECRET, { expiresIn: "7d" });
}

export function verifyJwt<T>(token: string) {
    return jwt.verify(token, SECRET) as T;
}
