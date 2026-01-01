import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> console.log('Database connected'));
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
        console.log(connectionInstance.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // process.exit(1);
    }
}