import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Busca todas as confeiteiras no banco de dados
    const confeiteiras = await prisma.confeiteira.findMany();
    return new Response(JSON.stringify(confeiteiras), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro ao buscar confeiteiras" }), {
      status: 500,
    });
  }
}

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
    console.error(error);
    return new Response(JSON.stringify({ error: (error instanceof Error ? error.message : "Erro interno no servidor") }), {
      status: 500,
    });
  }
}


