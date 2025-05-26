

export interface Cliente{
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    datanascimento: Date;
    senha: string;
}

 export interface Confeiteira{
    nome: string;
    nomeloja: string;
    email: string;
    telefone: string;
    endereco: string;
    datanascimento: Date;
    senha: string;
    descricao: string;

}

export interface Bolo{
    nome: string;
    descricao: string;
    preco: string;
    sabor: string;
    tipo: string;
    imagem: string;
}
