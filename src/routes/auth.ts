import express from "express"
import * as UserController from "../controllers/auth";
import { isAuth } from "../middlewares/auth";
const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/logout', isAuth, UserController.logout)
router.get('/google', UserController.google)
router.get('/google/callback', UserController.googleCallback)
router.get('/login/failed', UserController.loginFailed)
router.get('/login/success', UserController.loginSuccess)
router.get('/me', isAuth, UserController.me)

export default router;
