// utils/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Função para criptografar a senha
export const criptografarSenha = async (senha: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(senha, salt);
};

// Função para comparar senhas
export const compararSenha = async (senha: string, senhaCriptografada: string): Promise<boolean> => {
  return await bcrypt.compare(senha, senhaCriptografada);
};

// Função para gerar token JWT
export const gerarToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
};
