import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken';
import { url } from 'inspector';

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        console.log('Signup request body:', req.body);

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const existingUser = await User.findOne({ username }).exec();
        console.log('Existing user:', existingUser);

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        

        let url = `https://ui-avatars.com/api/?name=G+G`;

        if (fullName.split(' ').length == 1){
            const first_letter = fullName.split(" ")[0][0];
            const last_letter = fullName.split(" ")[0][1];
            url = `https://ui-avatars.com/api/?name=${first_letter}+${last_letter}`
        }
        else{
            const first_letter = fullName.split(" ")[0][0];
            const last_letter = fullName.split(" ")[1][1];
            url = `https://ui-avatars.com/api/?name=${first_letter}+${last_letter}`
        }
        


        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: url
        });

        console.log('New user to be saved:', newUser);

        await newUser.save();
        await generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        console.log('Login request body:', req.body);

        const user = await User.findOne({ username }).exec();
        console.log('Found user:', user);

        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Is password correct:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        await generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "logout successfully"});    
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};