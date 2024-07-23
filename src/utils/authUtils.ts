import jwt, { JwtPayload } from "jsonwebtoken";
import express, { NextFunction, Response } from "express"
import { UserRequest } from "./interface_Types"
export default class Auth {
    constructor() {}
    async generateToken(id: string): Promise<string> {
        return jwt.sign({ id }, process.env.JWT_SECRET!, {
            expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '1') * 24 *60 *60 *1000,
        });
    }

    async headerAuthToken(res: express.Response, user: string,): Promise<{ success: boolean, token:string }> {
        // Token Generation
        const token = await this.generateToken(user);
        const jwtCookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
        if (!jwtCookieExpiresIn) {
            throw new Error('JWT_COOKIE_EXPIRES_IN is not defined in the environment variables');
        }

        // Cookie validation days setup
        const options:any = {
            expires: new Date(
                Date.now() + parseInt(jwtCookieExpiresIn) * 24 * 60 * 1000
            ),
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        };
        // Token setting in header
        res.cookie("user_token", token, options);

        // Return values
        return { success: true, token };
    }

    async tokenVerificationForGoogle(token:string): Promise<{success: boolean, id: string|undefined}> {

        // Returning if no token
        if (!token) {
            return {
                success: false,
                id: undefined
            }
        }

        // Decoding user using token
        type DecodedJwt = {
            exp: number; // Assuming expiration is stored in 'exp' claim
            id: string;
            iat: number
        };
        const decoded = await jwt.verify(token, process.env.JWT_SECRET!) as DecodedJwt;

        if (typeof decoded === 'string') {
            return {
                success: false,
                id: undefined
            }
        } else {
            return {
                success: true,
                id: decoded.id
            }
        }
    }
}