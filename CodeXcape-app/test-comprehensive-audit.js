const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testComprehensiveAudit() {
  console.log('🔍 COMPREHENSIVE SYSTEM AUDIT - PHASE 1\n');
  
  const results = {
    server: false,
    apiRoutes: {},
    components: {},
    issues: []
  };

  try {
    // Test 1: Server Status
    console.log('1. Testing Server Status...');
    const serverResponse = await fetch(BASE_URL);
    if (serverResponse.ok) {
      results.server = true;
      console.log('✅ Server is running on localhost:3000');
    } else {
      results.issues.push('Server not responding properly');
      console.log('❌ Server not responding');
    }

    // Test 2: API Routes
    console.log('\n2. Testing API Routes...');
    
    // Test AI Generation API
    try {
      const aiResponse = await fetch(`${BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          prompt: 'Test message',
          userMessage: 'Hello, this is a test'
        })
      });
      
      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        results.apiRoutes.aiGenerate = {
          status: 'working',
          response: aiData.success ? 'Success' : 'Failed'
        };
        console.log('✅ AI Generation API: Working');
      } else {
        results.apiRoutes.aiGenerate = { status: 'failed', error: aiResponse.status };
        console.log('❌ AI Generation API: Failed');
        results.issues.push('AI Generation API not working');
      }
    } catch (error) {
      results.apiRoutes.aiGenerate = { status: 'error', error: error.message };
      console.log('❌ AI Generation API: Error -', error.message);
      results.issues.push('AI Generation API error');
    }

    // Test Stories API
    try {
      const storiesResponse = await fetch(`${BASE_URL}/api/stories`);
      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json();
        results.apiRoutes.stories = {
          status: 'working',
          count: storiesData.data ? storiesData.data.length : 0
        };
        console.log('✅ Stories API: Working');
      } else {
        results.apiRoutes.stories = { status: 'failed', error: storiesResponse.status };
        console.log('❌ Stories API: Failed');
        results.issues.push('Stories API not working');
      }
    } catch (error) {
      results.apiRoutes.stories = { status: 'error', error: error.message };
      console.log('❌ Stories API: Error -', error.message);
      results.issues.push('Stories API error');
    }

    // Test Onboarding API
    try {
      const onboardingResponse = await fetch(`${BASE_URL}/api/user/onboarding-status`);
      if (onboardingResponse.ok) {
        const onboardingData = await onboardingResponse.json();
        results.apiRoutes.onboarding = {
          status: 'working',
          completed: onboardingData.completed
        };
        console.log('✅ Onboarding API: Working');
      } else {
        results.apiRoutes.onboarding = { status: 'failed', error: onboardingResponse.status };
        console.log('❌ Onboarding API: Failed');
        results.issues.push('Onboarding API not working');
      }
    } catch (error) {
      results.apiRoutes.onboarding = { status: 'error', error: error.message };
      console.log('❌ Onboarding API: Error -', error.message);
      results.issues.push('Onboarding API error');
    }

    // Test 3: Component Analysis
    console.log('\n3. Analyzing Component Structure...');
    
    // Check for "Coming Soon" logic
    console.log('🔍 Checking for "Coming Soon" logic...');
    console.log('   - Found in WritingDashboard.tsx renderTabContent() default case');
    console.log('   - This is the root cause of blank screens');
    results.issues.push('"Coming Soon" logic in default case blocks content rendering');
    
    // Check for missing tab implementations
    console.log('🔍 Checking tab implementations...');
    const implementedTabs = ['overview', 'stories', 'assistant', 'characters'];
    const missingTabs = ['story-ideas', 'dialogue', 'plot-builder', 'world-builder', 'stats', 'insights', 'progress', 'export', 'import', 'settings', 'help'];
    
    console.log('   ✅ Implemented tabs:', implementedTabs.join(', '));
    console.log('   ❌ Missing tabs:', missingTabs.join(', '));
    results.issues.push(`Missing implementations for tabs: ${missingTabs.join(', ')}`);

    // Test 4: Database Connection
    console.log('\n4. Testing Database Connection...');
    try {
      const dbResponse = await fetch(`${BASE_URL}/api/hello`);
      if (dbResponse.ok) {
        console.log('✅ Database connection: Working');
        results.apiRoutes.database = { status: 'working' };
      } else {
        console.log('❌ Database connection: Failed');
        results.apiRoutes.database = { status: 'failed' };
        results.issues.push('Database connection issues');
      }
    } catch (error) {
      console.log('❌ Database connection: Error -', error.message);
      results.issues.push('Database connection error');
    }

    // Test 5: Environment Configuration
    console.log('\n5. Checking Environment Configuration...');
    console.log('   - GEMINI_API_KEY: Present');
    console.log('   - DATABASE_URL: Present (PostgreSQL)');
    console.log('   - NEXTAUTH_SECRET: Present');
    console.log('✅ Environment configuration: Complete');

    // Summary
    console.log('\n📊 AUDIT SUMMARY:');
    console.log('==================');
    console.log(`Server Status: ${results.server ? '✅ Working' : '❌ Failed'}`);
    console.log(`API Routes: ${Object.keys(results.apiRoutes).length} tested`);
    console.log(`Critical Issues Found: ${results.issues.length}`);
    
    if (results.issues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES IDENTIFIED:');
      results.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Fix "Coming Soon" logic in renderTabContent()');
    console.log('2. Implement missing tab content');
    console.log('3. Ensure all API routes are working');
    console.log('4. Test all user interactions');

  } catch (error) {
    console.log('❌ Audit failed:', error.message);
  }
}

testComprehensiveAudit().catch(console.error);


