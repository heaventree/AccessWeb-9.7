import 'dotenv/config';
import siteScannerQueue from './siteScanner.js';

// Test the job queue system
async function testJobQueue() {
  try {
    // Production logging: '🧪 [TEST] Starting job queue test...');
    
    // Initialize the job queue
    await siteScannerQueue.initialize();
    
    // Wait for system to stabilize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get initial stats
    const stats = await siteScannerQueue.getJobStats();
    // Production logging: '📊 [TEST] Initial job queue stats:', JSON.stringify(stats, null, 2));
    
    // Test triggering a manual scan
    // Production logging: '🚀 [TEST] Triggering test scan job...');
    
    const testJobData = {
      connectionId: 999,
      userId: 1,
      siteName: 'Test Website',
      siteUrl: 'https://example.com',
      platform: 'wordpress',
      frequency: 'manual'
    };
    
    await siteScannerQueue.boss.send('site-accessibility-scan', testJobData);
    
    // Production logging: '✅ [TEST] Test job queued successfully');
    
    // Wait for job to process
    // Production logging: '⏳ [TEST] Waiting for job to process...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Get final stats
    const finalStats = await siteScannerQueue.getJobStats();
    // Production logging: '📊 [TEST] Final job queue stats:', JSON.stringify(finalStats, null, 2));
    
    // Production logging: '✅ [TEST] Job queue test completed successfully');
    
  } catch (error) {
    // console.error('❌ [TEST] Job queue test failed:', error);
  } finally {
    // Shutdown gracefully
    await siteScannerQueue.shutdown();
    process.exit(0);
  }
}

// Run the test
testJobQueue();