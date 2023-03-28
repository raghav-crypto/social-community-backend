import express, { Request, Response } from 'express'
const APP_START_TIME = Date.now();


function buildApp(): express.Application {
    const app = express();

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get(
        "/",
        (_: Request, res: Response) => {
            return res.json({ message: "ok", uptime: Date.now() - APP_START_TIME })
        }
    );
    return app;
}

export default buildApp();