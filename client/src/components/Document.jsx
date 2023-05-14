/* eslint-disable import/no-extraneous-dependencies */
import React, {
  useState, useEffect, useContext,
} from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line import/extensions
import { UserContext } from '../contexts/userContext.js';
import api from '../utils/api';
import QueryHistory from './QueryHistory';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import DocumentDisplay from './DocumentDisplay';

function DocumentViewer() {
  const [documentContent, setDocumentContent] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [queryables, setQueryables] = useState(null);
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { id } = useParams();
  const { userContextValue } = useContext(UserContext);

  const fetchQueryables = async () => {
    const response = await api.get(`/documents/${id}/queryables?userId=${userContextValue.userId}`, {
      data: { userId: userContextValue.userId },
    });
    const queryableResponse = response.data;
    setQueryables(queryableResponse.queryables);
  };

  const queryDocument = async (e) => {
    setIsTyping(true);
    e.preventDefault();
    await api.post(`/documents/${id}/query`, {
      question,
    });
    setIsTyping(false);
    fetchQueryables();
  };

  useEffect(() => {
    const fetchDocumentUrl = async () => {
      const response = await api.get(`/documents/${id}`, {
        responseType: 'blob',
        data: { userId: userContextValue.userId },
      });

      const { type } = response.data;
      setDocumentType(type);

      if (type === 'text/plain') {
        const reader = new FileReader();
        reader.readAsText(response.data);
        reader.onload = () => {
          const content = reader.result;
          setDocumentContent(content);
        };
      } else if (type === 'application/pdf') {
        let base64String;

        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          base64String = reader.result;
          setDocumentContent(base64String.substr(base64String.indexOf(', ') + 1));
        };
      }
    };

    fetchDocumentUrl();
    fetchQueryables();
  }, []);

  const querySection = () => (
    <div>
      <QueryHistory queryables={queryables} isTyping={isTyping} />
      <form className="mt-2" onSubmit={queryDocument}>
        <div className="mb-6">
          <label htmlFor="question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} type="text" id="question" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="...query your document" required />
          </label>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        <div className="flex flex-col gap-4" />
      </form>
    </div>
  );

  return (
    <div className=" w-full flex flex-row">
      <div className="w-1/2">
        <DocumentDisplay documentContent={documentContent} documentType={documentType} />
      </div>
      <div className="flex flex-col w-1/2">
        {querySection()}
      </div>
    </div>
  );
}

export default DocumentViewer;
