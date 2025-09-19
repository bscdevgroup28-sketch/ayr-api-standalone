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

// Demo user accounts for different personas
const demoUsers = {
  'demo.customer@ayr.com': {
    id: 'demo_customer_001',
    email: 'demo.customer@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_customer',
    role: 'customer',
    persona: 'first-time-customer'
  },
  'demo.medical@ayr.com': {
    id: 'demo_medical_001',
    email: 'demo.medical@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_medical',
    role: 'customer',
    persona: 'medical-patient'
  },
  'demo.regular@ayr.com': {
    id: 'demo_regular_001',
    email: 'demo.regular@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_regular',
    role: 'customer',
    persona: 'regular-shopper'
  },
  'demo.browser@ayr.com': {
    id: 'demo_browser_001',
    email: 'demo.browser@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_browser',
    role: 'customer',
    persona: 'curious-browser'
  },
  'demo.manager@ayr.com': {
    id: 'demo_manager_001',
    email: 'demo.manager@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_manager',
    role: 'admin',
    persona: 'store-manager'
  },
  'demo.clerk@ayr.com': {
    id: 'demo_clerk_001',
    email: 'demo.clerk@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_clerk',
    role: 'staff',
    persona: 'inventory-clerk'
  },
  'demo.admin@ayr.com': {
    id: 'demo_admin_001',
    email: 'demo.admin@ayr.com',
    password: 'DemoPass123!',
    organizationId: 'demo_org_admin',
    role: 'admin',
    persona: 'admin-user'
  }
};

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

    // Check if this is a demo user
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.password === password) {
      return res.status(200).json({
        message: 'Demo login successful',
        user: {
          id: demoUser.id,
          email: demoUser.email,
          organizationId: demoUser.organizationId,
          role: demoUser.role,
          persona: demoUser.persona
        },
        access_token: 'demo_access_token_' + Date.now(),
        refresh_token: 'demo_refresh_token_' + Date.now(),
        expires_in: 3600, // 1 hour for demo
        isDemo: true
      });
    }

    // Mock successful login response for regular users
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

// Sample product data for demonstration
const sampleProducts = [
  {
    id: 'prod_001',
    name: 'Blue Dream',
    category: 'Flower',
    strain: 'Hybrid',
    thc: 18.5,
    cbd: 0.1,
    price: 45.00,
    description: 'A sativa-dominant hybrid known for its sweet berry aroma and balanced effects.',
    imageUrl: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Blue+Dream',
    inStock: true,
    quantity: 25
  },
  {
    id: 'prod_002',
    name: 'OG Kush',
    category: 'Flower',
    strain: 'Indica',
    thc: 22.0,
    cbd: 0.5,
    price: 50.00,
    description: 'A classic indica strain with pine and earth aromas, known for relaxation.',
    imageUrl: 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=OG+Kush',
    inStock: true,
    quantity: 18
  },
  {
    id: 'prod_003',
    name: 'Sour Diesel',
    category: 'Flower',
    strain: 'Sativa',
    thc: 20.1,
    cbd: 0.2,
    price: 42.00,
    description: 'An energizing sativa with diesel-like aroma and uplifting effects.',
    imageUrl: 'https://via.placeholder.com/300x300/FFD700/000000?text=Sour+Diesel',
    inStock: true,
    quantity: 32
  },
  {
    id: 'prod_004',
    name: 'Girl Scout Cookies',
    category: 'Flower',
    strain: 'Hybrid',
    thc: 19.8,
    cbd: 0.3,
    price: 48.00,
    description: 'A sweet hybrid with minty, earthy flavors and balanced euphoria.',
    imageUrl: 'https://via.placeholder.com/300x300/228B22/FFFFFF?text=GSC',
    inStock: false,
    quantity: 0
  },
  {
    id: 'prod_005',
    name: 'CBD Gummies',
    category: 'Edibles',
    strain: 'CBD',
    thc: 0.0,
    cbd: 25.0,
    price: 25.00,
    description: 'Relaxing CBD gummies for wellness and stress relief.',
    imageUrl: 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=CBD+Gummies',
    inStock: true,
    quantity: 45
  }
];

// Sample inventory data
const sampleInventory = [
  {
    id: 'inv_001',
    productId: 'prod_001',
    locationId: 'store_main',
    quantity: 25,
    reserved: 3,
    available: 22,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv_002',
    productId: 'prod_002',
    locationId: 'store_main',
    quantity: 18,
    reserved: 0,
    available: 18,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv_003',
    productId: 'prod_003',
    locationId: 'store_main',
    quantity: 32,
    reserved: 5,
    available: 27,
    lastUpdated: new Date().toISOString()
  }
];

// Sample stores data
const sampleStores = [
  {
    id: 'store_main',
    name: 'AYR Downtown Dispensary',
    address: '123 Main St, Downtown',
    phone: '(555) 123-4567',
    hours: '9 AM - 9 PM Daily',
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: 'store_north',
    name: 'AYR North End',
    address: '456 North Ave, North District',
    phone: '(555) 234-5678',
    hours: '10 AM - 8 PM Daily',
    latitude: 40.7282,
    longitude: -73.7949
  }
];

// Products endpoints
app.get('/v1/products', (req, res) => {
  try {
    const { category, strain, inStock } = req.query;
    
    let filteredProducts = [...sampleProducts];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (strain) {
      filteredProducts = filteredProducts.filter(p => p.strain === strain);
    }
    
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    
    res.json({
      products: filteredProducts,
      total: filteredProducts.length,
      filters: { category, strain, inStock }
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Internal server error'
      }
    });
  }
});

app.get('/v1/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = sampleProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        error: {
          code: 'not_found',
          message: 'Product not found'
        }
      });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Internal server error'
      }
    });
  }
});

// Inventory endpoints
app.get('/v1/inventory', (req, res) => {
  try {
    const { locationId, productId } = req.query;
    
    let filteredInventory = [...sampleInventory];
    
    if (locationId) {
      filteredInventory = filteredInventory.filter(i => i.locationId === locationId);
    }
    
    if (productId) {
      filteredInventory = filteredInventory.filter(i => i.productId === productId);
    }
    
    // Enrich with product data
    const enrichedInventory = filteredInventory.map(inv => {
      const product = sampleProducts.find(p => p.id === inv.productId);
      return {
        ...inv,
        product: product ? {
          id: product.id,
          name: product.name,
          category: product.category,
          strain: product.strain,
          price: product.price
        } : null
      };
    });
    
    res.json({
      inventory: enrichedInventory,
      total: enrichedInventory.length
    });
  } catch (error) {
    console.error('Inventory error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Internal server error'
      }
    });
  }
});

app.get('/v1/inventory/:locationId', (req, res) => {
  try {
    const { locationId } = req.params;
    const locationInventory = sampleInventory.filter(i => i.locationId === locationId);
    
    if (locationInventory.length === 0) {
      return res.status(404).json({
        error: {
          code: 'not_found',
          message: 'No inventory found for this location'
        }
      });
    }
    
    // Enrich with product data
    const enrichedInventory = locationInventory.map(inv => {
      const product = sampleProducts.find(p => p.id === inv.productId);
      return {
        ...inv,
        product: product ? {
          id: product.id,
          name: product.name,
          category: product.category,
          strain: product.strain,
          price: product.price
        } : null
      };
    });
    
    res.json({
      locationId,
      inventory: enrichedInventory,
      total: enrichedInventory.length
    });
  } catch (error) {
    console.error('Location inventory error:', error);
    res.status(500).json({
      error: {
        code: 'internal_error',
        message: 'Internal server error'
      }
    });
  }
});

// Stores endpoints
app.get('/v1/stores', (req, res) => {
  try {
    res.json({
      stores: sampleStores,
      total: sampleStores.length
    });
  } catch (error) {
    console.error('Stores error:', error);
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