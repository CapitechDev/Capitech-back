"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendResponse {
    static success(res, statusCode, message, data) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, statusCode, message) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
}
exports.default = SendResponse;
//# sourceMappingURL=SendResponse.js.map