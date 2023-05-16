/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Typing from './Typing';
import QueryHistoryUnit from './QueryHistoryUnit';

function QueryHistory({ queryables, isTyping }) {
  const endMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endMessagesRef.current.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(scrollToBottom, [queryables, isTyping]);

  return (
    <div className="max-h-[700px] flex flex-col space-y-4 overflow-y-scroll">
      {queryables && queryables.map((queryableUnit) => <QueryHistoryUnit key={queryableUnit.id} queryableUnit={queryableUnit} />)}
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
