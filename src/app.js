import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import limiter from './Middlewares/Ratelimiter.middleware.js';
import userRoutes from './Routes/User.routes.js';
import ContentRoutes from './Routes/Content.routes.js';
import ProfileRoutes from './Routes/Profile.routes.js';

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use('/api/v2/user', userRoutes);
app.use('/api/v2/content', ContentRoutes);
app.use('/api/v2/profile', ProfileRoutes);


export default app;