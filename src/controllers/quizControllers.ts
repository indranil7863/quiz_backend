import type { Request, Response } from "express"
import {prisma} from '../lib/prisma'
import type { AuthRequest } from "../types/auth";
import type { Question } from "../types/question";


// find quiz with userId & another way to fetch using quizCode for other user
const getQuizData = async (req: AuthRequest , res: Response)=>{
    const userId = req.user?.id as string;
  
    if(!userId)return res.json({message: "Not valid userid"});
    try {
        const quizes = await prisma.quiz.findMany({
        where:{
            userId: userId
        },
        include:{
            questions: true
        }
    })
    res.status(200).json({message: quizes});
    } catch (error) {
        console.log("error: ", error);
        res.status(404).json({message: "Failed to get the data"})
    }

}

// fetch single quiz
const getSingleQuiz = async (req: Request, res: Response) =>{
    const quizId = req.params.id as string;
    if(!quizId)return res.status(404).json({message: "Send a valid quizid"})
    
   try {
     const quiz = await prisma.quiz.findUnique({
        where:{
            id: quizId
        },
        include: {
            questions: true
        }
    })

    res.status(200).json({message: quiz});
   } catch (error) {
    console.log("Error: ",error)
    res.status(400).json({message: "failed to fetch quiz"})
   }

}

const sendQuizId = async (req: AuthRequest, res: Response)=>{
    const code = req.params.id as string;

    try {
        const quizId = await prisma.quiz.findUnique({
            where:{
                quizCode: code
            },
            select:{
                id: true
            }
        })
        if(!quizId)return res.status(400).json({message: "Invalid Code!"})
        res.status(200).json({message: "success", quizId});
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({message: "Internal Server Error"})
    }
}

const createQuiz = async (req: AuthRequest, res: Response)=>{
    const userId = req.user?.id as string;
    const data = req.body;
    console.log({data, userId});
    if(!userId)return res.status(404).json({message: "user not found!"})
    // check the user who want to create the quiz is the same person who send it 

    try {
        
        const quizCreated = await prisma.quiz.create({
        data:{
            title: data.title,
            description: data.description,
            quizCode: data.quizCode,
            userId: userId,
            questions: {
                create: data.questions.map((q: Question) =>({
                    question: q.question,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    duration: q.duration
                }))
            }
        }
    })
    console.log("quizData:", quizCreated);
    res.status(200).json({message: "Quiz created successfully!", data: quizCreated})
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({message: "Unable to create quiz!"});
    }

}

const updateQuiz = async (req: AuthRequest, res: Response)=>{
    const quizId = req.params.id as string;
    const {title, description} = req.body
    const questions = req.body.questions;
 
   try {
    const updatedQuiz = await prisma.quiz.update({
        where: {
            id: quizId,
        },
        data: {
            title: title,
            description: description,
            questions: {
            // Manage every question in the array
            upsert: questions.map((q: Question) => ({
                where: { id: q.id },
                update: {
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                duration: q.duration,
                },
                create: {
                id: q.id, // Manual ID insertion for new records
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                duration: q.duration,
                },
            })),
            // Delete any questions currently in the DB that aren't in this list
            deleteMany: {
                id: {
                notIn: questions.map((q: Question) => q.id),
                },
            },
            },
        },
        });
   
    res.status(200).json({success: true});
   } catch (error) {
        res.status(500).json({success: false});
   }

}
const deleteQuiz = async (req: AuthRequest, res: Response)=>{
    const quizId = req.params.id as string;
    console.log(quizId)
   try {
     const quiz = await prisma.quiz.delete({
        where: {
            id: quizId
        }
    })
    console.log(quiz)
    res.status(200).json({success: true});
   } catch (error) {
     res.status(500).json({success: false});
   }
}

export {getQuizData, createQuiz, updateQuiz, deleteQuiz, getSingleQuiz, sendQuizId};