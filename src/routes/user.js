import express from 'express';
import User from '../models/user.js';
const router = express.Router();


router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.matchPassword(email, password); 
   
    return res.redirect('/');
}); 

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({ fullName, email, password });
        return res.redirect('/');
    } catch (error) {
        return res.status(400).send(error);
    }
    });

export default router;