import express from "express";
import { Register, SignIn, verifyAuth, Logout } from "../controllers/authControllers.js";
import checkAuth from "./checkAuth.js";
const router = express.Router();

router.get('/check', verifyAuth);
router.post('/register', Register);
router.post('/signin', SignIn);
router.post('/logout', checkAuth,  Logout); 

export default router;