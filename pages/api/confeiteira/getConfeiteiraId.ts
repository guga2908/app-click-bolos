import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma"; // Ajuste o caminho para o cliente Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    const confeiteira = await prisma.confeiteira.findUnique({
      where: { userId: Number(userId) },
    });

    if (!confeiteira) {
      return res.status(404).json({ error: "Confeiteira não encontrada" });
    }

    return res.status(200).json({ confeiteiraId: confeiteira.id });
  } catch (error) {
    console.error("Erro ao buscar confeiteira:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}