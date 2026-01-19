import { Request,Response,NextFunction } from "express";
import { GetImageUrlResponse } from "../../dataContracts/User/IController.dto";

export interface IUserController{
    
    getImageUrl(req: Request, res: Response, next: NextFunction): Promise<GetImageUrlResponse | void>;

}