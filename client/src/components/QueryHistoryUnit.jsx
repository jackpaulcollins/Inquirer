import React, { useState } from 'react';
import PropTypes from 'prop-types';
import QueryHistoryUnitFeedbackModal from './QueryHistoryUnitFeedbackModal';

const formatttedDateTime = (dateTimeStr) => {
  const dateTime = new Date(dateTimeStr);
  const dateOptions = {
    month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };
  const formattedDate = new Intl.DateTimeFormat('default', dateOptions).format(dateTime);
  return formattedDate;
};

function QueryHistoryUnit({ queryableUnit, userId, showFlash }) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleReportClick = () => {
    setIsFeedbackModalOpen(true);
  };

  return (
    <div
      className={`p-2 rounded-lg ${
        queryableUnit.queryable_type === 'question'
          ? 'bg-gray-200 self-end mr-2'
          : 'bg-blue-200 self-start ml-2'
      }`}
    >
      <p className="font-bold">{formatttedDateTime(queryableUnit.createdAt, 'MMM, Do')}</p>
      <p>{queryableUnit.content}</p>
      {queryableUnit.queryable_type === 'answer' ? (
        <button type="button" onClick={handleReportClick}>
          <span className="text-sm font-sans underline">Report</span>
        </button>
      ) : null}
      <QueryHistoryUnitFeedbackModal
        queryableUnit={queryableUnit}
        open={isFeedbackModalOpen}
        userId={userId}
        onClose={() => setIsFeedbackModalOpen(false)}
        showFlash={showFlash}
      />
    </div>
  );
}

QueryHistoryUnit.propTypes = {
  queryableUnit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    queryable_type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    document_id: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  userId: PropTypes.number.isRequired,
  showFlash: PropTypes.func.isRequired,
};

export default QueryHistoryUnit;
