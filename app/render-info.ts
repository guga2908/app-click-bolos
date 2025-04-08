
import {prisma} from "@/lib/prisma";

export async function renderInfo(nome: string, email: string, telefone: string, endereco: string, datadenascimento: Date, senha: string){
    "use server";
    await prisma.cliente.create({
                data:{
                    nome,
                    email,
                    telefone,
                    endereco,
                    datadenascimento,
                    senha 
                }
            })
} 