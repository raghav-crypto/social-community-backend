import { NextFunction, Response, Request } from "express";
import { Schema } from "joi";

export function validateBody(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((errorDetail) => ({
                field: errorDetail.path.join('.'),
                message: errorDetail.message,
            }));

            return res.status(400).json({
                errors,
                success: false
            });
        }

        return next();
    };
};
