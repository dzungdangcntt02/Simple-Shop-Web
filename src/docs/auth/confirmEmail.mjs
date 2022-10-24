export default {
  post: {
    summary: 'Send email to verify user',
    tags: ['Auth CRUD operations'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'email',
            ],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'must be unique',
              },
            },
            example: {
              email: 'fake@example.com',
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Send email successfully',
        content: {
          'application/json': {
            example: {
              code: 200,
              message: 'Email sent',
              data: [],
            },
          },
        },
      },
      201: {
        description: 'Resend email successfully',
        content: {
          'application/json': {
            example: {
              code: 201,
              message: 'New email sent',
              data: [],
            },
          },
        },
      },
      204: {
        description: 'Email already exists in mailbox with valid token',
        content: {
          'application/json': {
            example: {
              code: 204,
              message: 'Email already exist. Check mailbox',
              data: [],
            },
          },
        },
      },
      400: {
        description: 'Email not exists',
        content: {
          'application/json': {
            example: {
              code: 400,
              message: 'Email not exists',
              data: [],
            },
          },
        },
      },
      403: {
        description: 'Can not activate active or banned account',
        content: {
          'application/json': {
            example: {
              code: 403,
              message: 'Forbidden',
              data: [],
            },
          },
        },
      },
      500: {
        $ref: '#components/responses/InternalServerError',
      },
    },
  },
}
