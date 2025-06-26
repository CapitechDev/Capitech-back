import { Router, Request, Response } from "express";
import { UserMobileController } from "../controller/UserMobileController";
import { ensureAuthenticate } from "../middlewares/AuthorizationMobile";
import Validation from "../middlewares/Validations";

const routesMobile = Router();
const userMobileController = new UserMobileController();
const validation = new Validation();

// Rota para obter todos os usuários móveis
routesMobile.get("/users-mobile", (req: Request, res: Response) => userMobileController.getAllUserMobile(req, res));

// Rota para registrar um novo usuário móvel
routesMobile.post(
  "/users-mobile/register",
  (req: Request, res: Response) => userMobileController.registerUserMobile(req, res)
);

// Rota para login de usuário móvel
routesMobile.post("/users-mobile/login", (req: Request, res: Response) => userMobileController.loginUserMobile(req, res));

//Envia o link da pagina para redefinir a senha
routesMobile.post(
  "/users-mobile/forgot-password",
  (req: Request, res: Response) => userMobileController.forgotPasswordEmail(req, res)
);
//redefine a senha antes do login
routesMobile.post(
  "/users-mobile/reset-password",
  (req: Request, res: Response) => userMobileController.resetPassword(req, res)
);
//troca a senha
routesMobile.post(
  "/users-mobile/change-password",
  ensureAuthenticate,
  (req: Request, res: Response) => userMobileController.changePassword(req, res)
);

export default routesMobile;
