import type { Response, NextFunction } from "express"
import { prisma } from '../lib/prisma.js'
import type { AuthRequest } from "../types/auth.js";

const checkAuth = async (req: AuthRequest , res: Response, next: NextFunction)=>{
   const { token } = req.signedCookies;

if (!token) {
    return res.status(401).json({message: "Unauthroized access!"});
}

const decodedStr = Buffer.from(token, "base64url").toString();

const data = JSON.parse(decodedStr);

if (data.expiry < Date.now() / 1000) {
    return res.status(400).json({message: "please login!"})
}
const user = await prisma.user.findUnique({
        where: {
            id: data.id,
            cookie: token,
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