export const _id = {
  type: 'string',
  description: 'An id of a contact',
  example: '63390ffb769306d131512c00',
}

export const Error = {
  type: 'object',
  properties: {
    code: {
      type: 'number',
    },
    message: {
      type: 'string',
    },
    data: {
      AnyValue: {
        nullable: true,
        description: 'Can be any value, default is []',
      },
    },
  },
}

export const ResponseError = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code of error',
    },
    message: {
      type: 'string',
    },
  },
}

export const ResponseSuccess = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'code of response',
    },
    message: {
      type: 'string',
    },
    data: {
      allOf: [
        {
          type: 'array',
        },
        {
          type: 'object',
        },
      ],
    },
  },
}
