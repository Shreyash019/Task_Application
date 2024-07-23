import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserAccountModel from "./UserModel";
import UserAuthorization from "../../utils/authUtils";

const authentication = new UserAuthorization()

export default class UserAccountController {
    constructor() { }

    async userSignUp(req: Request, res: Response, next: NextFunction) {
        try {
            // Checking request body
            const { firstName, lastName, password, email } = req.body;
            if (!firstName || !lastName || !password || !email) {
                return res.status(400).json({ message: "Please provide all the required fields" });
            }

            // Checking if the user already exists
            const existingUser = await UserAccountModel.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } })

            if (existingUser) {
                const duplicateField = 'email';
                const errorMessage = `An account with the same ${duplicateField} already exists.`;
                return res.status(409).json({
                    success: false,
                    message: errorMessage,
                })
            }

            const user: any = await UserAccountModel.create({
                firstName: req.body.firstName.trim(),
                lastName: req.body.lastName.trim(),
                email: req.body.email.trim(),
                password: req.body.password.trim(),
            })

            // Setting token cookies
            const isToken  = await authentication.headerAuthToken(res, user?._id);

            // Sending Success response
            res.status(200).json({
                success: true,
                message: "Account created successfully",
                token: isToken.token,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: {
                        public_id: "demo",
                        url: "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
                    }
                }
            })
        } catch (err: any) {
            return res.status(400).json({
                success: false,
                message: err.toString()
            })
        }
    }
    async userSignIn(req: Request, res: Response, next: NextFunction) {
        try {

            // Checking request body
            const { password, email } = req.body;
            if (!password || !email) {
                return res.status(400).json({ message: "Please provide all the required fields" });
            }

            const user: any = await UserAccountModel.findOne({ email: req.body.email }).select("+password")
            if (!user || !(await user.correctPassword(req.body.password, user.password))) {
                return res.status(401).json({
                    success: false,
                    message: `Invalid credentials`
                })
            }
            const loginToken = await authentication.headerAuthToken(res, user?._id);
            if (!loginToken) {
                return res.status(401).json({
                    success: false,
                    message: `Invalid credentials`
                })
            }
            res.status(200).json({
                success: true,
                message: "Login successfully",
                token: loginToken.token,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: user.profilePicture
                }
            })
        }  catch (err:any) {
            return res.status(500).json({
                success: true,
                message: err.toString()
            })
        }
    }
    async googleSignIn(req: Request, res: Response, next: NextFunction) {
        try {
            // Checking request body
            const token  = req.body.token;
            if (!token) {
                return res.status(400).json({ message: "Please provide all the required fields" });
            }

            const decodedResult: { success: boolean, id: string | undefined } = await authentication.tokenVerificationForGoogle(token);
            if (!decodedResult.success) {
                return res.status(401).json({
                    success: false,
                    message: `Invalid credentials`
                })
            }

            const user: any = await UserAccountModel.findOne({ _id: decodedResult.id }).select("_id firstName lastName profilePicture")
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: `Invalid credentials`
                })
            }
            // Setting Cookie in header
            const options = {
                expires: new Date(
                    Date.now() + 1 * 6 * 60 * 1000
                ),
                httpOnly: true,
            };

            // Token setting in header
            res.cookie("user_token", token, options);
            res.status(200).json({
                success: true,
                message: "Login successfully",
                token,
                user
            })
        } catch (err:any) {
            return res.status(500).json({
                success: true,
                message: err.toString()
            })
        }
    }
    async userSignOut(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie('user_token');
            res.status(200).json({
                success: true,
                message: "Sign out"
            })
        }  catch (err:any) {
            return res.status(500).json({
                success: true,
                message: err.toString()
            })
        }
    }
    async userProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const decoded: any = req.user
            const user: any = await UserAccountModel.findById({ _id: decoded._id })
                .select("username email name profilePicture")
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: `User not found`
                })
            }
            res.status(200).json({
                success: true,
                message: "User Profile",
                profile: user
            })
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.message.toString()
            })
        }
    }
    async googleAuthCallback(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const user: any = req.user;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        
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
        res.redirect(`${String(process.env.GOOGLE_TO_FRONTEND_URL)}?token=${token}`);
    }
}