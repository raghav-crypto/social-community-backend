import express from 'express'
import passport from 'passport';
import addApiRoutes from './routes';
import session from 'express-session'
import RedisStore from "connect-redis"
import Redis from 'ioredis'
import "./config/passport";

function buildApp(): express.Application {
    const app = express();
    const redis = new Redis();
    const redisStore = new RedisStore({
        client: redis
    })
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(
        session({
            name: 'qid',
            store: redisStore,
            saveUninitialized: false, // recommended: only save session when data exists
            secret: process.env.REDIS_SECRET,
            cookie: {
                // secure: true, // cookie only works in https
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 10 years
                // sameSite: "none", // csrf
            },
            resave: false,
        })
    )

    app.use(passport.initialize())
    app.use(passport.session())

    addApiRoutes(app);

    return app;
}

export default buildApp();