"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMobileController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = require("../validations/userSchema");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const emailApp = process.env.GOOGLE_EMAIL;
const appPassword = process.env.GOOGLE_APP_PASSWORD;
class UserMobileController {
    getAllUserMobile = async (req, res) => {
        try {
            const users = await prisma.user.findMany();
            res.status(200).json({
                users: users.map((user) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                })),
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Erro ao buscar usuários móveis",
            });
        }
    };
    registerUserMobile = async (req, res) => {
        try {
            await userSchema_1.UserSchema.create.validate(req.body);
            const { name, email, password } = req.body;
            const exitingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (exitingUser) {
                throw new Error("Usuário já cadastrado com este email");
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            res.status(201).json({ message: "Usuário criado com sucesso" });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Erro ao cadastrar usuário" });
            }
        }
    };
    loginUserMobile = async (req, res) => {
        try {
            await userSchema_1.UserSchema.loginMobile.validate(req.body);
            const { email, password } = req.body; // Verifica se o usuário existe
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new Error("Usuário ou senha inválidos");
            }
            // Verifica a senha
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Usuário ou senha inválidos");
            }
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET não está definido");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: "5min",
            });
            res.status(200).json({
                message: "Login bem-sucedido",
                user: { id: user.id, email: user.email },
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Erro ao fazer login" });
            }
        }
    };
    forgotPasswordEmail = async (req, res) => {
        try {
            await userSchema_1.UserSchema.forgotPassword.validate(req.body);
            const { email } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: "Email inválido" });
            }
            const resetToken = crypto.randomUUID();
            const resetTokenExpiry = new Date(Date.now() + 3600000);
            await prisma.user.update({
                where: { email },
                data: { resetToken, resetTokenExpiry },
            });
            const resetLink = `http://localhost:4000/reset-password-mobile.html?token=${resetToken}`;
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: emailApp,
                    pass: appPassword,
                },
            });
            const mailOptions = {
                from: emailApp,
                to: user.email,
                subject: "Recuperação de senha",
                html: `
        Olá, ${user.name},<br><br>
        Você solicitou a recuperação de senha.<br>
        Clique no link abaixo para redefinir sua senha:<br>
        <a href="${resetLink}">${resetLink}</a><br><br>
        Este link é válido por 1 hora.<br><br>
        Atenciosamente,<br>
        Equipe Capitech
      `,
            };
            await transporter.sendMail(mailOptions);
            return res.status(200).json({
                message: "Email de recuperação enviado com sucesso",
            });
        }
        catch (error) {
            console.error("Erro no envio de email:", error);
            return res.status(500).json({
                message: "Erro ao enviar email de recuperação",
                error: error.message || error,
            });
        }
    };
    resetPassword = async (req, res) => {
        await userSchema_1.UserSchema.resetPassword.validate(req.body);
        const { token, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ message: "Token inválido ou expirado" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        res
            .status(200)
            .json({ sucess: true, message: "Senha redefinida com sucesso" });
    };
    changePassword = async (req, res) => {
        try {
            await userSchema_1.UserSchema.changePassword.validate(req.body);
            const { password, newPassword } = req.body;
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Senha atual inválida" });
            }
            const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedNewPassword,
                },
            });
            return res.status(200).json({ message: "Senha alterada com sucesso" });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro ao alterar senha" });
        }
    };
}
exports.UserMobileController = UserMobileController;
//# sourceMappingURL=UserMobileController.js.map