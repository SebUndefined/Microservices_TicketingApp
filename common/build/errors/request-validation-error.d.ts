import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
/**
 * Request Validation Error rise when an input is unvalid
 */
export declare class RequestValidationError extends CustomError {
    statusCode: number;
    /**
     * @description The list of validation errors
     */
    errors: ValidationError[];
    /**
     * @description Constructor of RequestValidationError
     * @param errors The list of validation errors
     */
    constructor(errors: ValidationError[]);
    serializeErrors(): {
        message: any;
        field: string;
    }[];
}
