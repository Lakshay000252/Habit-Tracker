const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lakshay-Arpit Habit AI App API',
      version: '1.0.0',
      description: 'Production-ready REST API for AI-Powered Daily Habit Tracker & Motivation Assistant',
      contact: {
        name: 'Lakshay-Arpit Habit AI App Support',
        email: 'support@habitai.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.habitai.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login/register',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Habit: {
          type: 'object',
          required: ['habitName', 'category'],
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            habitName: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string', enum: ['study', 'exercise', 'reading', 'meditation', 'water', 'custom'] },
            targetFrequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
            reminderTime: { type: 'string' },
            color: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Progress: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            habitId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            completed: { type: 'boolean' },
            note: { type: 'string' },
          },
        },
        Achievement: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            type: { type: 'string', enum: ['streak', 'milestone', 'consistency', 'special'] },
            unlockedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'User', description: 'User profile management' },
      { name: 'Habits', description: 'Habit CRUD operations' },
      { name: 'Progress', description: 'Daily habit tracking' },
      { name: 'Analytics', description: 'Dashboard analytics' },
      { name: 'AI', description: 'AI-powered motivation and suggestions' },
    ],
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const addApiDocs = (spec) => {
  spec.paths = {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error or email exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'john@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Reset email sent' } },
      },
    },
    '/api/auth/reset-password/{token}': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: { password: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Password reset successful' } },
      },
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'New tokens generated' } },
      },
    },
    '/api/user/profile': {
      get: {
        tags: ['User'],
        summary: 'Get user profile',
        responses: { 200: { description: 'User profile' } },
      },
      put: {
        tags: ['User'],
        summary: 'Update user profile',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  avatar: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/api/user/change-password': {
      put: {
        tags: ['User'],
        summary: 'Change password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Password changed' } },
      },
    },
    '/api/habits': {
      post: {
        tags: ['Habits'],
        summary: 'Create a new habit',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['habitName', 'category'],
                properties: {
                  habitName: { type: 'string', example: 'Morning Meditation' },
                  description: { type: 'string' },
                  category: { type: 'string', enum: ['study', 'exercise', 'reading', 'meditation', 'water', 'custom'] },
                  targetFrequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
                  reminderTime: { type: 'string', example: '08:00' },
                  color: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Habit created' } },
      },
      get: {
        tags: ['Habits'],
        summary: 'Get all user habits',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'oldest', 'name'] } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'List of habits' } },
      },
    },
    '/api/habits/{id}': {
      get: {
        tags: ['Habits'],
        summary: 'Get a single habit',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Habit details' } },
      },
      put: {
        tags: ['Habits'],
        summary: 'Update a habit',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Habit' },
            },
          },
        },
        responses: { 200: { description: 'Habit updated' } },
      },
      delete: {
        tags: ['Habits'],
        summary: 'Delete a habit',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Habit deleted' } },
      },
    },
    '/api/progress/complete': {
      post: {
        tags: ['Progress'],
        summary: 'Mark habit as completed',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['habitId'],
                properties: {
                  habitId: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                  note: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Habit completed' } },
      },
    },
    '/api/progress/incomplete': {
      post: {
        tags: ['Progress'],
        summary: 'Mark habit as incomplete',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['habitId'],
                properties: {
                  habitId: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Habit marked incomplete' } },
      },
    },
    '/api/progress/history': {
      get: {
        tags: ['Progress'],
        summary: 'Get progress history',
        parameters: [
          { name: 'habitId', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Progress records' } },
      },
    },
    '/api/progress/daily': {
      get: {
        tags: ['Progress'],
        summary: 'Get daily progress summary',
        parameters: [{ name: 'date', in: 'query', schema: { type: 'string', format: 'date' } }],
        responses: { 200: { description: 'Daily progress' } },
      },
    },
    '/api/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Get dashboard analytics',
        responses: { 200: { description: 'Dashboard analytics data' } },
      },
    },
    '/api/analytics/habit/{habitId}': {
      get: {
        tags: ['Analytics'],
        summary: 'Get habit-specific analytics',
        parameters: [{ name: 'habitId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Habit analytics' } },
      },
    },
    '/api/ai/motivate': {
      post: {
        tags: ['AI'],
        summary: 'Get AI-generated motivation',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mood: { type: 'string', enum: ['happy', 'sad', 'lazy', 'stressed', 'motivated'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Motivational message' } },
      },
    },
    '/api/ai/suggestions': {
      post: {
        tags: ['AI'],
        summary: 'Get AI-generated habit suggestions',
        responses: { 200: { description: 'Smart suggestions' } },
      },
    },
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        responses: { 200: { description: 'API is healthy' } },
      },
    },
  };

  return spec;
};

module.exports = addApiDocs(swaggerSpec);
