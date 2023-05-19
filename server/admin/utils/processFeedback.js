/* eslint-disable import/no-named-as-default */
import Queryable from '../../models/Queryable.js';
import Document from '../../models/Document.js';
import llmApi from '../../utils/llmApi.js';

export const processFeedback = async (record) => {
  // eslint-disable-next-line camelcase
  const { answer_id } = record.params;
  const answerRecord = await Queryable.findByPk(answer_id);
  const questionRecord = await Queryable.findByPk(answerRecord.reference_id);
  const document = await Document.findByPk(questionRecord.document_id);
  const { feedback } = record.params;
  const answer = answerRecord.content;
  const question = questionRecord.content;
  const feedBackObj = { question, answer, feedback };

  const updates = llmApi.updateVectorStoreWithFeedback(feedBackObj, document.title);

  return (feedBackObj);
};

export default processFeedback;
