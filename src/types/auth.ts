import type { Request } from "express";

export interface AuthUser {
    id: String;
    email: String;
}

export interface AuthRequest extends Request{
    user?: AuthUser;
}