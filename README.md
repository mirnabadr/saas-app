# 🎓 AI Teaching Platform - SaaS Application

> **A modern, full-stack SaaS platform that revolutionizes education through AI-powered voice companions, enabling personalized learning experiences across multiple subjects.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-7B5CFA?style=for-the-badge)](https://saas-appliccation.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-View_Source-181717?style=for-the-badge&logo=github)](https://github.com/mirnabadr/saas-app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Author & Contact](#-author--contact)
- [Call to Action](#-call-to-action)

---

## 🎯 Overview

This SaaS application is a cutting-edge **AI-powered educational platform** that connects students with intelligent voice companions for personalized learning experiences. Built with modern web technologies, the platform offers real-time voice interactions, session management, subscription-based access, and a comprehensive dashboard for tracking learning progress.

**What it solves:**
- Provides accessible, personalized education through AI voice companions
- Enables students to learn at their own pace across multiple subjects
- Offers a scalable subscription model for educational content
- Demonstrates full-stack development capabilities with modern tooling

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Clerk Integration**: Secure user authentication with social login options
- **Protected Routes**: Middleware-based route protection
- **User Management**: Seamless user session handling

### 🤖 AI Voice Companions
- **Multi-Subject Support**: Math, Science, Coding, Economics, Language, and more
- **Real-Time Voice Interaction**: Powered by VAPI AI for natural conversations
- **Personalized Learning**: Customizable companion personalities and teaching styles
- **Session Recording**: Track and review past learning sessions

### 📊 Dashboard & Analytics
- **Companion Library**: Browse and search through available AI companions
- **Recent Sessions**: Quick access to your learning history
- **Subject Filtering**: Filter companions by subject and topic
- **Search Functionality**: Find specific companions quickly

### 💳 Subscription Management
- **Tiered Plans**: Different subscription levels with feature limits
- **Usage Tracking**: Monitor companion creation and session limits
- **Upgrade Prompts**: Seamless upgrade flow for premium features

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Built with Radix UI and shadcn/ui
- **Smooth Animations**: Enhanced user experience with animations
- **Accessible**: WCAG-compliant components

### 🛠️ Developer Experience
- **TypeScript**: Full type safety across the application
- **Error Tracking**: Sentry integration for production monitoring
- **Form Validation**: React Hook Form with Zod schemas
- **API Routes**: Serverless API endpoints for backend operations

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - High-quality component library
- **React Hook Form** - Performant form management
- **Zod** - Schema validation

### Backend & Services
- **Supabase** - PostgreSQL database and backend services
- **Clerk** - Authentication and user management
- **VAPI AI** - Voice AI integration for companions
- **Vercel** - Hosting and serverless functions

### DevOps & Monitoring
- **Vercel** - Deployment platform
- **Sentry** - Error tracking and performance monitoring
- **GitHub** - Version control and CI/CD

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Webpack** - Module bundling

---

## 🚀 Live Demo

**Experience the application live:**

👉 **[https://saas-appliccation.vercel.app](https://saas-appliccation.vercel.app)**

The application is fully deployed and ready to use. Sign up to create your account and start learning with AI companions!

---

## 📸 Screenshots

> _Screenshots section - Add your application screenshots here to showcase the UI/UX_

- Dashboard view
- Companion library
- Voice session interface
- Subscription management
- User profile

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Git** for version control
- Accounts for:
  - [Clerk](https://clerk.com) (Authentication)
  - [Supabase](https://supabase.com) (Database)
  - [VAPI AI](https://vapi.ai) (Voice AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mirnabadr/saas-app.git
   cd saas-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # VAPI AI
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key for server-side auth | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `NEXT_PUBLIC_VAPI_WEB_TOKEN` | VAPI AI web token for voice features | ✅ |

> **Note**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

---

## 🌐 Deployment

This application is deployed on **Vercel**, the platform created by the Next.js team.

### Why Vercel?
- **Zero-config deployment** for Next.js applications
- **Automatic HTTPS** and global CDN
- **Serverless functions** for API routes
- **Preview deployments** for every pull request
- **Analytics and monitoring** built-in

### Deploy Your Own

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy! 🚀

**Learn more**: [Vercel Deployment Documentation](https://vercel.com/docs)

---

## 📁 Project Structure

```
saas-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── companions/        # Companion pages
│   │   ├── my-journey/        # User dashboard
│   │   ├── subscription/      # Subscription management
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── ...               # Feature components
│   ├── lib/                   # Utilities and configurations
│   │   ├── actions/          # Server actions
│   │   ├── supabase.ts       # Supabase client
│   │   └── vapi.sdk.ts       # VAPI integration
│   └── constants/             # App constants
├── public/                     # Static assets
├── middleware.ts              # Next.js middleware (Clerk)
└── package.json
```

---

## 👤 Author & Contact

**Mirna Badr**

Full-Stack Developer specializing in modern web technologies and SaaS applications.

- **GitHub**: [@mirnabadr](https://github.com/mirnabadr)
- **Project Repository**: [saas-app](https://github.com/mirnabadr/saas-app)
- **Live Application**: [saas-appliccation.vercel.app](https://saas-appliccation.vercel.app)

**Open to opportunities:**
- Full-time positions in full-stack development
- Contract/freelance projects
- Technical consulting
- Open source contributions

---

## 💼 Call to Action

### 👋 For Tech Recruiters & Hiring Managers

This project demonstrates **production-ready full-stack development skills** including:

- ✅ Modern React/Next.js architecture
- ✅ TypeScript for type safety
- ✅ Authentication & authorization
- ✅ Database design & management
- ✅ API development
- ✅ Third-party integrations
- ✅ Payment/subscription systems
- ✅ Error handling & monitoring
- ✅ Responsive UI/UX design
- ✅ DevOps & deployment

**I'm actively seeking opportunities** in:
- Full-stack development roles
- React/Next.js positions
- SaaS product development
- Startup engineering teams

### 🤝 For Startup Founders

Looking to build a similar platform or need a developer who can ship fast? Let's connect!

### 📧 Get in Touch

Ready to discuss how I can contribute to your team? Reach out through:
- GitHub Issues/PRs on this repository
- Direct message via GitHub

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">

**Built with ❤️ using Next.js, React, and modern web technologies**

[⬆ Back to Top](#-ai-teaching-platform---saas-application)

</div>
