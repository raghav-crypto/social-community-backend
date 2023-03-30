import { v4 as uuidv4 } from "uuid";

class ErrorResponse extends Error {
    message: string;
    field?: string;
    statusCode?: number;
    uid?: string;
    errorId: string

    constructor(message: string, statusCode?: number, field?: string, uid?: string, stack?: string) {
        super();
        this.message = message;
        this.field = field
        this.statusCode = statusCode;
        this.errorId = uuidv4();
        this.stack = stack;
        this.uid = uid

        if (process.env.MODE === "dev") {
            this.message = stack
                ? String(message) + "\nStack: " + String(stack)
                : String(message);
        } else {
            if (this.stack && this.statusCode && this.statusCode >= 500) {
                this.stack = this.message + "\n" + this.stack;
                this.message = "Internal Server Error " + this.errorId;
            } else {
                this.message = String(message);
            }
        }
    }
}
export default ErrorResponse;