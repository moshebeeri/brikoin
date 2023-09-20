"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_TYPE_UNKNOWN = 1;
exports.ERROR_TYPE_INPUT = 2;
exports.ERROR_TYPE_PARSE = 3;
exports.ERROR_VERIFY_SIGNATURE = 4;
class SignPdfError extends Error {
    constructor(msg, type = exports.ERROR_TYPE_UNKNOWN) {
        super(msg);
        this.type = type;
    }
}
exports.default = SignPdfError;
//# sourceMappingURL=SignPdfError.js.map