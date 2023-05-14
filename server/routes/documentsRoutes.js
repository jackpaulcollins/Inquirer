/* eslint-disable no-underscore-dangle */
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDocument, getDocuments, uploadDocument, queryDocument, getQueryables,
} from '../controllers/documentsController.js';
import { verifyToken } from '../utils/verifyToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads');

const documentsRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

documentsRouter.post('/upload', verifyToken, upload.single('document'), uploadDocument);
documentsRouter.get('/:id', verifyToken, getDocument);
documentsRouter.get('/:id/queryables', verifyToken, getQueryables);
documentsRouter.post('/', verifyToken, getDocuments);
documentsRouter.post('/:id/query', verifyToken, queryDocument);

export default documentsRouter;
