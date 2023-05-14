/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

function DocumentDisplay({ documentType, documentContent }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

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

  const options = {
    cMapUrl: 'cmaps/',
    standardFontDataUrl: 'standard_fonts/',
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  if (documentType === 'text/plain') {
    return (
      <div className="inline-flex flex-shrink-0 mt-8 items-center rounded-md px-2 py-2 text-xs font-medium text-green-700 ring-2 ring-green-600/20" style={{ height: '800px', overflow: 'auto' }}>
        {documentContent}
      </div>
    );
  } if (documentContent && documentType === 'application/pdf') {
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
      </div>
    );
  }
  return (
    <div className="inline">
      Unknown document type
    </div>
  );
}

export default DocumentDisplay;
