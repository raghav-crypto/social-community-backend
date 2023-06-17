import { Router } from "express";
import * as QuestionController from "../controllers/question";
import { isAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { createQuestion, updateQuestion } from "../utils/validatingSchema";
const router = Router();
import parseQuery from '../middlewares/parseQuery';


const allowedFields = {
  question: ['id', 'title', 'body', 'categories', 'answers', 'createdAt'],
  author: ['id', 'email', 'name', 'image'],
  categories: ['id', 'name'],
  answers: ['id', 'body', 'question', 'parentAnswer', 'childAnswers'],
};

router.post(
  "/",
  isAuth,
  validateBody(createQuestion),
  QuestionController.createQuestion
);
router.get(
  "/",
  parseQuery(allowedFields, "question"),
  QuestionController.getQuestions
);

router.put(
  "/",
  isAuth,
  validateBody(updateQuestion),
  QuestionController.updateQuestion
);
router.delete("/:id", isAuth, QuestionController.deleteQuestion);
router.put("/vote/:questionId", isAuth, QuestionController.upvoteQuestion);
export default router;
