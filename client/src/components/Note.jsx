import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../utils/api';

function Note() {
  const [note, setNote] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNoteContent, setEditedNoteContent] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(null);
  const { id } = useParams();

  const fetchNote = async () => {
    try {
      const response = await api.get(`/notes/${id}`);
      setNote(response.data.note);
      setEditedNoteContent(response.data.note.content);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.response.status);
    }
  };

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line
  }, []);

  const destroyNote = async () => {
    try {
      const response = await api.delete(`/notes/${id}`);
      setNote(response.data.note);
      setIsLoading(false);
      setShouldNavigate(true);
    } catch (error) {
      setErrorMessage(error.response.status);
    }
  };

  const saveNote = async () => {
    if (editedNoteContent === note.content) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await api.put(`/notes/${id}`, { content: editedNoteContent });
      setNote(response.data.note);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.response.status);
    }
  };

  if (shouldNavigate) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex-row justify-between mt-20">
      <div className="w-1/2 m-auto flex flex-col justify-evenly bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
        {errorMessage}
        {isEditing ? (
          <textarea
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your note here..."
            name="content"
            id="content"
            value={editedNoteContent}
            onChange={(e) => setEditedNoteContent(e.target.value)}
          />

        ) : (
          <span className="inline-flex flex-shrink-0 items-center rounded-md bg-green-50 px-2 py-2 text-xs font-medium text-green-700 ring-2 ring-green-600/20">
            {note.content}
          </span>
        )}

        <div className="w-full mt-4">
          {isEditing ? (
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={saveNote}
              >
                Save
              </button>
              <button
                type="button"
                className="ml-4 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onClick={() => destroyNote()}
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="inline-flex items-center mt-4 gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Note;
