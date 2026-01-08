import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization!
    try {
        const decoded = jwt.verify(header, process.env.JWT_SECRET!)
        req.userId = decoded as string
        next()
        
    } catch (error) {
        return res.status(403)
    }


}