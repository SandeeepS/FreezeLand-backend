import { Request, Response, NextFunction } from "express";
import { IMechanicChatController } from "../../interfaces/IController/mechanic/IMechanicChatController";
import { IMechServices } from "../../interfaces/IServices/IMechServices";

class MechanicChatController implements IMechanicChatController {
  constructor(private _mechServices: IMechServices) {
    this._mechServices = _mechServices;
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, mechId } = req.body;
      console.log("entered in the createRoom in the mechControler");
      console.log(`user id is ${userId} and mechId is ${mechId}`);
      const result = await this._mechServices.createRoom({ userId, mechId });
      console.log("result fo createRoom in controller is", this.createRoom);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default MechanicChatController;
