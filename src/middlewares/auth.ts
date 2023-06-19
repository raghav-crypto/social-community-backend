import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";

function isAuth(req: Request, _res: Response, next: NextFunction) {

    if (req.isAuthenticated()) {
        return next();
    }
    return next(new ErrorResponse("Unauthorized", 401));
}
function isAdmin(req: Request, _res: Response, next: NextFunction) {
    if (req.isAuthenticated() && req.user.role === "ADMIN") {
        return next();
    }
    return next(new ErrorResponse("Unauthorized", 401));
}

export { isAdmin, isAuth }