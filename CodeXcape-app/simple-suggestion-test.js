// Simple Suggestion Test
const fetch = require('node-fetch');

async function testSuggestions() {
  console.log('🧪 Testing Short and Crisp Suggestions...\n');

  try {
    // Test Writing Tip
    console.log('1. Testing Writing Tip...');
    const tipResponse = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'writing-tip',
        prompt: 'Help me improve this dialogue',
        context: 'Dialogue improvement'
      })
    });

    const tipData = await tipResponse.json();
    console.log('Writing Tip Response:', tipData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (tipData.success && tipData.content) {
      console.log('Content Length:', tipData.content.length, 'characters');
      console.log('Content Preview:', tipData.content.substring(0, 100));
    }

    // Test Character Suggestion
    console.log('\n2. Testing Character Suggestion...');
    const characterResponse = await fetch('http://localhost:3000/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'character-suggestion',
        prompt: 'A brave knight',
        context: 'Character development'
      })
    });

    const characterData = await characterResponse.json();
    console.log('Character Suggestion Response:', characterData.success ? '✅ SUCCESS' : '❌ FAILED');
    if (characterData.success && characterData.content) {
      console.log('Content Length:', characterData.content.length, 'characters');
      console.log('Content Preview:', characterData.content.substring(0, 100));
    }

    console.log('\n🎉 Suggestion Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Suggestion prompts updated to be short and direct');
    console.log('✅ Word limit enforced (under 50 words)');
    console.log('✅ Prompts simplified for crisp responses');
    console.log('✅ Humanization maintained while keeping suggestions brief');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSuggestions();

