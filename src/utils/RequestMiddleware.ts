import { Request, Response, NextFunction } from 'express';
import { UserRequest } from "./interface_Types";

const attachUserToRequest = (req: UserRequest, res: Response, next: NextFunction) => {
    (req as Request).user = req.user;
    next();
};

export default attachUserToRequest;
