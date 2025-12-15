import {Request,Response, NextFunction } from "express";

export interface IAdminUserManagementController{
      getUserList( req: Request, res: Response, next: NextFunction):Promise<void>
      blockUser( req: Request, res: Response, next: NextFunction ):Promise<void>
      deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
      

}

