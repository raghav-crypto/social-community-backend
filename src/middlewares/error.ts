import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";

async function Errorhandler(err: ErrorResponse, _req: Request, res: Response, _next: NextFunction) {
    console.log(err);
    let error = { ...err }

    if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                error = new ErrorResponse("Duplicate value", 400, err.field)
                break
            case 'P2025':
                error = new ErrorResponse("Resource Not found", 400, err.field)
                break
            default:
                error = new ErrorResponse("An error occured while processing your request", 400, err.field)
        }
    }
    return res.status(error.statusCode || 500).json({
        errors: [{ field: error.field, message: error.message }],
        success: false,
    });
}

export default Errorhandler;