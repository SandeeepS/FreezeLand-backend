import { Request,Response, NextFunction } from "express";

export interface IProfileController {

        getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
        editUser(req: Request, res: Response, next: NextFunction): Promise<void>;

}