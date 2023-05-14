/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Typing from './Typing';

function QueryHistory({ queryables, isTyping }) {
  const endMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endMessagesRef.current.scrollIntoView({ behavior: 'instant' });
  };

  const formatttedDateTime = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const dateOptions = {
      month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
    };
    const formattedDate = new Intl.DateTimeFormat('default', dateOptions).format(dateTime);
    return formattedDate;
  };

  useEffect(scrollToBottom, [queryables, isTyping]);

  return (
    <div className="max-h-[700px] flex flex-col space-y-4 overflow-y-scroll">
      {queryables && queryables.map((queryable) => (
        <div
          key={queryable.id}
          className={`p-2 rounded-lg ${
            queryable.queryable_type === 'question'
              ? 'bg-gray-200 self-end mr-2'
              : 'bg-blue-200 self-start ml-2'
          }`}
        >
          <p className="font-bold">{formatttedDateTime(queryable.createdAt, 'MMM, Do')}</p>
          <p>{queryable.content}</p>
        </div>
      ))}
      {isTyping && (
        <Typing />
      )}
      <div ref={endMessagesRef} />
    </div>
  );
}

QueryHistory.propTypes = {
  // eslint-disable-next-line react/require-default-props
  queryables: PropTypes.array,
  isTyping: PropTypes.bool,
};

QueryHistory.defaultProps = {
  isTyping: false,
};

export default QueryHistory;
