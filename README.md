# 🧾 SARS Tax Refund Calculator

A clean, focused South African tax calculator built with modern web technologies.

## ✨ Features

- 🎯 **Focused MVP**: Calculate tax refunds accurately
- 🎨 **Beautiful Design**: Cursor-inspired dark theme
- ⚡ **Lightning Fast**: <2s load time
- 📱 **Responsive**: Works on all devices
- 🔐 **Secure Auth**: Supabase authentication
- 💾 **Save Calculations**: Store and review past calculations
- 📄 **PDF Export**: Download tax calculation reports

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Auth & Database**: Supabase
- **State Management**: TanStack Query
- **Routing**: Wouter

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- ✅ Vercel (Recommended)
- Railway
- Render
- Other platforms

## 📊 Project Analysis

**Comparison with Taxfy-main**:
- **Current**: 30 components, ~2MB bundle, fast & focused
- **Taxfy-main**: 200+ components, ~10MB bundle, enterprise bloat

See [TAXFY-MAIN-ANALYSIS.md](./TAXFY-MAIN-ANALYSIS.md) for detailed analysis.

## 🎯 Philosophy

Following Steve Jobs' principle: **"Say no to 1,000 things"**

- ✅ Simple, focused MVP
- ✅ Fast iteration
- ✅ User feedback driven
- ❌ No enterprise bloat
- ❌ No premature features

## 📁 Project Structure

```
.
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Auth)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities & helpers
│   │   └── pages/       # Route pages
│   └── public/          # Static assets
├── server/              # Backend Express API
│   ├── routes.ts        # API endpoints
│   └── storage.ts       # Database abstraction
├── shared/              # Shared types & schemas
└── api/                 # Vercel serverless functions
```

## 🔐 Environment Variables

Required for production:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
NODE_ENV=production
```

## 📝 Database Schema

Uses Supabase PostgreSQL with the following tables:
- `tax_calculations`: Store user tax calculations
- `auth.users`: Supabase authentication (built-in)

## 🧪 Quality Assurance

- ✅ TypeScript for type safety
- ✅ Zod for runtime validation
- ✅ ESLint for code quality
- ✅ Production build tested

## 📈 Success Metrics

### Current Status
- [x] MVP built
- [x] Design system complete
- [x] Authentication working
- [x] Database configured
- [x] Production ready
- [ ] Deployed to production
- [ ] User feedback collected

### Next 30 Days Goals
- 100+ calculator completions
- 20%+ completion rate
- 5+ user interviews
- Feature prioritization based on feedback

## 🚫 What We're NOT Building (Yet)

Following lessons from Taxfy-main:
- ❌ Enterprise features before validation
- ❌ Payment integration before willingness to pay
- ❌ Admin dashboards before having users
- ❌ WordPress CMS before content strategy
- ❌ AI features before knowing the real problem

## 🎯 Roadmap

**Phase 1: Validation** (Current)
- [x] Build clean MVP
- [x] Deploy to production
- [ ] Get 10 users to test
- [ ] Collect feedback

**Phase 2: Iteration** (After validation)
- Add features users request
- Improve UX based on data
- Optimize conversion funnel

**Phase 3: Scale** (After product-market fit)
- Only then consider:
  - Advanced features
  - Payment integration
  - Business tiers

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide for Vercel & other platforms
- [TAXFY-MAIN-ANALYSIS.md](./TAXFY-MAIN-ANALYSIS.md) - Why we kept it simple

## 🤝 Contributing

This is a focused MVP. Features are added based on user feedback, not assumptions.

If you have feedback:
1. Use the calculator
2. Note what was confusing or missing
3. Share specific use cases

## 📄 License

Private project

## 🙏 Acknowledgments

**Design inspired by**: Cursor.sh
**Philosophy**: Steve Jobs' "Say no to 1,000 things"
**Lesson learned from**: Taxfy-main (what not to do)

---

**Ship fast. Learn faster. Iterate based on data.** 🚀
