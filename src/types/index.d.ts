import { Request } from "express";

declare namespace SocialTypes {
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
declare global {
    namespace Express {
        export interface User {
            id: string;
            role: string;
        }
    }
    interface SocialRequest extends Request {
        select?: Record<string, any>;
    }
}
