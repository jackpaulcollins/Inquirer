/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../utils/api';
// eslint-disable-next-line import/extensions
import { UserContext } from '../contexts/userContext.js';

function DocumentUpload() {
  const [document, setDocument] = useState(undefined);
  const { userContextValue } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('document', document);
    formData.append('document_type', document.type);
    formData.append('user_id', userContextValue.userId);

    const response = await api.post('/documents/upload', formData);

    const { documentId } = response.data;

    navigate(`/documents/${documentId}`);
  };

  const documentOrForm = () => {
    if (!document) {
      return (
        <div className="flex items-center justify-center bg-grey-lighter mb-5">
          <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">
              Upload a Document!
            </span>
            <input
              className="hidden"
              type="file"
              accept="text/plain, application/pdf"
              multiple={false}
              name="document"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file.type === 'text/plain' || file.type === 'application/pdf') {
                  setDocument(file);
                } else {
                  // eslint-disable-next-line no-alert
                  alert('Please select a text file or a PDF file');
                }
              }}
            />
          </label>
        </div>
      );
    }
    return (
      <span>{document.name}</span>
    );
  };

  return (
    <div>
      <div className="flex w-screen justify-center mt-20">
        <div className="w-1/2 rounded-lg shadow-lg bg-white p-5">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-5 ml-3">
              <button
                type="submit"
                className="
                mr-10
                mt-5
                px-6
                py-2.5
                bg-blue-600
                text-white
                font-medium
                text-xs
                leading-tight
                uppercase
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out"
              >
                Submit
              </button>
              {documentOrForm()}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
