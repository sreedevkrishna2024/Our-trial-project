# 🚀 Deployment Guide - AI Writing Studio

This guide will help you deploy the AI Writing Studio to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Google Gemini API Key** - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **PostgreSQL Database** - Use any of these options:
   - [Supabase](https://supabase.com) (Recommended - Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)
   - [PlanetScale](https://planetscale.com) (Free tier available)
3. **GitHub Account** - For repository hosting

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub first
   git remote add origin https://github.com/yourusername/ai-writing-studio.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Set environment variables:
     ```
     DATABASE_URL=your_postgresql_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     NEXTAUTH_URL=https://your-app.vercel.app
     NEXTAUTH_SECRET=your_random_secret_key
     ```
   - Click "Deploy"

3. **Set up Database:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Run database migrations
   vercel env pull .env.local
   npx prisma db push
   npx prisma generate
   ```

### Option 2: Netlify

1. **Build Configuration:**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy:**
   - Connect your GitHub repository to Netlify
   - Set environment variables in Netlify dashboard
   - Deploy

### Option 3: Railway

1. **Deploy:**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository
   - Add PostgreSQL service
   - Set environment variables
   - Deploy

### Option 4: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository
   - Add PostgreSQL database
   - Set environment variables
   - Deploy

## 🔧 Environment Variables

Set these environment variables in your deployment platform:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# AI Service
GEMINI_API_KEY="your_gemini_api_key"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your_random_secret_key"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your_google_analytics_id"
```

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings > Database

2. **Run Migrations:**
   ```bash
   # Update .env.local with Supabase URL
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   
   # Push schema
   npx prisma db push
   npx prisma generate
   ```

### Using Neon

1. **Create Database:**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Get connection string

2. **Deploy Schema:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

## 🔐 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Enable database SSL
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Google Analytics
```bash
npm install gtag
```

## 🚀 Performance Optimization

1. **Enable Compression:**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
   }
   ```

2. **Image Optimization:**
   ```javascript
   // Use Next.js Image component
   import Image from 'next/image'
   ```

3. **Caching:**
   ```javascript
   // Add caching headers
   export async function getServerSideProps() {
     return {
       props: {},
       headers: {
         'Cache-Control': 'public, max-age=31536000',
       },
     }
   }
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx prisma generate
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify SSL settings

2. **AI API Errors:**
   - Verify GEMINI_API_KEY
   - Check API quotas
   - Monitor rate limits

3. **Build Failures:**
   - Check Node.js version (18+)
   - Clear .next cache
   - Verify all dependencies

4. **Authentication Issues:**
   - Check NEXTAUTH_URL matches domain
   - Verify NEXTAUTH_SECRET is set
   - Check callback URLs

## 📞 Support

If you encounter issues:

1. Check the [Issues](https://github.com/yourusername/ai-writing-studio/issues) page
2. Review deployment logs
3. Test locally first
4. Contact support team

## 🎉 Success!

Once deployed, your AI Writing Studio will be available at your chosen domain. Users can:

- Create accounts and complete onboarding
- Generate AI-powered content
- Save and manage their writing
- Export their work
- Access all writing tools

**Happy Writing! 🚀**


