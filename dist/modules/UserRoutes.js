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
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("./user_module/UserController"));
const authUtils_1 = __importDefault(require("../authUtils"));
const UserController = new UserController_1.default();
const authentication = new authUtils_1.default();
const router = express_1.default.Router();
// Sign Up
router.route("/sign-up").post(UserController.userSignUp);
router.route("/sign-in").post(UserController.userSignIn);
router.route("/sign-out").get(UserController.userSignOut);
router.route("/profile").get(authentication.userAuthorization, UserController.userProfile);
router.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.refreshToken)) {
        return res.status(400).json({ message: "Refresh Token is required." });
    }
    const random = Math.random() * 10;
    let data = yield authentication.generateRefreshToken(req.body.refreshToken);
    if (random < 3 || !data.success) {
        return res.status(200).json({
            success: false,
            message: !data.success ? 'Account not exist' : 'You account is blocked!',
            isActive: false,
        });
    }
    res.status(200).json({
        success: true,
        message: `Yeah`,
        isActive: true,
        refreshedToken: data
    });
}));
exports.default = router;
