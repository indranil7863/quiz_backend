import type { Response, Request } from "express";
import {prisma } from '../lib/prisma.js'
import bcrypt from "bcryptjs";
import type { AuthRequest } from "../types/auth.js";


const verifyAuth = async (req: Request, res: Response)=>{
    const {token} = req.signedCookies;
   
    if(!token){
        return res.status(401).json({authenticated: false});
    }

    return res.status(200).json({authenticated: true});
}


const Register = async (req:Request , res:Response)=>{
    const {name, password, email} = req.body;

    try {
        const userExists = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    if(userExists){
        return res.status(409).json({message: "Email already exists"});
    }
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data:{
            name: name,
            email: email,
            password: hashedPassword
        }
    })
    res.status(201).json({message: user});
    } catch (error) {
        console.log("Error", error)
    }
}

const SignIn = async (req:Request , res: Response)=>{
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    if(!user){
        return res.status(401).json({message: "Unauthorized access!"})
    }

    const isValid = await bcrypt.compare(password, user.password)
    if(!isValid){
        return res.status(401).json({message: "Unauthorized access!"})
    }

    // create cookies to authorize user
    const cookiePayload = JSON.stringify({
        id: user.id,
        expiry: Math.round(Date.now()/1000 + 7 * 24 * 60 * 60)
    })
    const token = Buffer.from(cookiePayload).toString('base64url');
    const storeToken = await prisma.user.update({
        where:{
            email: email
        },
        data:{
            cookie: token
        }
    })
    if(!storeToken){
        throw new Error("Failed to store token!")
        return;
    }
    res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        maxAge: 60 * 1000 * 60 * 24 * 7,
        sameSite: "none",
        domain: '.indranil.shop',
        path:'/',
        secure: true
    })

    res.status(200).json({message: "SignIn successful!"})
    } catch (error) {
        console.log("Error: ", error);
    }
}

const Logout = async (req: AuthRequest, res: Response) =>{
    const {token} = req.signedCookies;
    if(!token)return res.status(404).json({message: "Don't have any token!"})
    const userId = req.user?.id as string;
    try {
        const deleteCookie = await prisma.user.update({
            where:{
                id: userId,
                cookie: token
            },
            data:{
                cookie: null
            }
        })
        if(!deleteCookie)return res.status(400).json({message: "Unable to Logout!"})
        res.clearCookie("token", {
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true
        })
        res.status(200).json({message: "Logged out successfully!"})
    } catch (error) {
        console.log("Error: ", error);
    }
}

export {Register, SignIn, verifyAuth, Logout};