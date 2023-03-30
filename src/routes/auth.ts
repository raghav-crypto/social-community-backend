import { Router, Response, Request, NextFunction } from "express";
import passport from "passport";
import { UserData } from "src/config/passport";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import ErrorResponse from "../utils/errorResponse";

const CLIENT_URL = "http://localhost:3000/";
const router = Router();

router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function (error: Error, user: UserData, info: { message: string }) {
        if (error) return next(error);
        if (!user) next(new ErrorResponse(info.message, 401))
        return req.login(user, function (error) {
            if (error) next(new ErrorResponse("Unale to login", 400))
            return res.json({ success: true })
        })
    })(req, res, next);
})

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", async (error: Error, user: UserData, info: { message: string }) => {
            try {
                if (error) return next(new ErrorResponse(error.message, 400));
                if (!user) {
                    res.status(401);
                    res.send(`<h1>${info.message}</h1>`);
                    return;
                }
                req.login(user, function (error) {
                    if (error) return next(new ErrorResponse(error.message, 401))
                    return res.redirect(CLIENT_URL)
                });
            } catch (error) {
                return next(new ErrorResponse(error.message, 500))
            }
        })(req, res, next)
    }
);
router.get('/logout', function (req: Request, res: Response, next: NextFunction) {
    try {
        req.logout((error) => {
            if (error) return next(new ErrorResponse(error.message, 400));
            return res.json({ success: true })
        });
        return;
    } catch (error) {
        return next(new ErrorResponse(error.message, 500))
    }
})

router.post('/register', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { email, name, password, firstName, lastName } = req.body;

        const doesExist = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        email
                    },
                    {
                        name
                    }
                ]
            },
            select: {
                id: true
            }
        })
        if (doesExist.length) {
            return next(new ErrorResponse("User name/email taken", 400))
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const User = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                name,
                password: hashedPassword
            }
        })
        return req.login({ id: User.id, role: User.role }, function (error) {
            if (error) {
                console.log(error);
                return next(new ErrorResponse("Unable to login.", 500))

            }
            return res.json({ success: true })
        });
    } catch (error) {
        console.log(error);
    }
})
router.get("/login/failed", (_req, _res, next) => {
    return next(new ErrorResponse("Error while loggin", 400))
});
router.get("/login/success", (req, res, next) => {
    if (req.user) {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    }
    return next(new ErrorResponse("Unable to fetch user data."))
});
export default router;


