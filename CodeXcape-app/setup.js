#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AI Writing Studio - Setup Script');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_writing_studio"

# AI Service
GEMINI_API_KEY="your_gemini_api_key_here"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# Optional: Analytics
NEXT_PUBLIC_GA_ID=""
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created! Please update with your actual values.\n');
} else {
  console.log('✅ .env.local already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed!\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

// Check if Prisma client is generated
const prismaClientPath = path.join(__dirname, 'node_modules', '.prisma', 'client');
if (!fs.existsSync(prismaClientPath)) {
  console.log('🔧 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated!\n');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message);
    console.log('💡 Make sure your DATABASE_URL is correct in .env.local\n');
  }
} else {
  console.log('✅ Prisma client already generated\n');
}

console.log('🎉 Setup Complete!');
console.log('==================\n');

console.log('📋 Next Steps:');
console.log('1. Update .env.local with your actual values:');
console.log('   - DATABASE_URL: Your PostgreSQL connection string');
console.log('   - GEMINI_API_KEY: Your Google Gemini API key');
console.log('   - NEXTAUTH_SECRET: A random secret key\n');

console.log('2. Set up your database:');
console.log('   npx prisma db push\n');

console.log('3. Start the development server:');
console.log('   npm run dev\n');

console.log('4. Open your browser:');
console.log('   http://localhost:3000\n');

console.log('📚 For deployment instructions, see DEPLOYMENT.md');
console.log('🐛 For troubleshooting, check the README.md\n');

console.log('Happy Writing! ✍️');


