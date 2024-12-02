"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const Yup = __importStar(require("yup"));
const yup_1 = require("yup");
var UserSchema;
(function (UserSchema) {
    UserSchema.create = (0, yup_1.object)().shape({
        name: Yup.string()
            .required('O nome é obrigatório')
            .min(3, 'O nome deve ter pelo menos 3 caracteres')
            .max(50, 'O nome pode ter no máximo 50 caracteres'),
        email: Yup.string()
            .email('O email deve ser um email válido')
            .required('O email é obrigatório'),
        password: Yup.string()
            .required('A senha é obrigatória')
            .min(6, 'A senha deve ter pelo menos 6 caracteres')
            .max(20, 'A senha pode ter no máximo 20 caracteres'),
    });
    UserSchema.update = (0, yup_1.object)().shape({
        name: Yup.string()
            .notRequired()
            .min(3, 'O nome deve ter pelo menos 3 caracteres')
            .max(50, 'O nome pode ter no máximo 50 caracteres')
            .optional(),
        email: Yup.string()
            .email('O email deve ser um email válido')
            .notRequired()
            .optional(),
        password: Yup.string()
            .notRequired()
            .min(6, 'A senha deve ter pelo menos 6 caracteres')
            .max(20, 'A senha pode ter no máximo 20 caracteres')
            .optional(),
    });
})(UserSchema || (exports.UserSchema = UserSchema = {}));
//# sourceMappingURL=userSchema.js.map