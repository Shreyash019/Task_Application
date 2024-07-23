import express from 'express';
import passport from 'passport';
import AuthenticationController from "./UserController";

const userController = new AuthenticationController();
const router = express.Router();

// Sign Up
router.route("/sign-up").post(userController.userSignUp);
router.route("/sign-in").post(userController.userSignIn);
router.route("/google-sign-in").post(userController.googleSignIn);
router.route("/sign-out").get(userController.userSignOut);
router.route("/profile").get(passport.authenticate('jwt', { session: false }), userController.userProfile);

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: String(process.env.GOOGLE_FAILED_URL) }),
    userController.googleAuthCallback
);

export default router;