import type { RequestHandler } from "express";
import { prisma } from '../lib/prisma.js';

export const getUsers :RequestHandler= async (req, res) => {
   const allUsers = await prisma.user.findMany();
   res.json({message: allUsers})
};

export const createUser :RequestHandler= async (req, res) => {
   console.log("hello")
   try {
         const { name, email, password } = req.body;
   const user = await prisma.user.create({
      data: {
         name,
         email,
         password
      }
   })
   console.log(user)
   res.json({message: user});
   } catch (error) {
      console.log(error)
   }

}