// Quick Backend Test
const fetch = require('node-fetch');

async function quickTest() {
  console.log('🧪 Quick Backend Test...\n');

  try {
    // Test World Creation
    const worldResponse = await fetch('http://localhost:3000/api/worlds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Quick Test World',
        description: 'Testing backend saving functionality',
        genre: 'Fantasy',
        setting: 'Test Setting'
      })
    });

    const worldData = await worldResponse.json();
    console.log('World Creation:', worldData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (worldData.success) {
      console.log('World ID:', worldData.data.id);
    }

    // Test Story Creation
    const storyResponse = await fetch('http://localhost:3000/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Quick Test Story',
        description: 'Testing story saving',
        genre: 'Fantasy',
        authorId: 'test-user-1'
      })
    });

    const storyData = await storyResponse.json();
    console.log('Story Creation:', storyData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (storyData.success) {
      console.log('Story ID:', storyData.data.id);
    }

    // Test AI Generation
    const generationResponse = await fetch('http://localhost:3000/api/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Test AI generation content',
        type: 'test',
        prompt: 'Test prompt'
      })
    });

    const generationData = await generationResponse.json();
    console.log('AI Generation:', generationData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (generationData.success) {
      console.log('Generation ID:', generationData.generation.id);
    }

    console.log('\n🎉 Backend saving is working!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

quickTest();

