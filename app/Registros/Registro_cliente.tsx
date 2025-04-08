'use client';

import { useState } from 'react';
import { renderInfo } from '@/app/render-info';

export default function RegistroCliente() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    datadenascimento: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await renderInfo(
        formData.nome,
        formData.email,
        formData.telefone,
        formData.endereco,
        new Date(formData.datadenascimento),
        formData.senha
      );
      alert('Cliente registrado com sucesso!');
    } catch (error) {
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
        name="datadenascimento"
        value={formData.datadenascimento}
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