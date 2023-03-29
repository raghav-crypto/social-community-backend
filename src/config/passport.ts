import prisma from "../config/prisma";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import bcrypt from "bcrypt";
import { User } from ".prisma/client";

interface GoogleStrategyOptions {
    clientID: string
    clientSecret: string
    callbackURL: string
}
export interface UserData {
    id: string;
    role: string;
}
interface NewUser {
    firstName?: string;
    lastName?: string;
    email: string;
    image?: string;
    googleId: string;
    name: string;
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
const Options: GoogleStrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
}
passport.use(new GoogleStrategy(Options, async function (accessToken, refreshToken, profile, done) {

    const name = profile.displayName.split(" ")
    const firstName = name[0];
    const lastName = name[1];
    try {
        const User = await prisma.user.findFirst({ where: { googleId: profile.id } })
        if (User) {
            done(null, { id: User.id, role: User.role })
        } else {

            let userData: NewUser = {
                email: "",
                googleId: profile.id,
                name: profile.displayName,
            };
            if (firstName) userData.firstName = firstName;
            if (lastName) userData.lastName = lastName;
            if (profile._json.email) userData.email = profile._json.email;
            if (profile._json.picture) userData.image = profile._json.picture;


            const newUser: User = await prisma.user.create({
                data: userData,
            });
            done(null, { id: newUser.id, role: newUser.role });
        }
    } catch (err) {
        console.log(err);
    }
}))

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