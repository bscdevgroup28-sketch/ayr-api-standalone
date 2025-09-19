const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ayr-api',
    version: '1.0.0'
  });
});

// Minimal registration endpoint for testing
app.post('/v1/auth/register', (req, res) => {
  try {
    const { email, password, organizationName } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Email and password are required'
        }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Password must be at least 8 characters long'
        }
      });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Invalid email format'
        }
      });
    }

    // Mock successful registration response
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: 'user_' + Date.now(),
        email,
        organizationId: 'org_default'
      },
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      expires_in: 900
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Internal server error'
      }
    });
  }
});

// Minimal login endpoint for testing
app.post('/v1/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Email and password are required'
        }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Password must be at least 8 characters long'
        }
      });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: {
          code: 'validation_error',
          message: 'Invalid email format'
        }
      });
    }

    // Mock successful login response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: 'user_' + Date.now(),
        email,
        organizationId: 'org_default'
      },
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      expires_in: 900
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Internal server error'
      }
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: {
      code: 'internal_error',
      message: 'Internal server error'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`AYR API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});