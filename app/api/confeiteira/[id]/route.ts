import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id); // Converte o ID para número
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    const confeiteira = await prisma.confeiteira.findUnique({
      where: { id },
      include: { catalogo: true }, // Inclua o catálogo, se necessário
    });

    if (!confeiteira) {
      return new Response(JSON.stringify({ error: "Confeiteira não encontrada" }), { status: 404 });
    }

    return new Response(JSON.stringify(confeiteira), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao buscar confeiteira:", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), { status: 500 });
  }
}