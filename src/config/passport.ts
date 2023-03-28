import prisma from "../config/prisma";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
export interface UserData {
    id: string;
    role: string;
}
passport.use(
    new LocalStrategy(
        { usernameField: 'identifier', passwordField: 'password' },
        async function (identifier: string, password: string, done: any) {
            const User = await prisma.user.findFirst({
                where: {
                    email: identifier,
                },
            });
            if (!User) {
                return done(false, '', { message: 'Invalid credentials' });
            }
            const isValid = User.password && bcrypt.compare(password, User.password)
            if (isValid) {
                return done(null, { id: User.id, role: User.role });
            } else {
                return done(null, false);
            }
        }
    )
);


passport.serializeUser<UserData, any>((userData: UserData, done: any) => {
    done(null, userData);
});

passport.deserializeUser(async (userData: UserData, done: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userData.id },
        });
        const userWithRole = { ...user, role: userData.role };
        done(null, userWithRole);
    } catch (error) {
        console.log(error);
        done(error, null);
    }
});