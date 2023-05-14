/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import path from 'path';
import pdfUtil from 'pdf-to-text';
import util from 'util';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain } from 'langchain/chains';
import Document from '../models/Document.js';
import { Queryable } from '../models/Queryable.js';

const buildAndSaveVectorStore = async (filePath, VECTOR_STORE_PATH, textParam = null) => {
  let text = textParam;

  try {
    if (!text) {
      text = fs.readFileSync(filePath, 'utf8');
    }

    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([text]);
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    }));
    await vectorStore.save(VECTOR_STORE_PATH);
    return vectorStore;
  } catch (error) {
    console.error('Vector generation failed:', error);
    return null;
  }
};

const buildVectorStorePath = (title) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', 'vector_store', `${title}.index`);
};

const loadVectorStore = async (VECTOR_STORE_PATH) => {
  try {
    const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
    return vectorStore;
  } catch (error) {
    console.log(`Error loading vector store ${error}`);
  }
};

const queryVectorStore = async (vectorStore, question) => {
  try {
    const model = new OpenAI({});
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const answer = await chain.call({
      query: question,
    });
    return answer;
  } catch (error) {
    console.error('Query failed: ', error);
    return null;
  }
};

const maybeExtractPdfText = async (file) => {
  const pdfToText = util.promisify(pdfUtil.pdfToText);

  try {
    const ext = file.document_type;
    if (ext === 'application/pdf') {
      const data = await pdfToText(file.path);
      return data;
    }
    return null;
  } catch (error) {
    if (error.includes('Permission Error')) {
      throw new Error('PDF extraction failed: file is password protected');
    }
    throw new Error(error);
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { file, body } = req;

    const document = new Document({
      title: file.originalname,
      user_id: body.user_id,
      path: file.path,
      document_type: body.document_type,
    });

    const text = await maybeExtractPdfText(document);

    try {
      const VECTOR_STORE_PATH = buildVectorStorePath(document.title);

      if (fs.existsSync(VECTOR_STORE_PATH)) {
        console.log('vector exists');
      } else {
        await buildAndSaveVectorStore(file.path, VECTOR_STORE_PATH, text);
      }
    } catch (error) {
      console.error('Vector generation failed:', error);
    }

    await document.save();

    res.status(200).json({ documentId: document.id, message: 'File uploaded successfully' });
  } catch (error) {
    if (error.message === 'PDF extraction failed: file is password protected') {
      res.status(422).json({ message: 'PDF extraction failed: file is password protected' });
    } else {
      res.status(500).json({ message: `${error} Server error` });
    }
  }
};

export const queryDocument = async (req, res) => {
  try {
    const { question } = req.body;
    const document = await Document.findByPk(req.params.id);
    const { user_id } = document;

    await Queryable.create({
      document_id: document.id,
      content: question,
      user_id,
      queryable_type: 'question',
    });

    const VECTOR_STORE_PATH = buildVectorStorePath(document.title);
    const vectorStore = await loadVectorStore(VECTOR_STORE_PATH);
    const answer = await queryVectorStore(vectorStore, question);

    await Queryable.create({
      document_id: document.id,
      content: answer.text,
      user_id,
      queryable_type: 'answer',
    });

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getDocument = async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  res.download(document.path);
};

export const getQueryables = async (req, res) => {
  const { userId } = req.query;
  const queryables = await Queryable.findAll({
    where: { document_id: req.params.id, user_id: userId },
  });
  res.json({ queryables });
};

export const getDocuments = async (req, res) => {
  try {
    const { userId } = req.body;

    const documents = await Document.findAll({
      where: {
        user_id: userId,
      },
    });
    res.json({ documents });
  } catch (error) {
    res.status(500).send(`${error}: Internal Server Error`);
  }
};
