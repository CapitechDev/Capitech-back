"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
dotenv_1.default.config();
class AuthController {
    validateToken(req, res) {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return SendResponse_1.default.error(res, 401, "Token não fornecido.");
        }
        try {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            SendResponse_1.default.success(res, 200, "Token válido");
        }
        catch (error) {
            console.error("🚀 ~ AuthController ~ validateToken ~ error:", error);
            return SendResponse_1.default.error(res, 401, "Token inválido ou expirado.");
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map