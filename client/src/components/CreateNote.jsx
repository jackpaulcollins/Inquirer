import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
// eslint-disable-next-line import/extensions
import { UserContext } from '../contexts/userContext.js';

function CreateNote() {
  const { userContextValue } = useContext(UserContext);
  const [content, setContent] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(null);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notes/create', {
        content,
        userId: userContextValue.userId,
      });
      setShouldNavigate(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  if (shouldNavigate) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex justify-center mt-20">
      <form onSubmit={handleCreateNote} className="w-2/3 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        <h1 className="text-base font-semibold leading-7 text-gray-900">Create a new Note</h1>
        <div className="mt-10 mb-10">
          <div className="mt-2">
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <textarea
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your note here..."
                name="content"
                id="content"
                value={content}
                onChange={handleContentChange}
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => setShouldNavigate(true)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNote;
