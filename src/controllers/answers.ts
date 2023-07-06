import prisma from "../config/prisma";
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from "../utils/errorResponse";

export async function createAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { body } = req.body;
        const ans = await prisma.answer.create({
            data: {
                body,
                author: { connect: { id: req.user.id } },
                question: { connect: { id: req.params.questionId } },
            },
        });
        return res.json({ data: ans, success: true });

    } catch (error) {
        next(error)
    }
}
export async function getAnswers(req: Request, res: Response, next: NextFunction) {
    try {
        const answers = await prisma.answer.findMany({})
        return res.json({ data: answers, success: true })
    } catch (error) {
        next(error)
    }
}
export async function deleteAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { answerId } = req.params;
        const ans = await prisma.answer.findUnique({ where: { id: answerId } });
        if (!ans) {
            return next(new ErrorResponse("Answer not found", 403, "delete answers"))
        }

        if (ans.authorId !== req.user.id) {
            return next(new ErrorResponse("Unauthorized", 403, "delete answers"))
        }
        await prisma.answer.updateMany({
            where: { parentAnswerId: answerId }, data: {
                deleted: true
            }
        })
        await prisma.answer.delete({ where: { id: answerId } });

        return res.json({ success: true });
    } catch (error) {
        next(next)
    }
}
export async function updateAnswer(req: Request, res: Response, next: NextFunction) {
    try {
        const { answerId } = req.params;
        const ans = await prisma.answer.findUnique({ where: { id: answerId } })
        if (ans.authorId !== req.user.id) {
            return next(new ErrorResponse("Unauthorized", 403, "update answers"))
        }
        const newAns = await prisma.answer.update({
            where: {
                id: answerId
            },
            data: {
                ...req.body
            }

        })
        return res.json({ data: newAns, success: true })
    } catch (error) {
        error.field = "update question"
        next(error)
    }
}