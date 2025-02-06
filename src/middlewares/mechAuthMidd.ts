import { Request, Response, NextFunction } from "express";
import { CreateJWT } from "../utils/generateToken";
import MechRepository from "../repositories/mechRepository";

const jwt = new CreateJWT();
const mechanicRepository = new MechRepository ();

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace Express {
        interface Request {
            mechanicId?: string;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */

const mechAuth = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const access_token = req.cookies.mechanic_access_token;
            const refresh_token = req.cookies.mechanic_refresh_token;

            if (!refresh_token) {
                res.clearCookie('mechanic_access_token');
                res.clearCookie('mechanic_refresh_token');
                return res.status(401).json({
                    success: false,
                    message: "Token expired or not available. Please log in again."
                });
            }

            let decoded = jwt.verifyToken(access_token);

            if (!access_token || !decoded.success) {
                console.log("Access token expired or invalid, generating a new one");
                const newAccessToken = await refreshMechanicAccessToken(refresh_token, res);
                
                if (!newAccessToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Failed to refresh access token. Please log in again."
                    });
                }

                const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
                res.cookie("mechanic_access_token", newAccessToken, { maxAge: accessTokenMaxAge });
                decoded = jwt.verifyToken(newAccessToken);
            }

            if (decoded.success && decoded.decoded) {
                const id = decoded.decoded.data.toString()
                const mechanic = await mechanicRepository.getMechById(id);

                if (!mechanic) {
                    return res.status(404).json({ 
                        success: false, 
                        message: "Mechanic not found" 
                    });
                }

                req.mechanicId = decoded.decoded.data.toString();

                // Check mechanic role
                if (mechanic != null && !allowedRoles.includes(mechanic.role)) {
                    return res.status(403).json({ 
                        success: false,
                        message: "Forbidden" 
                    });
                }

                next();
            } else {
                return res.status(401).json({ 
                    success: false, 
                    message: decoded.message 
                });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ 
                success: false, 
                message: "Authentication failed!" 
            });
        }
    };
};

const refreshMechanicAccessToken = async (refreshToken: string, res: Response) => {
    try {
        if (!refreshToken) throw new Error("No refresh token found");

        const decoded = jwt.verifyRefreshToken(refreshToken, res);

        if (decoded.success && decoded.decoded) {
            const newAccessToken = jwt.generateToken(decoded.decoded.data, decoded.decoded.role);
            return newAccessToken;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Invalid refresh token");
    }
};

export default mechAuth;