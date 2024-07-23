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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const UserModel_1 = __importDefault(require("../modules/user_module/UserModel")); // Import your User model
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['user_token'];
    }
    return token;
};
const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET || ' ', // Use environment variable for JWT secret
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(jwtPayload.id); // Corrected: Use findById
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        console.error('Error during user lookup:', error); // Add logging
        return done(error, false);
    }
})));
// Google OAuth Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find or create user
        let user = yield UserModel_1.default.findOne({ googleId: profile.id });
        if (!user) {
            // Create a new user if one doesn't exist
            if (!profile.emails || profile.emails.length === 0) {
                return done(new Error("No email found in profile"), false);
            }
            user = new UserModel_1.default({
                googleId: profile.id,
                username: profile.displayName.trim().split(" ").join(""),
                firstName: profile.displayName.trim().split(" ")[0],
                lastName: profile.displayName.trim().split(" ")[1],
                email: profile.emails[0].value, // assuming the user has at least one email
            });
            yield user.save().catch((err) => {
                console.log(err.toString());
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
})));
// Serialize user to store in session
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from session
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
exports.default = passport_1.default;
