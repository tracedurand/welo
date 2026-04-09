const express = require('express');
const path = require('path');
const ejs = require('ejs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const pool = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"]
    }
  }
}));
app.disable('x-powered-by');

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// Page renderer
function renderPage(res, page, data = {}) {
  const viewsDir = path.join(__dirname, 'src', 'views');
  const pagePath = path.join(viewsDir, 'pages', `${page}.ejs`);

  ejs.renderFile(pagePath, data, (err, content) => {
    if (err) {
      console.error('Template render error:', err.message);
      return res.status(500).render('layouts/main', {
        title: 'Error | Welo',
        content: '<section class="hero" style="text-align:center;padding:200px 24px 100px;"><h1 style="color:#fff;">Something went wrong</h1><p style="color:#ABB5BE;">Please try again later.</p></section>'
      });
    }
    res.render('layouts/main', { ...data, content });
  });
}

// Routes
app.get('/', (req, res) => {
  renderPage(res, 'index', {
    title: 'Welo | AI-Powered Cybersecurity Platform'
  });
});

app.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products ORDER BY sort_order ASC'
    );
    renderPage(res, 'products', {
      title: 'Firewall Products | Welo',
      products: rows
    });
  } catch (err) {
    console.error('Database query error:', err.message);
    renderPage(res, 'index', {
      title: 'Error | Welo'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404);
  renderPage(res, 'index', {
    title: 'Page Not Found | Welo'
  });
});

// Express error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).render('layouts/main', {
    title: 'Error | Welo',
    content: '<section class="hero" style="text-align:center;padding:200px 24px 100px;"><h1 style="color:#fff;">Something went wrong</h1><p style="color:#ABB5BE;">Please try again later.</p></section>'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Welo site running at http://localhost:${PORT}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    pool.end().then(() => {
      console.log('Database pool closed.');
      process.exit(0);
    });
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  shutdown('uncaughtException');
});
