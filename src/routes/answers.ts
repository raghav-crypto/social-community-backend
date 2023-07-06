import express from "express";
import * as AnswerController from "../controllers/answers";
import { isAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { createAnswer, updateAnswer } from "../utils/validatingSchema";
const router = express.Router();


router.post("/:questionId", isAuth, validateBody(createAnswer), AnswerController.createAnswer)
router.get("/:questionId", isAuth, AnswerController.getAnswers)
router.put("/:answerId", isAuth, validateBody(updateAnswer), AnswerController.updateAnswer)
router.delete("/:answerId", isAuth, AnswerController.deleteAnswer)
export default router;