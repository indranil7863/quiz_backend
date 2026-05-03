import express from 'express';
import  cors from 'cors'
import { config } from 'dotenv';
import UserRouter from './routers/User.js';
import authRoute from './routers/authRoute.js'
import quizRoute from './routers/quizRoute.js'
import checkAuth from './routers/checkAuth.js'
import cookieParser from 'cookie-parser'

config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: "https://quiz-app-one-kappa-75.vercel.app",
    credentials: true
}))
console.log("request")
app.use(cookieParser("my-secret"));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/users', UserRouter);
app.use('/auth', authRoute);
app.use('/quiz',checkAuth, quizRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});