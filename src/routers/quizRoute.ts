import express from 'express'
import { getQuizData, createQuiz, updateQuiz, deleteQuiz, getSingleQuiz, sendQuizId } from '../controllers/quizControllers.js';

const router = express.Router();

router.get('/', getQuizData);
router.get('/:id', getSingleQuiz);
router.post('/verify/:id', sendQuizId);
router.post('/', createQuiz);
router.patch('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

export default router;