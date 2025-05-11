import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Buscar dados da confeiteira pelo ID
/* router.get("/:id", async (req: Request, res: Response) => {
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
}); */

// Atualizar dados da confeiteira
router.put("/:id", async (req: Request<{ id: string }, {}, {
  nomeloja: string;
  horarioInicio?: string;
  horarioFim?: string;
  descricao?: string;
  imagem?: string;
}>, res: Response) => {
  const id = parseInt(req.params.id);
  const { nomeloja, horarioInicio, horarioFim, descricao, imagem } = req.body;

  try {
    const confeiteiraAtualizada = await prisma.confeiteira.update({
      where: { id },
      data: { nomeloja, descricao, imagem },
    });

    res.status(200).json(confeiteiraAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar confeiteira:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;