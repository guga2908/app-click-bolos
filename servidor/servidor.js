const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();
console.log("primaCliente criado");

prisma.$connect()
  .then(() => console.log("Conectado ao banco!"))
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));
//----------------------------- AREA DE POSTS ----------------------------
// Rotas normais (JSON)
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const confeiteira = await prisma.confeiteira.findFirst({ where: { email } });
    if (!confeiteira) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    const senhaValida = await bcrypt.compare(senha, confeiteira.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    res.json({
      id: confeiteira.id,
      nome: confeiteira.nome,
      email: confeiteira.email,
    });
  } catch (error) {
    console.error('Erro ao buscar confeiteira:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});
app.post('/login-cliente', async (req, res) =>{
  const {email, senha} = req.body;
  try{
    const cliente = await prisma.cliente.findFirst({where: {email}});
    if(!cliente){
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if(!senhaValida){
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
      res.json({
    id:cliente.id,
    nome: cliente.nome,
    email: cliente.email,
  });
  }catch(error){
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ message:'Error interno do servidor'});
  }
});
app.post('/registrar-cliente', async (req, res) => {
  const { nome, email, telefone, endereco, datanascimento, senha } = req.body;
  if (!nome || !email || !telefone || !endereco || !datanascimento || !senha) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }
  if(isNaN(Date.parse(datanascimento))){
    return res.status(400).json({ message: 'Data de nascimento inválida.' });
  }
  try{
    const existe = await prisma.cliente.findFirst({ where:{ email }});
    if (existe) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const novocliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        telefone,
        endereco,
        datanascimento: new Date(datanascimento),
        senha: senhaHash
      }
    });
    res.status(201).json({
      id: novocliente.id,
      nome: novocliente.nome,
      email: novocliente.email
    });
  }catch (error) {
    console.error('Erro ao registrar cliente', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.post('/registrar', async (req, res) => {
  const { nome, nomeloja, email, telefone, endereco, datanascimento, senha, descricao } = req.body;
  if (!nome || !nomeloja || !email || !telefone || !endereco || !datanascimento || !senha) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }
  try {
    const existe = await prisma.confeiteira.findFirst({ where: { email } });
    if (existe) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const novaConfeiteira = await prisma.confeiteira.create({
      data: {
        nome,
        nomeloja,
        email,
        telefone,
        endereco,
        datanascimento: new Date(datanascimento),
        senha: senhaHash,
        ...(descricao && { descricao })
      }
    });
    res.status(201).json({
      id: novaConfeiteira.id,
      nome: novaConfeiteira.nome,
      email: novaConfeiteira.email
    });
  } catch (error) {
    console.error('Erro ao registrar confeiteira', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});
app.post('/confeiteira/:id/bolo', upload.single('imagem'), async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, peso, sabor, tipo } = req.body;
  let imagemPath = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const novoBolo = await prisma.bolo.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        peso: parseFloat(peso),
        sabor,
        tipo,
        imagem: imagemPath,
        confeiteiraId: Number(id)
      }
    });
    res.status(201).json(novoBolo);
  } catch (error) {
    console.error('Erro ao cadastrar bolo:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.post('/cliente/:clienteId/favoritos', async (req, res)=>{
  const {clienteId} = req.params;
  const { confeiteiraId } = req.body;
  try{
    // Verifica se o cliente existe
    const cliente = await prisma.cliente.findFirst({
      where: { id: Number(clienteId) }
    });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    // Verifica se a confeiteira existe
    const confeiteira = await prisma.confeiteira.findFirst({
      where: { id: Number(confeiteiraId) }
    });
    if (!confeiteira) {
      return res.status(404).json({ message: 'Confeiteira não encontrada.' });
    }
    const favorito = await prisma.favoritos.create({
      data: {
        clienteId: Number(clienteId),
        confeiteiraId: Number(confeiteiraId),
        nomeloja: confeiteira.nomeloja,
        imagem: confeiteira.imagem
      },
});
    res.status(201).json(favorito);
  }catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});
//----------------------------Area GETS----------------------------
app.get('/confeiteiras', async (req, res) => {
  try {
    const confeiteiras =await prisma.confeiteira.findMany();
    res.json(confeiteiras);
  }catch (error){
    console.error('Erro ao buscar confeiteiras:',error);
  }
})

// Buscar perfil da confeiteira
app.get('/confeiteira/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const confeiteira = await prisma.confeiteira.findUnique({
      where: { id: Number(id) }
    });
    if (!confeiteira) {
      return res.status(404).json({ message: 'Confeiteira não encontrada' });
    }
    res.json(confeiteira);
  } catch (error) {
    console.error('Erro ao buscar confeiteira:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar catálogo de bolos
app.get('/confeiteira/:id/catalogo', async (req, res) => {
  const { id } = req.params;
  try {
    const bolos = await prisma.bolo.findMany({ where: { confeiteiraId: Number(id) } });
    res.json(bolos);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/bolo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const bolo = await prisma.bolo.findFirst({
      where: { id: Number(id) },
    });
    if (!bolo) return res.status(404).json({ mensagem: 'Bolo não encontrado' });
    res.json(bolo);
  } catch (error) {
    console.error('Erro ao buscar Bolo:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get('/cliente/:id/endereco', async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: { endereco: true },
    });
    if (!cliente || !cliente.endereco)
      return res.status(404).json({ mensagem: 'Endereço não encontrado' });
    res.json(cliente.endereco);
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar endereço' });
  }
});

// Atualizar perfil da confeiteira (com upload de imagem)

app.get('/cliente/:id', async (req, res) => {
  const { id } = req.params;
  try{
    const cliente = await prisma.cliente.findUnique({
      where: {id: Number(id) },
      include: { favoritos: { include: { confeiteira: true } } }
    });
    res.json(cliente);
  }catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//----------------------------- Area PUTS ----------------------------
app.put('/confeiteira/:id', upload.single('imagem'), async (req, res) => {
  console.log('Arquivo recebido:', req.file);
  console.log('Body recebido:', req.body);
  const { id } = req.params;
  const { nomeloja, horarioInicio, horarioFim, descricao } = req.body;
  let imagemPath = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const confeiteiraAtualizada = await prisma.confeiteira.update({
      where: { id: Number(id) },
      data: {
        nomeloja,
        horarioInicio,
        horarioFim,
        descricao,
        ...(imagemPath && { imagem: imagemPath })
      }
    });
    res.json(confeiteiraAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar confeiteira:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//-----------------------------DELETE--------------------
app.delete('/cliente/:clienteId/favoritos/:confeiteiraId', async (req, res) => {
  const { clienteId, confeiteiraId } = req.params;
  try {
    await prisma.favoritos.deleteMany({
      where: {
        clienteId: Number(clienteId),
        confeiteiraId: Number(confeiteiraId),
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ message: 'Erro ao remover favorito.' });
  }
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});