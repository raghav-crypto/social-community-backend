import prisma from "../config/prisma";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/ErrorResponse";

export async function createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const { body, title } = req.body;
        const newAnswer = await prisma.question.create({
            data: {
                body,
                title,
                author: { connect: { id: req.user?.id } },
            }
        })

        res.status(200).json({
            success: true,
            data: newAnswer
        })
    } catch (error) {
        next(error)
    }
}
export async function getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
        const questions = await prisma.question.findMany({
        })
        return res.json(questions)
    }
    catch (error) {
        next(error)
    }

}
export async function updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, body, title } = req.body;
        const question = await prisma.question.update({
            where: {
                id
            },
            data: {
                body,
                title
            }
        })
        res.json(question)
    } catch (error) {
        next(error)
    }
}
export async function deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const exist = await prisma.question.findUnique({
            where: {
                id
            }
        })
        if (!exist) return next(new ErrorResponse("Question not found", 404))
        await prisma.question.delete({
            where: {
                id
            },
        })

        res.json({ success: true })
    } catch (error) {
        next(error)
    }
}