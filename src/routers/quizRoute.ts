import express from 'express'
import { getQuizData, createQuiz, updateQuiz, deleteQuiz } from '../controllers/quizControllers.js';

const router = express.Router();

router.get('/:quiz-id', getQuizData);
router.post('/', createQuiz);
router.patch('/:quiz-id', updateQuiz);
router.delete('/:quiz-id', deleteQuiz);

export default router;