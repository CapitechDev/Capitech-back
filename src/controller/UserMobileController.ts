import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserSchema } from "../validations/userSchema";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

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
      // Validação dos dados de entrada
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
}
