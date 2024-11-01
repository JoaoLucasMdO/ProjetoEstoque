// server.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from './middleware/auth';
import upload from './upload';
import cors from 'cors';
import { criptografarSenha, compararSenha, gerarToken } from './utils/auth';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Códigos de status usados:
// 200 Sucesso!
// 201 Sucesso no cadastro!
// 400 Erro de requisição!
// 404 Página não encontrada!
// 500 Erro no servidor!

//////////////////////////Usuários///////////////////////////////

app.get('/usuarios', auth, async (req: Request, res: Response) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) { 
        res.status(500).json({ mensagem: "Falha ao buscar usuários!" });
    }
});

app.get('/usuarios/:id', async (req: Request, res: Response) => {
    const paramId = Number(req.params.id);
    try {
        const usuario = await prisma.usuario.findFirst({
            where: { id: paramId }
        });
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao buscar o usuário!" });
    }
});

app.post('/cadastro', async (req: Request, res: Response) => {
    try {
        const { nome, email, senha } = req.body;
        const senhaCriptografada = await criptografarSenha(senha);
        
        await prisma.usuario.create({
            data: { nome, email, senha: senhaCriptografada },
        });
        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao cadastrar o usuário!",
            error: error
         });
    }
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !(await compararSenha(senha, usuario.senha))) {
            res.status(400).json({ mensagem: 'Email ou senha inválidos.' });
        }else{
        const token = gerarToken(usuario.id.toString());
        res.status(200).json({ token, id: usuario.id, mensagem: "Logado com sucesso!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao fazer login.' });
    }
});

//////////////////////////Produtos///////////////////////////////

app.get('/produtos', async (req: Request, res: Response) => {
    try {
        const produtos = await prisma.produto.findMany();
        res.status(200).json(produtos);
    } catch (error) { 
        res.status(500).json({ mensagem: "Falha ao buscar os produtos!" });
    }
});

app.get('/produtos/:id', async (req: Request, res: Response) => {
    const paramId = Number(req.params.id);
    try {
        const produto = await prisma.produto.findFirst({
            where: { id: paramId }
        });
        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(404).json({ mensagem: "Produto não encontrado!" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao buscar o produto!" });
    }
});

app.post('/produtos', upload.single('foto'), auth, async (req: Request, res: Response) => {
    if (!req.file) {
         res.status(400).json({ mensagem: "A Foto é obrigatória!" });
    }else{
    try {
       
        const { nome, descricao, valor, quantidade } = req.body;

        const quantidadeNumerica = Number(quantidade);
        
        await prisma.produto.create({
            data: { nome, descricao, imagem: req.file.buffer, valor, quantidade:quantidadeNumerica },
        });
        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao cadastrar o produto!",
            error: error
         });
    }
}
});

app.delete('/produtos/:id', auth, async (req: Request, res: Response) => {
    const paramId = Number(req.params.id);
    try {
        const produto = await prisma.produto.delete({
            where: { id: paramId }
        });
        res.status(200).json({
            mensagem: "Produto deletado com sucesso!",
            produto: produto
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Falha ao deletar o produto." });
    }
});

app.put('/produtos/:id', upload.single('foto'), auth, async (req: Request, res: Response) => {
    const paramId = Number(req.params.id);

    const updatedData: any = {
        ...req.body,
        valor: req.body.valor ? Number(req.body.valor) : undefined,
        quantidade: req.body.quantidade ? Number(req.body.quantidade) : undefined,
    };

    if (req.file) {
        updatedData.imagem = req.file.buffer; 
    }

    try {
        const produto = await prisma.produto.update({
            where: { id: paramId },
            data: updatedData,
        });
        res.status(200).json({
            mensagem: "Produto atualizado com sucesso!",
            produto: produto,
        });
    } catch (error) {
        res.status(500).json({
            mensagem: "Falha ao atualizar o produto.",
            error: error,
        });
    }
});


app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
