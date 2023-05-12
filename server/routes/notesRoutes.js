import express from 'express';
import {
  getNotes, getNote, createNote, destroyNote, updateNote,
} from '../controllers/notesController.js';
import { verifyToken } from '../utils/verifyToken.js';

const notesRouter = express.Router();

notesRouter.get('/', verifyToken, getNotes);
notesRouter.get('/:id', verifyToken, getNote);
notesRouter.put('/:id', verifyToken, updateNote);
notesRouter.post('/create', verifyToken, createNote);
notesRouter.delete('/:id', verifyToken, destroyNote);

export default notesRouter;
