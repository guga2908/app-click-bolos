import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let response;

    if (data.nomeloja) {
      response = await prisma.confeiteira.create({
        data,
      });
    } else if (data.nome) {
      response = await prisma.cliente.create({
        data,
      });
    } else {
      throw new Error("Formato de dados inválido");
    }

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao criar registro:", error);
    return new Response(JSON.stringify({ error: (error instanceof Error ? error.message : "Erro interno no servidor") }), {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw new Error("ID da confeiteira não fornecido");
    }

    const confeiteiraAtualizada = await prisma.confeiteira.update({
      where: { id: data.id },
      data,
    });

    return new Response(JSON.stringify(confeiteiraAtualizada), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao atualizar confeiteira:", error);
    return new Response(JSON.stringify({ error: (error instanceof Error ? error.message : "Erro interno no servidor") }), {
      status: 500,
    });
  }
}