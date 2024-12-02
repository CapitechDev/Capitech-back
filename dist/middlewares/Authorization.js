"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticate = ensureAuthenticate;
const jsonwebtoken_1 = require("jsonwebtoken");
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
const secretKey = process.env.JWT_SECRET;
function ensureAuthenticate(req, res, next) {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) {
            return SendResponse_1.default.error(res, 401, 'Token inválido!');
        }
        const [isBearer, token] = authToken.split(' ');
        if (isBearer !== 'Bearer') {
            return SendResponse_1.default.error(res, 401, 'Token inválido!');
        }
        (0, jsonwebtoken_1.verify)(token, secretKey);
        return next();
    }
    catch (err) {
        return SendResponse_1.default.error(res, 401, 'Token inválido !');
    }
}
//# sourceMappingURL=Authorization.js.map