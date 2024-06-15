
import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI || '/mongodb://localhost');
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

export default connectToMongoDB;