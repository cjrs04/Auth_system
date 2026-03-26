const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validatesSignUpData } = require('../utils/validate');
const authRouter = express.Router() 

//sign up logic

authRouter.post('/signup', async (req, res) => {
    try {
        //validate input data
        validatesSignUpData(req);
        //deconstruct data
        const { firstName, lastName, email, password } = req.body;
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        //hash password
        const passwordHash = await bcrypt.hash(password, 10); //'10' salt rounds
        //create new user
        const userModel = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        //save user to database
        const savedUser = await userModel.save();
        //generate JWT token
        const token = await savedUser.getJWT();
        //jwt in httpOnly cookie
        res.cookie('token', token, {
            expires: new Date(Date.now() + 3600000), //1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' //only send cookie over HTTPS in production
        });
        
        // success response
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        res.status(400).json({ message: error.message || 'server error' });
    }
});

//login logic

authRouter.post('/login', async (req, res) => {
    try {
        //extract email and password
        const { email, password } = req.body;
        //check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: 'no user exists' });
        }
        //validate password
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid){
            //generate JWT token
            const token = await user.getJWT();
            //set JWT in httpOnly cookie
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000), //1 hour
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' //only send cookie over HTTPS in production
            });
            //success
            return res.status(200).json({token, firstName:user.firstName, _id: user._id}); //return user id to frontend
        } else {
            return res.status(400).json({ error: 'invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message || 'server error' }); // use error handling - prevents crashes from invalid data
    }
});

//logout logic

authRouter.post('/logout', (req, res) => {
    try {
        //clear the token cookie
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message || 'server error' });
    }
});

module.exports = authRouter; 