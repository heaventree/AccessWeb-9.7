import express from 'express';

async function testRoutes() {
  try {
    const app = express();
    app.use(express.json());
    
    console.log('Testing route import...');
    const { default: testRouter } = await import('./src/server/routes/wcag-test.js');
    console.log('Router imported successfully:', typeof testRouter);
    
    app.use('/api/wcag-test', testRouter);
    console.log('Router mounted successfully');
    
    // Add debug middleware
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
    
    const server = app.listen(3002, '0.0.0.0', () => {
      console.log('Debug server running on port 3002');
    });
    
    setTimeout(() => {
      server.close();
      console.log('Debug server closed');
    }, 5000);
    
  } catch (e) {
    console.error('Debug error:', e.message);
    console.error('Stack:', e.stack);
  }
}

testRoutes();