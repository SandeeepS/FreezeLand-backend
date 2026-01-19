import { Request,Response, NextFunction } from "express";

export interface IAddressController {
        addAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
        editAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
        setDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
        handleRemoveUserAddress(req: Request,res: Response,next: NextFunction):Promise<void>;
        getAllAddressOfUser(req: Request, res: Response, next: NextFunction):Promise<void>
}