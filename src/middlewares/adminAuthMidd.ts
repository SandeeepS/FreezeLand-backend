import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import AdminRepository from '../repositories/adminRepository';

const jwt = new CreateJWT();
const adminRepository = new AdminRepository();
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            adminId?: string
        }
    }
}

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.admin_access_token
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
        
        const decoded = jwt.verifyToken(token);

        if (decoded) {
            let user = await adminRepository.getAdminById(decoded.toString());
            req.adminId = decoded.toString();
            next();
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" })
        }
    } catch (err) {
        console.log(err); console.log('error is in the catch block!');
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    }
}

export default adminAuth;