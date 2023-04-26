import { Router } from "express";
import * as QuestionController from "../controllers/question";
import { isAuth } from "../middlewares/auth";
const router = Router();

router.post('/', isAuth, QuestionController.createQuestion)
router.get('/', QuestionController.getQuestions)
router.put('/', QuestionController.updateQuestion)
router.delete('/:id', QuestionController.deleteQuestion)

export default router;