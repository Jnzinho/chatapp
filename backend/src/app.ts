import http from 'http';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDatabase } from './database';
import passport from './config/passport';
import { initSocket } from './socket';
import { indexRouter } from './routes/index';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { messagesRouter } from './routes/messages';

const app = express();
const httpServer = http.createServer(app);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

connectDatabase();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

initSocket(httpServer, sessionMiddleware, CORS_ORIGIN);

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
