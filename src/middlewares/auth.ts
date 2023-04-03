import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/ErrorResponse";

function isAuth(req: Request, res: Response, next: NextFunction) {

    if (req.isAuthenticated()) {
        return next();
    }
    return next(new ErrorResponse("Unauthorized", 401));
}
function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated() && req.user.role === "ADMIN") {
        return next();
    }
    return next(new ErrorResponse("Unauthorized", 401));
}

export { isAdmin, isAuth }