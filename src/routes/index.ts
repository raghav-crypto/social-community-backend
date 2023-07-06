const APP_START_TIME: number = Date.now();
import auth from "./auth";
import questions from "./question";
import answers from "./answers";
import { Application, Request, Response, Router } from "express";

const API_ROUTE_MAP: { [key: string]: Router } = {
    "/auth": auth,
    "/question": questions,
    "/answer": answers,
}

function addApiRoutes(app: Application): void {
    Object.keys(API_ROUTE_MAP).forEach(route => {
        const apiRoute: string = `${route}`;
        app.use(apiRoute, API_ROUTE_MAP[route]);
    });
    app.get(
        "/",
        (_: Request, res: Response): Response => {
            return res.json({ message: "ok", uptime: Date.now() - APP_START_TIME })
        }
    );
}

export default addApiRoutes;