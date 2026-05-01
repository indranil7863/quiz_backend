import type { Response, NextFunction } from "express"
import { prisma } from '../lib/prisma'
import type { AuthRequest } from "../types/auth";

const checkAuth = async (req: AuthRequest , res: Response, next: NextFunction)=>{
   const { token } = req.signedCookies;

if (!token) {
  throw new Error("No token");
}

const decodedStr = Buffer.from(token, "base64url").toString();

const data = JSON.parse(decodedStr);

if (data.expiry < Date.now() / 1000) {
  throw new Error("Expired");
}
    

    const user = await prisma.user.findUnique({
        where: {
            id: data.id
        }
    })

    if(!user){
        return res.status(409).json({message: "Unauthroized access!"});
    }
    // add user to req
    req.user = user
    next()
}

export default checkAuth;