"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("./UserModel"));
const authUtils_1 = __importDefault(require("../../utils/authUtils"));
const authentication = new authUtils_1.default();
class UserAccountController {
    constructor() { }
    userSignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Checking request body
                const { firstName, lastName, password, email } = req.body;
                if (!firstName || !lastName || !password || !email) {
                    return res.status(400).json({ message: "Please provide all the required fields" });
                }
                // Checking if the user already exists
                const existingUser = yield UserModel_1.default.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
                if (existingUser) {
                    const duplicateField = 'email';
                    const errorMessage = `An account with the same ${duplicateField} already exists.`;
                    return res.status(409).json({
                        success: false,
                        message: errorMessage,
                    });
                }
                const user = yield UserModel_1.default.create({
                    firstName: req.body.firstName.trim(),
                    lastName: req.body.lastName.trim(),
                    email: req.body.email.trim(),
                    password: req.body.password.trim(),
                });
                // Setting token cookies
                yield authentication.headerAuthToken(res, user === null || user === void 0 ? void 0 : user._id);
                // Sending Success response
                res.status(200).json({
                    success: true,
                    message: "Account created successfully",
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profilePicture: {
                            public_id: "demo",
                            url: "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
                        }
                    }
                });
            }
            catch (err) {
                return res.status(400).json({
                    success: false,
                    message: err.toString()
                });
            }
        });
    }
    userSignIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Checking request body
                const { password, email } = req.body;
                if (!password || !email) {
                    return res.status(400).json({ message: "Please provide all the required fields" });
                }
                const user = yield UserModel_1.default.findOne({ email: req.body.email }).select("+password");
                if (!user || !(yield user.correctPassword(req.body.password, user.password))) {
                    return res.status(401).json({
                        success: false,
                        message: `Invalid credentials`
                    });
                }
                const loginToken = yield authentication.headerAuthToken(res, user === null || user === void 0 ? void 0 : user._id);
                if (!loginToken) {
                    return res.status(401).json({
                        success: false,
                        message: `Invalid credentials`
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "Login successfully",
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profilePicture: user.profilePicture
                    }
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: true,
                    message: err.toString()
                });
            }
        });
    }
    googleSignIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Checking request body
                const token = req.body.token;
                if (!token) {
                    return res.status(400).json({ message: "Please provide all the required fields" });
                }
                const decodedResult = yield authentication.tokenVerificationForGoogle(token);
                if (!decodedResult.success) {
                    return res.status(401).json({
                        success: false,
                        message: `Invalid credentials`
                    });
                }
                const user = yield UserModel_1.default.findOne({ _id: decodedResult.id }).select("_id firstName lastName profilePicture");
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: `Invalid credentials`
                    });
                }
                // Setting Cookie in header
                const options = {
                    expires: new Date(Date.now() + 1 * 6 * 60 * 1000),
                    httpOnly: true,
                };
                // Token setting in header
                res.cookie("user_token", token, options);
                res.status(200).json({
                    success: true,
                    message: "Login successfully",
                    user
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: true,
                    message: err.toString()
                });
            }
        });
    }
    userSignOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('user_token');
                res.status(200).json({
                    success: true,
                    message: "Sign out"
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: true,
                    message: err.toString()
                });
            }
        });
    }
    userProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = req.user;
                const user = yield UserModel_1.default.findById({ _id: decoded._id })
                    .select("username email name profilePicture");
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: `User not found`
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "User Profile",
                    profile: user
                });
            }
            catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message.toString()
                });
            }
        });
    }
    googleAuthCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            const user = req.user;
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('user_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect(`${String(process.env.GOOGLE_TO_FRONTEND_URL)}?token=${token}`);
        });
    }
}
exports.default = UserAccountController;
