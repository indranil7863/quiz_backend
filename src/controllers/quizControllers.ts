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
                    isCorrect: q.correctIndex
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
    const quizId = req.body.quiz.id as string;
    const questions = req.body.quiz.questions;
    const existingQustions = questions.filter((q: Question) => q.id);
    const newQuestions = questions.filter((q: Question) => !q.id);

   try {
     const updateQuiz = await prisma.quiz.update({
        where:{
            id: quizId
        },
        data:{
            title: questions.title,
            description: questions.description,
            questions:{
                create: newQuestions.map((q: Question) =>({
                    question: q.question,
                    options: q.options,
                    isCorrect: q.correctIndex
                })),

                update: existingQustions.map((q: Question) =>({
                    where: { id: q.id},
                    data:{
                        question: q.question,
                        options: q.options,
                        isCorrect: q.correctIndex
                    }
                })),

                deleteMany:{
                    id:{
                        notIn: existingQustions.map((q: Question)=> q.id)
                    }
                }

            }
        }   
    })

    res.status(201).json({success: true});
   } catch (error) {
        res.status(500).json({success: false});
   }

}
const deleteQuiz = async (req: AuthRequest, res: Response)=>{
    const quizId = req.params.id as string;

   try {
     const deleteQuiz = await prisma.quiz.delete({
        where: {
            id: quizId
        }
    })
    res.status(200).json({success: true});
   } catch (error) {
     res.status(500).json({success: false});
   }
}

export {getQuizData, createQuiz, updateQuiz, deleteQuiz};