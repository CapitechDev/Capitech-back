import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserSchema } from "../validations/userSchema";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const emailApp = process.env.GOOGLE_EMAIL;
const appPassword = process.env.GOOGLE_APP_PASSWORD;

const generateToken = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export class UserMobileController {
  getAllUserMobile = async (req: Request, res: Response) => {
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
    } catch (error: unknown) {
      res.status(500).json({
        message: "Erro ao buscar usuários móveis",
      });
    }
  };

  registerUserMobile = async (req: Request, res: Response) => {
    try {
      await UserSchema.create.validate(req.body);

      const { name, email, password } = req.body;
      const exitingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (exitingUser) {
        throw new Error("Usuário já cadastrado com este email");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro ao cadastrar usuário" });
      }
    }
  };
  loginUserMobile = async (req: Request, res: Response) => {
    try {
      await UserSchema.loginMobile.validate(req.body);

      const { email, password } = req.body; // Verifica se o usuário existe
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Usuário ou senha inválidos");
      }

      // Verifica a senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Usuário ou senha inválidos");
      }

      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não está definido");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "5min",
        }
      );

      res.status(200).json({
        message: "Login bem-sucedido",
        user: { id: user.id, email: user.email },
        token,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro ao fazer login" });
      }
    }
  };

  forgotPasswordEmail = async (req: Request, res: Response) => {
    try {
      await UserSchema.forgotPassword.validate(req.body);

      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ message: "Email inválido" });
      }

      const resetToken = generateToken();
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
      });

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
        subject: "Recuperação de Senha - Capitech",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color:#25059b;">Olá, ${user.name}.</h2>
          <p>Você solicitou a recuperação de sua senha.</p>
          <p>Use o seguinte token para redefinir sua senha:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 18px; font-weight: bold; color:#25059b;">${resetToken}</span>
          </div>
          <p><strong>Importante:</strong> Este token é válido por 1 hora.</p>
          <p>Se você não solicitou a recuperação de senha, por favor, ignore este email.</p>
          <br>
          <p>Atenciosamente,</p>
          <p><strong>Equipe Capitech</strong></p>
        </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Token de recuperação enviado com sucesso",
      });
    } catch (error: any) {
      console.error("Erro no envio de email:", error);
      return res.status(500).json({
        message: "Erro ao enviar token de recuperação",
        error: error.message || error,
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    await UserSchema.resetPassword.validate(req.body);
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
    const hashedPassword = await bcrypt.hash(password, 10);
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

  changePassword = async (req: Request, res: Response) => {
    try {
      await UserSchema.changePassword.validate(req.body);
      const { password, newPassword } = req.body;

      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Senha atual inválida" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedNewPassword,
        },
      });
      return res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro ao alterar senha" });
    }
  };
}
