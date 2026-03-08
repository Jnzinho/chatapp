import type { Request, Response } from "express";
import { User, type IUser } from "../models/User";

export async function listUsers(req: Request, res: Response) {
  try {
    const currentUser = req.user as IUser;
    const users = await User.find({ _id: { $ne: currentUser._id } }).sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
}
