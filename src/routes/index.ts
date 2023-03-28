const APP_START_TIME: number = Date.now();
import auth from "./auth";
import { Application, Request, Response, Router } from "express";

const API_ROUTE_MAP: { [key: string]: Router } = {
    "/auth": auth
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