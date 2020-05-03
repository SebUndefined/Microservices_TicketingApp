import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error';

/**
 * Request Validation Error rise when an input is unvalid
 */
export class RequestValidationError extends CustomError {

    public statusCode: number = 400;
    /**
     * @description The list of validation errors
     */
    public errors: ValidationError[];

    /**
     * @description Constructor of RequestValidationError
     * @param errors The list of validation errors
     */
    constructor(errors: ValidationError[]) {
        super('Invalid request parameters');
        this.errors = errors;

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param }
        });
    }
}