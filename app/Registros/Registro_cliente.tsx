'use client';

import { router } from 'expo-router';
import { useState } from 'react';


    /*tive uma dicas de como prosseguir e qual caminho devo pegar este aplicativo tera como 
    cliente final o usuario e nao a boleira / confeiteira devo seguir esta linha de raciocinio e
    criar um aplicativo que seja mais voltado para o usuario final e nao para a boleira / confeiteira
    mais nao devo neglegir a boleira / confeiteira pois ela sera a pessoa que ira cadastrar os bolos e o usuario final
    */
// parte de regitro de usuario final finalizada  possivei adiçoes de melhorias
export default function RegistroCliente() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    datanascimento: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
//tentando conectar o banco mais esta dando o erro HTTP 500
  // 500 Internal Server Error
  // tentarei mais tarde
  // manipulei apenas esses arquivos
  // erro consertado pelomenos ate agora 
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clienteData: Cliente = {
        ...formData,
        datanascimento: new Date(formData.datanascimento),
      }
      const response = await fetch('/api/rota', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),

      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Erro ao registrar cliente');
      }
      alert('Cliente registrado com sucesso!');
      router.push('/Usuario/perfil')
    } catch (error) {
      alert (error||'Erro ao registrar cliente.');
      console.error(error);
      alert('Erro ao registrar cliente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="telefone"
        placeholder="Telefone"
        value={formData.telefone}
        onChange={handleChange}
      />
      <input
        type="text"
        name="endereco"
        placeholder="Endereço"
        value={formData.endereco}
        onChange={handleChange}
      />
      <input
        type="date"
        name="datanascimento"
        value={formData.datanascimento}
        onChange={handleChange}
      />
      <input
        type="password"
        name="senha"
        placeholder="Senha"
        value={formData.senha}
        onChange={handleChange}
      />
      <button type="submit">Registrar</button>
    </form>
  );
}