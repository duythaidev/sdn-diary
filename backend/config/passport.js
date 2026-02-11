import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        },

        /**
         * Luồng: 
         * - Kiểm tra user đã tồn tại với Google ID chưa
         * - Kiểm tra user đã tồn tại với email chưa
         * - Nếu đã tồn tại thì return user
         * - Nếu chưa tồn tại thì tạo user mới và return user
         */
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('profile', profile)
                // Extract user information from Google profile
                const email = profile.emails[0].value;
                const googleId = profile.id;
                const username = profile.displayName;
                const profileImage = profile.photos[0].value;

                // Check if user already exists with this Google ID
                let user = await User.findOne({ googleId });

                if (user) {
                    // User exists with this Google ID, return the user
                    return done(null, user);
                }

                // Check if user exists with this email (from local registration)
                user = await User.findOne({ email });

                if (user) {
                    // User exists with this email, link Google account
                    user.googleId = googleId;
                    user.provider = 'google';
                    await user.save();
                    return done(null, user);
                }

                // Create new user with Google account
                user = new User({
                    username,
                    email,
                    googleId,
                    profileImage,
                    provider: 'google',
                    // No password needed for OAuth users
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
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
