import express from 'express';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';

export const sendMessage = async (req: express.Request, res: express.Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            timestamp: new Date
        });

        
        console.log(newMessage);
        
        if (newMessage) {conversation.messages.push(newMessage._id as any)};
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(200).send(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMessage = async (req: express.Request, res: express.Response) => {
    try {
        const { id:userToChatId } = req.params;
        const senderId = req.user?._id;
        
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }, 
        }).populate("messages");
        
        if (!conversation) {
            return res.status(404).json({ error: "conversation not found"});
        }

        const messages = conversation?.messages;        

        res.status(200).send(messages);

    } catch (error) {
        res.status(500).json({ error: "getMessage ERROR ISPRAVLYAI NIIGGGA"});
        
    }
}