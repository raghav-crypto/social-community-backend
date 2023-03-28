import { Router, Response, Request, NextFunction } from "express";
import passport from "passport";
import { UserData } from "src/config/passport";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";

const router = Router();

router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function (err: Error, user: UserData, info: { message: string }) {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message })
        return req.login(user, function (err) {
            if (err) { return res.json({ message: err, success: false }) }
            return res.json({ success: true })
        })
    })(req, res, next);
})

router.post('/logout', async function (req: Request, res: Response, next: NextFunction) {
    req.logout(function (err) {
        if (err) return next(err)
    });
    res.redirect("/");
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
            return res.json({ success: false, message: "User name/email taken" })
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
        return req.login({ id: User.id, role: User.role }, function (err) {
            if (err) {
                console.log(err);
                return res.json({ message: err, success: false })
            }
            return res.json({ success: true })
        });
    } catch (error) {
        console.log(error);
    }
})

export default router;


