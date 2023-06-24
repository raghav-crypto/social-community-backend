type ExpressRequest = import("express").Request;

interface User {
    id: string;
    role: string;
}
declare module 'express' {
    interface Request {
        user: User;
        select?: Record<string, any>;
    }
}
export declare namespace SocialTypes {
    interface GoogleStrategyOptions {
        clientID: string
        clientSecret: string
        callbackURL: string
    }
    interface UserData {
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
}
