"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserMobileController_1 = require("../controller/UserMobileController");
const Validations_1 = __importDefault(require("../middlewares/Validations"));
const routesMobile = (0, express_1.Router)();
const userMobileController = new UserMobileController_1.UserMobileController();
const validation = new Validations_1.default();
// Rota para obter todos os usuários móveis
routesMobile.get("/users-mobile", userMobileController.getAllUserMobile);
// Rota para registrar um novo usuário móvel
routesMobile.post("/users-mobile/register", userMobileController.registerUserMobile);
// Rota para login de usuário móvel
routesMobile.post("/users-mobile/login", userMobileController.loginUserMobile);
//Envia o link da pagina para redefinir a senha
routesMobile.post("/users-mobile/forgot-password", userMobileController.forgotPasswordEmail);
//redefine a senha antes do login
routesMobile.post("/users-mobile/reset-password", userMobileController.resetPassword);
//troca a senha
routesMobile.post("/users-mobile/change-password", userMobileController.changePassword);
exports.default = routesMobile;
//# sourceMappingURL=userMobile.routes.js.map