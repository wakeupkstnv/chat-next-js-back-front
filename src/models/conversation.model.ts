import mongoose, { Document, Model, Schema } from "mongoose";

interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}


const conversationSchema: Schema<IConversation> = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);
const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
