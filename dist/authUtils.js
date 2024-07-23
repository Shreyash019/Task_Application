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
class Auth {
    constructor() { }
    generateToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        });
    }
    headerAuthToken(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Token Generation
            const token = yield this.generateToken(user);
            // Cookie validation days setup
            const options = {
                expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 1000),
                httpOnly: true,
            };
            // Token setting in header
            res.cookie("user_token", token, options);
            // Return values
            return { success: true };
        });
    }
    userAuthorization(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = new Auth();
            // Fetching token
            let token = undefined;
            if (req.cookies.user_token) {
                token = req.cookies.user_token;
            }
            else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                const authHeader = req.headers.authorization.split(" ");
                if (authHeader.length === 2 && authHeader[1].toLowerCase() !== "null") {
                    token = authHeader[1];
                }
            }
            // Returning if no token
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: `Please login.`,
                });
            }
            const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof decoded === 'string') {
                res.status(401).json({ success: false, message: 'Please login again.' });
            }
            else {
                req.user = {
                    id: decoded.id,
                };
            }
            next();
        });
    }
}
exports.default = Auth;
