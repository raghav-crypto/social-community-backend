import { Router } from "express";
import * as QuestionController from "../controllers/question";
import { isAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { createQuestion, updateQuestion } from "../utils/validatingSchema";
const router = Router();

router.post('/',
    isAuth,
    validateBody(createQuestion),
    QuestionController.createQuestion
)
router.get('/',
    QuestionController.getQuestions
)
router.put('/',
    isAuth,
    validateBody(updateQuestion),
    QuestionController.updateQuestion
)
router.delete('/:id',
    isAuth,
    QuestionController.deleteQuestion
)
export default router;