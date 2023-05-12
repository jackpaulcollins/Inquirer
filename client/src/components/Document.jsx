/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../utils/api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

function DocumentViewer() {
  const [documentContent, setDocumentContent] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const determineDocumentType = (type) => {
    if (type === 'text/plain') {
      return 'text';
    } if (type === 'application/pdf') {
      return 'pdf';
    }
    return 'unknown';
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setPageNumber(1);
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const queryDocument = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await api.post(`/documents/${id}/query`, {
      question,
    });

    const answerResponse = response.data.answer.text;
    setAnswer(answerResponse);
    setLoading(false);
  };

  const options = {
    cMapUrl: 'cmaps/',
    standardFontDataUrl: 'standard_fonts/',
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const fetchDocumentUrl = async () => {
      const response = await api.get(`/documents/${id}`, {
        responseType: 'blob',
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
  }, [id]);

  const querySection = () => (
    <>
      <form className="mt-20" onSubmit={queryDocument}>
        <div className="mb-6">
          <label htmlFor="question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} type="text" id="question" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="...query your document" required />
          </label>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
      {loading ? (
        <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10" />
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded" />
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2" />
                  <div className="h-2 bg-slate-700 rounded col-span-1" />
                </div>
                <div className="h-2 bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        answer && (
          <p>
            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
              {answer}
            </div>
          </p>
        )
      )}
    </>
  );

  if (documentType) {
    const type = determineDocumentType(documentType);

    if (type === 'text') {
      return (
        <div className="inline-flex flex-shrink-0 mt-8 items-center rounded-md px-2 py-2 text-xs font-medium text-green-700 ring-2 ring-green-600/20" style={{ height: '800px', overflow: 'auto' }}>
          {documentContent}
        </div>
      );
    } if (documentContent && type === 'pdf') {
      return (
        <div className=" w-full mx-auto flex flex-row">
          <Document file={documentContent} onLoadSuccess={onDocumentLoadSuccess} options={options}>
            <Page pageNumber={pageNumber} />
            <div className="w-1/4 m-auto flex flex-col items-center">
              <div className="inline-flex">
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={goToPrevPage}>Prev</button>
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={goToNextPage}>Next</button>
              </div>
              <p>
                {' '}
                {pageNumber}
                {' '}
                of
                {' '}
                {numPages}
              </p>
            </div>
          </Document>
          <div className=" w-1/2 flex flex-col ml-4">
            {querySection()}
          </div>
        </div>
      );
    }
    return (
      <div className="inline">
        Unknown document type
      </div>
    );
  }
  return null;
}

export default DocumentViewer;
