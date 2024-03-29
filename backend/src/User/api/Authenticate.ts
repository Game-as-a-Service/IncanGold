import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify and decode token logic
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        (req as any).user = decoded;
        next();
    } catch (err) {
        console.log(20,err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
}
