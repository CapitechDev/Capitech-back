"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponse_1 = __importDefault(require("../utils/SendResponse"));
class Validation {
    validate = (schema) => async (req, res, next) => {
        try {
            const { body } = req;
            await schema.validate(body);
            return next();
        }
        catch (error) {
            console.log(error);
            return SendResponse_1.default.error(res, 500, `${error.errors[0]}`);
        }
    };
}
exports.default = Validation;
//# sourceMappingURL=Validations.js.map