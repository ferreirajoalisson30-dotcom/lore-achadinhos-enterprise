// backend/server.js - CommonJS Version (Render Compatible)
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "lore-secret-dev";

app.use(cors());
app.use(helmet());
app.use(express.json());

// Serve static files from frontend if needed
app.use(express.static(path.join(__dirname, '../frontend')));

// Basic routes
app.get("/api/products", async (req, res) => {
  try {
    const productsFile = path.join(__dirname, "data/products.json");
    const products = JSON.parse(fs.readFileSync(productsFile, "utf8"));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar produtos", details: err.message });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const usersFile = path.join(__dirname, "data/users.json");
    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar usuários", details: err.message });
  }
});

// Simple auth route for login (returns token)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const usersFile = path.join(__dirname, "data/users.json");
  
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        categories: user.categories || [] 
      }, 
      JWT_SECRET, 
      { expiresIn: "12h" }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        categories: user.categories || [] 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// Enterprise dashboard endpoint
app.get("/api/enterprise/dashboard", async (req, res) => {
  try {
    const dashboardData = {
      overview: {
        totalSales: 15420.50,
        totalOrders: 342,
        totalCustomers: 189,
        conversionRate: 3.2,
        averageOrderValue: 45.08
      },
      analytics: {
        traffic: {
          total: 10542,
          organic: 6542,
          direct: 2341,
          social: 1659
        },
        salesFunnel: {
          visitors: 10542,
          addedToCart: 845,
          reachedCheckout: 456,
          completedPurchase: 342
        }
      },
      marketing: {
        emailCampaigns: 12,
        activeCoupons: 5,
        affiliatePerformance: 87.5
      },
      system: {
        performance: 98.7,
        security: 'protected',
        backups: 'auto',
        updates: 'current'
      }
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dashboard enterprise' });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "API Lore Achadinhos Enterprise", 
    version: "2.0.0",
    message: "Backend funcionando corretamente",
    endpoints: {
      health: "/api/health",
      products: "/api/products",
      login: "/api/auth/login",
      dashboard: "/api/enterprise/dashboard",
      adminUsers: "/api/admin/users"
    }
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`🚀 Lore Achadinhos Enterprise API rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/enterprise/dashboard`);
});