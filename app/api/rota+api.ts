import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Leia o corpo da requisição apenas uma vez
    const data = await request.json();

    let response;

    // Verifique se é um registro de Confeiteira ou Cliente
    if (data.nomeloja) {
      // Registro de Confeiteira
      response = await prisma.confeiteira.create({
        data,
      });
    } else if (data.nome) {
      // Registro de Cliente
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
    console.error(error);
    return new Response(JSON.stringify({ error: (error instanceof Error ? error.message : "Erro interno no servidor") }), {
      status: 500,
    });
  }
}
