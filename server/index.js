/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import './passport-config.js';
import { AdminJS } from 'adminjs';
import  AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import authRouter from './routes/authRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import documentsRouter from './routes/documentsRoutes.js';
import adminJsConfig from './config/AdminJSConfig.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const admin = new AdminJS(adminJsConfig);

const adminRouter = AdminJSExpress.buildRouter(admin);

app.use(admin.options.rootPath, adminRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.PASSPORT_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRouter);
app.use('/api/notes/', notesRouter);
app.use('/api/documents/', documentsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
});
