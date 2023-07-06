import prisma from "../config/prisma";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";

export async function createQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { body, title } = req.body;
    const newAnswer = await prisma.question.create({
      data: {
        body,
        title,
        author: { connect: { id: req.user?.id } },
      },
    });

    res.status(200).json({
      success: true,
      data: newAnswer,
    });
  } catch (error) {
    next(error);
  }
}
export async function getQuestions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const questions = await prisma.question.findMany({
      select: {
        ...req.select,
        upvotes: true,
        downvotes: true,
        netVotes: true,
        _count: {
          select: {
            answers: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        netVotes: "desc",
      },

    });
    const totalCount = await questions.length;
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      data: questions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages,
        totalCount,
      },
    };
    res.json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
}


export async function updateQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, body, title } = req.body;
    const exist = await prisma.question.findUnique({
      where: {
        id,
      },
    });
    if (!exist) return next(new ErrorResponse("Question not found", 404));
    if (exist.authorId !== req.user?.id)
      return next(
        new ErrorResponse("You are not authorized to update this question", 401)
      );
    const question = await prisma.question.update({
      where: {
        id,
      },
      data: {
        body,
        title,
      },
    });
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
}
export async function deleteQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const exist = await prisma.question.findUnique({
      where: {
        id,
      },
    });
    if (!exist) return next(new ErrorResponse("Question not found", 404));
    if (exist.authorId !== req.user?.id)
      return next(
        new ErrorResponse("You are not authorized to delete this question", 401)
      );
    await prisma.question.delete({
      where: {
        id,
      },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function upvoteQuestion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { questionId } = req.params;
    const userId = req.user?.id;
    const result = await prisma.$transaction(async (prisma) => {
      const alreadyVoted = await prisma.questionVote.findFirst({
        where: {
          questionId: questionId,
          userId,
        },
      });
      if (alreadyVoted) {
        if (alreadyVoted.value === 1) {
          // switch from upvote to downvote
          await prisma.questionVote.update({
            where: {
              id: alreadyVoted.id,
            },
            data: {
              value: -1,
            },
          });

          await prisma.question.update({
            where: { id: questionId },
            data: {
              upvotes: {
                decrement: 1,
              },
              downvotes: {
                increment: 1,
              },
              netVotes: {
                decrement: 2,
              },
            },
          });
          return { success: true, message: "Downvoted!" };
        } else if (alreadyVoted.value === -1) {
          // switch from downvote to upvote
          try {
            await prisma.questionVote.update({
              where: {
                id: alreadyVoted.id,
              },
              data: {
                value: 1,
              },
            });
            await prisma.question.update({
              where: { id: questionId },
              data: {
                upvotes: {
                  increment: 1,
                },
                downvotes: {
                  decrement: 1,
                },
                netVotes: {
                  increment: 2,
                },
              },
            });
            return { success: true, message: "Upvoted!" };
          } catch (error) {
            console.log(error);
            return { success: false, message: "Unable to vote" };
          }
        }
      } else {
        try {
          await prisma.questionVote.create({
            data: {
              user: { connect: { id: userId } },
              question: { connect: { id: questionId } },
              value: 1,
            },
          });
          await prisma.question.update({
            where: { id: questionId },
            data: {
              upvotes: {
                increment: 1,
              },
              netVotes: {
                increment: 1,
              },
            },
          });
          return { success: true, message: "Upvoted!" };
        } catch (error) {
          console.log(error);
          return { success: false, message: "Unable to vote" };
        }
      }
    });
    if (!result?.success) {
      return next(new ErrorResponse(result!.message, 400, "upvote question"));
    }
    return res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
}
