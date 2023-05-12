/* eslint-disable no-undef */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';

export const login = (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    res.json({ user, token });
  })(req, res);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

export const signup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = new User({ email, username, password });
    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
