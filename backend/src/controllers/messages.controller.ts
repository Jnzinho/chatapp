import type { Request, Response } from "express";
import { Message } from "../models/Message";
import type { IUser } from "../models/User";
import { getIO } from "../socket";

export async function getMessages(req: Request, res: Response) {
  try {
    const currentUser = req.user as IUser;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: currentUser._id, receiver: userId },
        { sender: userId, receiver: currentUser._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar mensagens." });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const currentUser = req.user as IUser;
    const { userId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Conteúdo da mensagem é obrigatório." });
    }

    const message = await Message.create({
      sender: currentUser._id,
      receiver: userId,
      content: content.trim(),
    });

    getIO().to(userId).emit("message:new", message.toJSON());

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Erro ao enviar mensagem." });
  }
}
