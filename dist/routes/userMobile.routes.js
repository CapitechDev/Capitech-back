"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserMobileController_1 = require("../controller/UserMobileController");
const AuthorizationMobile_1 = require("../middlewares/AuthorizationMobile");
const Validations_1 = __importDefault(require("../middlewares/Validations"));
const routesMobile = (0, express_1.Router)();
const userMobileController = new UserMobileController_1.UserMobileController();
const validation = new Validations_1.default();
// Rota para obter todos os usuários móveis
routesMobile.get("/users-mobile", (req, res) => userMobileController.getAllUserMobile(req, res));
// Rota para registrar um novo usuário móvel
routesMobile.post("/users-mobile/register", (req, res) => userMobileController.registerUserMobile(req, res));
// Rota para login de usuário móvel
routesMobile.post("/users-mobile/login", (req, res) => userMobileController.loginUserMobile(req, res));
//Envia o link da pagina para redefinir a senha
routesMobile.post("/users-mobile/forgot-password", (req, res) => userMobileController.forgotPasswordEmail(req, res));
//redefine a senha antes do login
routesMobile.post("/users-mobile/reset-password", (req, res) => userMobileController.resetPassword(req, res));
//troca a senha
routesMobile.post("/users-mobile/change-password", AuthorizationMobile_1.ensureAuthenticate, (req, res) => userMobileController.changePassword(req, res));
exports.default = routesMobile;
//# sourceMappingURL=userMobile.routes.js.map