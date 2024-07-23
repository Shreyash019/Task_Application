import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../modules/user_module/UserModel'; // Import your User model

const cookieExtractor = (req: any) => {
  let token = null;

  // Check if the Authorization header is present
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    // Extract the token from the Bearer token format
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7, authHeader.length); // Remove "Bearer " from the header
    }
  }

  // If token not found in header, check cookies
  if (!token && req.cookies && req.cookies['user_token']) {
    token = req.cookies['user_token'];
  }

  return token;
};
const opts: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET || ' ',
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id); 
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Error during user lookup:', error);
      return done(error, false);
    }
  })
);


// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create a new user if one doesn't exist
          if (!profile.emails || profile.emails.length === 0) {
            return done(new Error("No email found in profile"), false);
          }
          user = new User({
            googleId: profile.id,
            username: profile.displayName.trim().split(" ").join(""),
            firstName: profile.displayName.trim().split(" ")[0],
            lastName: profile.displayName.trim().split(" ")[1],
            email: profile.emails[0].value, // assuming the user has at least one email
          });
          await user.save().catch((err)=>{
            console.log(err.toString())
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
