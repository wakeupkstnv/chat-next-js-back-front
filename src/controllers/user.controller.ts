
import express from 'express';

import User from "../models/user.model";


export const getUserForSidebar = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUserId = req.user?._id;
    
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId }}).select("-password")

        res.status(200).json(filterUsers);
    
    } catch (error) {
        console.log("Error in getUserForSidebar");
        res.status(500).json({ error: "Internal server error"});
    }
};
