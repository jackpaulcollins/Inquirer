import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/User.js';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password' });
    }
    const passwordIsValid = await user.checkPassword(password);
    if (!passwordIsValid) {
      return done(null, false, { message: 'Incorrect username or password' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
