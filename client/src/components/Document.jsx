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

function Document() {
  const [documentContent, setDocumentContent] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [queryables, setQueryables] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
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

  const clearFlashMessage = () => {
    setFlashMessage(null);
    setShowFlash(false);
  };

  const shouldShowFlash = () => {
    setShowFlash(true);
  };

  const queryDocument = async (e) => {
    setIsTyping(true);
    e.preventDefault();
    await api.post(`/documents/${id}/query`, {
      question,
    });
    setIsTyping(false);
    fetchQueryables();
    setQuestion('');
  };

  useEffect(() => {
    const flash = localStorage.getItem('flashMessage');
    if (flash && showFlash) {
      setFlashMessage(flash);

      setTimeout(() => {
        clearFlashMessage();
      }, 3000);
    }

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
  }, [showFlash]);

  const querySection = () => (
    <div>
      <QueryHistory
        queryables={queryables}
        isTyping={isTyping}
        userId={userContextValue.userId}
        showFlash={shouldShowFlash}
      />
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
    <div>
      { flashMessage && (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{flashMessage}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg onClick={() => clearFlashMessage()} className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.95 5.37l-.92-.92L10 9.08 5.97 4.45l-.92.92L9.08 10l-4.63 4.03.92.92L10 10.92l4.03 4.63.92-.92L10.92 10l4.03-4.63z" />
          </svg>
        </span>
      </div>
      )}
      <div className=" w-9/12 m-auto mt-4 flex flex-row">
        <div className="w-3/5">
          <DocumentDisplay documentContent={documentContent} documentType={documentType} />
        </div>
        <div className="mr-4 p-8 flex flex-col w-2/5 shadow-md rounded-md">
          {querySection()}
        </div>
      </div>
    </div>
  );
}

export default Document;
