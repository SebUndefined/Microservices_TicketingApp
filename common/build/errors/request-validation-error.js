"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var custom_error_1 = require("./custom-error");
/**
 * Request Validation Error rise when an input is unvalid
 */
var RequestValidationError = /** @class */ (function (_super) {
    __extends(RequestValidationError, _super);
    /**
     * @description Constructor of RequestValidationError
     * @param errors The list of validation errors
     */
    function RequestValidationError(errors) {
        var _this = _super.call(this, 'Invalid request parameters') || this;
        _this.statusCode = 400;
        _this.errors = errors;
        // Only because we are extending a built in class
        Object.setPrototypeOf(_this, RequestValidationError.prototype);
        return _this;
    }
    RequestValidationError.prototype.serializeErrors = function () {
        return this.errors.map(function (err) {
            return { message: err.msg, field: err.param };
        });
    };
    return RequestValidationError;
}(custom_error_1.CustomError));
exports.RequestValidationError = RequestValidationError;
