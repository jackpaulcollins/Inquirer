/* eslint-disable max-len */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import api from '../utils/api';

function QueryHistoryUnitFeedbackModal({
  open, queryableUnit, onClose, userId, showFlash,
}) {
  const [reportText, setReportText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/documents/${queryableUnit.document_id}/queryables/${queryableUnit.id}/feedback`, {
        feedback: reportText,
        answer_id: queryableUnit.id,
        user_id: userId,
      });

      localStorage.setItem('flashMessage', response.data.message);
      showFlash();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Provide correction to answer
                      </Dialog.Title>
                      <div className="mt-2">
                        <blockquote className="p-4 my-4 border-l-4 border-gray-300 bg-gray-100">
                          <p className="italic leading-relaxed text-gray-90">
                            {queryableUnit.content}
                          </p>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4">
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className="border border-gray-300 rounded-lg p-2 w-full mb-2"
                        placeholder="What is the correct answer to this question?"
                        value={reportText}
                        onChange={(event) => setReportText(event.target.value)}
                        required
                      />
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-blue-700 hover:bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                        >
                          Submit Correction
                        </button>
                        <button
                          type="button"
                          className="mt-3  inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Report incorrect information</h2>
          <p className="mb-2">Please describe the issue with this answer:</p>
          <blockquote className="p-4 my-4 border-l-4 border-gray-300 bg-gray-100">
            <p className="italic leading-relaxed text-gray-90">
              {queryableUnit.content}
            </p>
          </blockquote>
          <form onSubmit={handleSubmit}>
            <textarea
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
              placeholder="Describe the issue..."
              value={reportText}
              onChange={(event) => setReportText(event.target.value)}
              required
            />
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            <button type="button" className="ml-2 text-gray-500" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div> */}

    </>
  );
}

QueryHistoryUnitFeedbackModal.propTypes = {
  queryableUnit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    queryable_type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    document_id: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  showFlash: PropTypes.func.isRequired,
};

export default QueryHistoryUnitFeedbackModal;
