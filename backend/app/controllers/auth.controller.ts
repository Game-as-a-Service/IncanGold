// auth.controller.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 检查用户名和密码是否有效
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ username });

  if (!user || !user.checkPassword(password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 生成访问令牌和刷新令牌
  const accessToken = jwt.sign({ username: user.username }, "your-secret-key", {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(
    { username: user.username },
    "your-secret-key",
    {
      expiresIn: "7d",
    }
  );

  // 返回访问令牌和刷新令牌
  return res.json({ accessToken, refreshToken });
};
