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
const mongoose_1 = __importDefault(require("mongoose"));
const UserAccount_1 = __importDefault(require("./UserAccount"));
const authUtils_1 = __importDefault(require("../authUtils"));
const authentication = new authUtils_1.default();
class UserAccountController {
    constructor() { }
    userSignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Checking request body
                const { username, password, email, name } = req.body;
                if (!username || !password || !email || !name) {
                    return res.status(400).json({ message: "Please provide all the required fields" });
                }
                // Checking if the user already exists
                const existingUser = yield UserAccount_1.default.findOne({
                    $or: [
                        { username: { $regex: new RegExp(`^${username}$`, "i") } },
                        { email: { $regex: new RegExp(`^${email}$`, "i") } }
                    ]
                });
                if (existingUser) {
                    const duplicateField = existingUser.username.toLowerCase() === username.toLowerCase() ? 'username' : 'email';
                    const errorMessage = `An account with the same ${duplicateField} already exists.`;
                    return res.status(409).json({
                        success: false,
                        message: errorMessage
                    });
                }
                const user = yield UserAccount_1.default.create({
                    username: req.body.username.trim(),
                    email: req.body.email.trim(),
                    name: req.body.name.trim(),
                    password: req.body.password.trim(),
                });
                // Setting token cookies
                yield authentication.headerAuthToken(res, user === null || user === void 0 ? void 0 : user._id);
                // Sending Success response
                res.status(200).json({
                    success: true,
                    message: "Account created successfully",
                });
            }
            catch (err) {
                // Sending error response
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
                const user = yield UserAccount_1.default.findOne({ email: req.body.email }).select("+password");
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
                    message: "Login successfully"
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    userSignOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Clear the cookie by setting its expiration date to the past
                res.clearCookie('user_token');
                res.status(200).json({
                    success: true,
                    message: "Sign out"
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    userProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userID = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!mongoose_1.default.isValidObjectId(userID)) {
                    return res.status(500).json({
                        success: false,
                        message: `Something went wrong`
                    });
                }
                const user = yield UserAccount_1.default.findById({ _id: userID })
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
}
exports.default = UserAccountController;
