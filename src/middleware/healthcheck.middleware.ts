import { NextFunction, Request, Response } from "express";

export function HealthcheckMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.hostname === "hc.check") {
        return res.send("200 OK");
    } else {
        next();
    }
}
