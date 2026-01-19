import {Request,Response, NextFunction } from "express";

export interface IAdminServiceController {
        addNewServices(req: Request, res: Response, next: NextFunction): Promise<void>;
        getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
        getService(req: Request, res: Response, next: NextFunction): Promise<void>;
        listUnlistServices(req: Request, res: Response, next: NextFunction):Promise<void>;
        deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
        editExistingService(req: Request, res: Response, next: NextFunction): Promise<void>;


}