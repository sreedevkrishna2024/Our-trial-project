// Simple AI Test
const fetch = require('node-fetch');

async function simpleAITest() {
  console.log('🧪 Testing Enhanced AI Output...\n');

  try {
    // Test World Building
    console.log('1. Testing World Building...');
    const worldResponse = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'world',
        prompt: 'Create a magical steampunk world',
        genre: 'Steampunk Fantasy',
        setting: 'Floating Cities'
      })
    });

    const worldData = await worldResponse.json();
    console.log('World Response:', worldData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (worldData.success && worldData.content) {
      console.log('Content Length:', worldData.content.length);
      console.log('First 200 chars:', worldData.content.substring(0, 200));
    }

    // Test Character Generation
    console.log('\n2. Testing Character Generation...');
    const characterResponse = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'character',
        prompt: 'Create a mysterious airship captain',
        role: 'Protagonist',
        genre: 'Steampunk'
      })
    });

    const characterData = await characterResponse.json();
    console.log('Character Response:', characterData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (characterData.success && characterData.content) {
      console.log('Content Length:', characterData.content.length);
      console.log('First 200 chars:', characterData.content.substring(0, 200));
    }

    // Test General Generation
    console.log('\n3. Testing General Generation...');
    const generalResponse = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Help me create a compelling opening scene',
        settings: {
          tone: 'Inspirational',
          temperature: 0.7,
          length: 'Medium'
        },
        template: 'plot'
      })
    });

    const generalData = await generalResponse.json();
    console.log('General Response:', generalData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (generalData.success && generalData.content) {
      console.log('Content Length:', generalData.content.length);
      console.log('First 200 chars:', generalData.content.substring(0, 200));
    }

    console.log('\n🎉 AI Output Enhancement Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleAITest();

