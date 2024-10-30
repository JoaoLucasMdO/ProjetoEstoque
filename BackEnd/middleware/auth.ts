// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction):  Record<string, any> | any => {
  const token = req.header('access-token')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ mensagem: 'Token inválido.' });
  }
};

export default authMiddleware;
