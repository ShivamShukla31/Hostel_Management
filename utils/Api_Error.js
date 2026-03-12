class ApiError extends Error {
    constructor(
        message = "Something went wrong",
        statusCode,
        stack = null,
        error = []

    ) {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
        this.error = error;
        this.success = false;
        this.message = message;
        this.data = null;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

}

export {ApiError};