import express from 'express';
import UserRouter from './routers/User.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/users', UserRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});