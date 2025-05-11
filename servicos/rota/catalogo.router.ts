import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
    const { nome, descricao, preco, sabor, tipo, imagem, confeiteiraId } = req.body;
  
    try {
      const novoBolo = await prisma.bolo.create({
        data: { 
            nome, 
            descricao, 
            preco, 
            sabor, 
            tipo, 
            imagem, 
            confeiteiraId },
      });
  
      res.status(201).json(novoBolo);
    } catch (error) {
      console.error("Erro ao adicionar bolo:", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  router.get("/", async (req, res) => {
try {
    const catalogo = await prisma.bolo.findMany();
    res.status(200).json(catalogo);
}catch (error) {
    console.error("Erro ao buscar catálogo:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});
export default router;