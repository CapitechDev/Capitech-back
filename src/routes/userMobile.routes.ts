import { Router } from "express";
import { UserMobileController } from "../controller/UserMobileController";
import Validation from "../middlewares/Validations";

const routesMobile = Router();
const userMobileController = new UserMobileController();
const validation = new Validation();

// Rota para obter todos os usuários móveis
routesMobile.get("/users-mobile", userMobileController.getAllUserMobile);

// Rota para registrar um novo usuário móvel
routesMobile.post(
  "/users-mobile/register",
  userMobileController.registerUserMobile
);

// Rota para login de usuário móvel
routesMobile.post("/users-mobile/login", userMobileController.loginUserMobile);

//Envia o link da pagina para redefinir a senha
routesMobile.post(
  "/users-mobile/forgot-password",
  userMobileController.forgotPasswordEmail
);
//redefine a senha antes do login
routesMobile.post(
  "/users-mobile/reset-password",
  userMobileController.resetPassword
);
//troca a senha
routesMobile.post(
  "/users-mobile/change-password",
  userMobileController.changePassword
);

export default routesMobile;
