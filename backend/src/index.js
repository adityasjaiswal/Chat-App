import { connectDB } from './db/index.js';
import dotenv from 'dotenv';
import { server } from './app.js';

dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });