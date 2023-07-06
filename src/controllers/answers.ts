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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const answers = await prisma.answer.findMany({
            where: {
                parentAnswer: null,
                deleted: false,
                questionId: req.params.questionId
            },
            select: {
                ...req.select,
                upvotes: true,
                downvotes: true,
                netVotes: true,
            },
            orderBy: {
                netVotes: "desc"
            },
            skip: (page - 1) * limit,
            take: limit,
        })
        const totalCount = await answers.length;
        const totalPages = Math.ceil(totalCount / limit);
        const response = {
            data: answers,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages,
                totalCount,
            },
        };
        return res.json({ data: response, success: true })
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