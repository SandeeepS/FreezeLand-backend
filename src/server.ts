import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();
const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Allow this origin
    credentials: true // Allow credentials
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-app';

(async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to the database');
    }catch(error) {
        console.error(error);
    }
})();
 
app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});

app.use('/api',userRoutes);
app.use('/api/admin',adminRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});