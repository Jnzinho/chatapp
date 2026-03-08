import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User, type IUser } from '../models/User';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
        name,
      )}`,
    });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar sessão.' });
      }
      res.status(201).json(user.toJSON());
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    'local',
    (err: Error | null, user: IUser | false, info: { message: string }) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || 'Email ou senha incorretos.' });
      }

      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json(user);
      });
    },
  )(req, res, next);
}

export function logout(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao sair.' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout realizado.' });
    });
  });
}

export function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado.' });
  }
  res.json(req.user);
}
