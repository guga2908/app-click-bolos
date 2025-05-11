import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { autenticar } from "./AutentiMiddleware";

const router = Router();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_super_segura"; // Substituir em produção

// Rota protegida de exemplo
router.get("/protegida", autenticar, async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Você acessou uma rota protegida!",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota de login para confeiteira
router.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const confeiteira = await prisma.confeiteira.findFirst({
      where: { email },
    });

    if (!confeiteira) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, confeiteira.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: confeiteira.id, email: confeiteira.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({
      id: confeiteira.id,
      nomeloja: confeiteira.nomeloja,
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const confeiteira = await prisma.confeiteira.findUnique({
      where: { id },
      include: { bolos: true }, // Inclui o catálogo de bolos
    });

    if (!confeiteira) {
      return res.status(404).json({ error: "Confeiteira não encontrada" });
    }

    res.status(200).json(confeiteira);
  } catch (error) {
    console.error("Erro ao buscar confeiteira:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;
