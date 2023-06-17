import { v4 as uuidv4 } from "uuid";

interface FieldError {
  message: string;
  field: string;
}

class ErrorResponse extends Error {
  message: string;
  statusCode: number;
  field?: string;
  uid?: string;
  errorId: string;
  stack?: string;
  errors?: FieldError[];

  constructor(
    message: string,
    statusCode: number = 500,
    field: string = "",
    errors: FieldError[] | FieldError = []
  ) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.field = field;
    this.errorId = uuidv4();
    this.stack = undefined;
    this.uid = undefined;

    if (process.env.MODE === "dev") {
      this.message = this.stack
        ? `${String(message)}\nStack: ${String(this.stack)}`
        : String(message);
    } else {
      if (this.stack && this.statusCode && this.statusCode >= 500) {
        this.stack = `${this.message}\n${this.stack}`;
        this.message = `Internal Server Error ${this.errorId}`;
      } else {
        this.message = String(message);
      }
    }

    this.errors = Array.isArray(errors) ? errors : [errors];
  }
}

export default ErrorResponse;
