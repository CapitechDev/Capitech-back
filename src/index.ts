import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response, urlencoded } from "express";
import mongoose from "mongoose";
import path from "path"; // Corrigido para import padrão
import routes from "./routes";
import { setupSwagger } from "./swagger";

dotenv.config();
const PORT = process.env.PORT || 3000;
// Inicializa o cliente Prisma para MySQL
const prisma = new PrismaClient();

// Extende a interface Request para incluir o cliente Prisma
declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

async function startServer() {
  try {
    // Conecta ao MongoDB
    await mongoose.connect(process.env.DB_PATH!);
    console.log("✅ MongoDB conectado com sucesso!");

    // Conecta ao MySQL via Prisma
    await prisma.$connect();
    console.log("✅ MySQL conectado com sucesso via Prisma!");

    const app = express();

    app.use(express.json());
    app.use(urlencoded({ extended: true }));
    app.use(cors());

    // Servir arquivos estáticos da pasta public
    app.use(express.static(path.join(__dirname, "../public")));

    // Middleware para disponibilizar o cliente Prisma em todas as rotas
    app.use((req: Request, _res: Response, next: NextFunction) => {
      req.prisma = prisma;
      next();
    });

    app.get("/", (_req, res) => {
      res.status(200).json({ entry: "API Capitech rodando!" });
    });

    setupSwagger(app);

    routes.forEach((route) => {
      app.use(route);
    });

    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
    process.exit(1);
  } finally {
    // Adiciona um handler para fechar as conexões quando a aplicação for encerrada
    process.on("beforeExit", async () => {
      await prisma.$disconnect();
      await mongoose.disconnect();
    });
  }
}

startServer();
