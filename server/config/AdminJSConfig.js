import User from '../models/User.js';
import { Queryable } from '../models/Queryable.js';
import Document from '../models/Document.js';
import { Feedback } from '../models/Feedback.js';

const adminJsConfig = {
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: {
            isVisible: {
              edit: false,
              show: false,
              list: false,
              filter: false,
            },
          },
        },
      },
    },
    {
      resource: Queryable,
    },
    {
      resource: Document,
    },
    {
      resource: Feedback,
      options: {
        actions: {
          approve: {
            actionType: 'record',
            component: false,
            handler: async (request, response, context) => {
              const { record } = context;
              return response.json(record);
            },
            guard: "Confirm submission, this can't be undone",
          },
        },
      },
    },
  ],
};

export default adminJsConfig;
