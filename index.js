import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './src/routes/user.js';
import mongoose from 'mongoose';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve("./src/views"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

app.get('/', (req, res) => {
    return res.render('home');
});

app.use("/user", userRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});