const fs = require('fs');

// Create proper .env.local with working API key
const envContent = `# Gemini AI API Configuration
GEMINI_API_KEY=AIzaSyCeCGWdqbht2nPKHtWa3HFm4CK2qBiGQTw

# Database Configuration (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here-12345

# Optional: OpenAI API Key (for fallback)
OPENAI_API_KEY=sk-your-openai-key-here`;

fs.writeFileSync('.env.local', envContent);
console.log('✅ Fixed .env.local with working API key!');
