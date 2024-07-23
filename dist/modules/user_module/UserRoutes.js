"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const UserController_1 = __importDefault(require("./UserController"));
const userController = new UserController_1.default();
const router = express_1.default.Router();
// Sign Up
router.route("/sign-up").post(userController.userSignUp);
router.route("/sign-in").post(userController.userSignIn);
router.route("/google-sign-in").post(userController.googleSignIn);
router.route("/sign-out").get(userController.userSignOut);
router.route("/profile").get(passport_1.default.authenticate('jwt', { session: false }), userController.userProfile);
// Google OAuth Routes
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: String(process.env.GOOGLE_FAILED_URL) }), userController.googleAuthCallback);
exports.default = router;
