const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/auth/google/callback", 
    proxy: true 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user); 
      }
      
      const email = profile.emails[0].value;
      user = await User.findOne({ emailId: email });
      if (user) {
        
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      

      const newUser = new User({
        googleId: profile.id,
        emailId: email,
        username: `user_${Date.now()}`, 
        isProfileComplete: false,
      });
      await newUser.save();
      return done(null, newUser);

    } catch (err) {
      return done(err, false);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'],
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ facebookId: profile.id });
        if (user) {
            return done(null, user);
        }
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if(email) {
            user = await User.findOne({ emailId: email });
            if (user) {
                user.facebookId = profile.id;
                await user.save();
                return done(null, user);
            }
        }
        const newUser = new User({
            facebookId: profile.id,
            username: profile.displayName.replace(/\s+/g, '') + `_${Date.now()}`, 
            emailId: email,
            isProfileComplete: false,
        });
        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        return done(err, false);
    }
  }
));
