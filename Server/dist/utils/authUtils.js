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
                expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '1') * 24 * 60 * 60 * 1000,
            });
        });
    }
    headerAuthToken(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Token Generation
            const token = yield this.generateToken(user);
            const jwtCookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
            if (!jwtCookieExpiresIn) {
                throw new Error('JWT_COOKIE_EXPIRES_IN is not defined in the environment variables');
            }
            // Cookie validation days setup
            const options = {
                expires: new Date(Date.now() + parseInt(jwtCookieExpiresIn) * 24 * 60 * 1000),
                httpOnly: true,
                sameSite: 'None',
                secure: true,
            };
            // Token setting in header
            res.cookie("user_token", token, options);
            // Return values
            return { success: true, token };
        });
    }
    tokenVerificationForGoogle(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Returning if no token
                if (!token) {
                    return {
                        success: false,
                        id: undefined
                    };
                }
                const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (typeof decoded === 'string') {
                    return {
                        success: false,
                        id: undefined
                    };
                }
                else {
                    return {
                        success: true,
                        id: decoded.id
                    };
                }
            }
            catch (err) {
                return { success: false, id: 'Not valid credentials' };
            }
        });
    }
}
exports.default = Auth;
