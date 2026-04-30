import express from "express";
import { Register, SignIn } from "../controllers/authControllers.js";
const router = express.Router();

router.post('/register', Register);
router.post('/signin', SignIn);

export default router;