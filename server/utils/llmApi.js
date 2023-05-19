/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import path from 'path';
import pdfUtil from 'pdf-to-text';
import util from 'util';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain, loadQAChain } from 'langchain/chains';

class llmApi {
  static buildAndSaveVectorStore = async (filePath, VECTOR_STORE_PATH, textParam = null) => {
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

  static buildVectorStorePath = (title) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '..', 'vector_store', `${title}.index`);
  };

  static loadVectorStore = async (VECTOR_STORE_PATH) => {
    try {
      const vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
      return vectorStore;
    } catch (error) {
      console.log(`Error loading vector store ${error}`);
    }
  };

  static queryVectorStore = async (vectorStore, question) => {
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

  static maybeExtractPdfText = async (file) => {
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

  static updateVectorStoreWithFeedback = async (feedback, docTitle) => {
    try {
      const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
      const docs = await textSplitter.createDocuments([JSON.stringify(feedback)]);
      const vectorStorePath = this.buildVectorStorePath(docTitle);
      const vectorStore = await this.loadVectorStore(vectorStorePath);

      const newVectors = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      }));

      console.log(newVectors);

      await vectorStore.addVectors(newVectors, docs);

      console.log('Vector store updated');
      return { message: 'success' };
    } catch (error) {
      console.error('Vector store update failed:', error);
    }
  };
}

export default llmApi;
