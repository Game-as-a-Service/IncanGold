// auth.controller.ts
import { Request, Response } from "express";
import { DataSource, Repository } from "typeorm";
import { User } from "../models/user";
import jwt from "jsonwebtoken";



async function getRepository(ds: DataSource, User: any) {
  return ds.getRepository(User);
}

const loginInit = (ds: DataSource) => {
  return async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userRepository = await getRepository(ds, User);
    const param = { username: <string>username };
    const user = await userRepository.findOneBy(param);
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
  }
}

export { loginInit };