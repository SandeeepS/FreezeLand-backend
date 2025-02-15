import Iuser from "./interfaces/entityInterface/Iuser";
declare global {
    namespace Express {
      interface Request {
        userId?: string;
        user?: Iuser;
      }
    }
  }
  