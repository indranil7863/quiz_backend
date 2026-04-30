import type { Response, Request } from "express";
import {prisma } from '../lib/prisma.js'
import bcrypt from "bcryptjs";


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

    res.status(200).json({message: "SignIn successful!"})
}

export {Register, SignIn};