# Care Bridge Kenya 🇰🇪

**Building Bridges of Hope**

A modern, feature-rich crowdfunding platform designed specifically for Kenyan individuals and communities seeking financial assistance for school fees, medical bills, and other urgent needs.

![Care Bridge Kenya](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8)

---

## 🌟 Features

### Phase 1 (Current - MVP)
- ✅ **Modern, Responsive Design** - Mobile-first approach with stunning UI
- ✅ **Campaign Discovery** - Browse and search campaigns by category
- ✅ **Featured Campaigns** - Highlighted campaigns on homepage
- ✅ **Category System** - School Fees, Medical, Emergency, Community, Other
- ✅ **Progress Tracking** - Visual progress bars and real-time stats
- ✅ **Dark Mode Support** - Beautiful light and dark themes
- 🚧 **User Authentication** - Email, phone, and Google Sign-in (Coming soon)
- 🚧 **Campaign Creation** - Multi-step form with rich text editor (Coming soon)
- 🚧 **M-Pesa Integration** - Primary payment method for Kenya (Coming soon)
- 🚧 **Donation System** - One-time donations with multiple payment options (Coming soon)

### Phase 2 (Planned)
- Document verification system
- Multiple payment methods (Stripe, PayPal)
- Social sharing integration
- Email & SMS notifications
- Campaign updates and comments
- Advanced search and filters

### Phase 3 (Future)
- Multi-language support (English/Swahili)
- Mobile app (React Native)
- WhatsApp integration
- Advanced analytics
- Premium features

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and auth)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "c:/Users/roynm/Desktop/Web dev/Projects/Care bridge Kenya"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials and other API keys
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
care-bridge-kenya/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with design system
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/
│   └── ui/                      # Reusable UI components
│       ├── button.tsx           # Button component
│       ├── card.tsx             # Card component
│       └── progress-bar.tsx     # Progress bar component
├── lib/
│   ├── constants.ts             # App constants and enums
│   └── utils.ts                 # Utility functions
├── .agent/
│   └── IMPLEMENTATION_PLAN.md   # Detailed implementation plan
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## 🎨 Design System

### Color Palette

#### Light Mode
- **Primary Green:** `#16A34A` - Hope, growth, Kenyan flag
- **Primary Red:** `#DC2626` - Urgency, passion, Kenyan flag
- **Primary Blue:** `#0891B2` - Trust, professionalism
- **Background:** `#FFFFFF` - Pure white
- **Text Primary:** `#0F172A` - Dark slate

#### Dark Mode
- **Primary Green:** `#22C55E` - Brighter for visibility
- **Primary Red:** `#EF4444` - Bright red
- **Primary Blue:** `#06B6D4` - Cyan
- **Background:** `#0F172A` - Dark navy
- **Text Primary:** `#F1F5F9` - Off-white

### Typography
- **Headings:** Inter (Bold)
- **Body:** Inter (Regular, Medium)
- **Numbers:** Roboto Mono

### Components
- **Buttons:** Multiple variants (primary, secondary, outline, ghost)
- **Cards:** Hover effects with smooth transitions
- **Progress Bars:** Gradient fills with percentage display

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4.1
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod

### Backend (Planned)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

### Payments (Planned)
- **M-Pesa:** Daraja API (Primary)
- **Cards:** Stripe/Flutterwave
- **International:** PayPal

---

## 📊 Database Schema (Planned)

### Core Tables
- **users** - User accounts and profiles
- **campaigns** - Fundraising campaigns
- **donations** - Donation transactions
- **campaign_updates** - Campaign progress updates
- **comments** - Campaign comments
- **withdrawals** - Fund withdrawal requests
- **reports** - Campaign reports/flags
- **favorites** - User saved campaigns

See `.agent/IMPLEMENTATION_PLAN.md` for detailed schema.

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# M-Pesa (Daraja API)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Email & SMS
RESEND_API_KEY=
AFRICAS_TALKING_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_FEE=0.05
```

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🎯 Key Features Implementation

### Campaign Categories
- School Fees
- Medical Bills
- Emergency
- Community Projects
- Other

### Kenyan Counties Support
All 47 Kenyan counties are supported for location-based browsing.

### Payment Methods
- **M-Pesa** (Primary - STK Push integration)
- **Credit/Debit Cards** (Stripe/Flutterwave)
- **PayPal** (International donors)

### Platform Fee
- 5% of donations (configurable)
- Transparent fee display
- Option for donors to cover fees

---

## 🚧 Current Status

### ✅ Completed
- [x] Project setup and configuration
- [x] Design system implementation
- [x] Homepage with hero section
- [x] Featured campaigns display
- [x] Category browsing
- [x] How it works section
- [x] Trust features section
- [x] Responsive navigation
- [x] Footer with links
- [x] Utility functions (currency, dates, phone numbers)
- [x] Constants and types
- [x] Reusable UI components

### 🚧 In Progress
- [ ] Supabase integration
- [ ] User authentication
- [ ] Campaign creation flow
- [ ] Campaign detail pages
- [ ] Donation system
- [ ] M-Pesa integration

### 📅 Next Steps
1. Set up Supabase project and database
2. Implement authentication system
3. Create campaign creation form
4. Build campaign detail page
5. Integrate M-Pesa payments
6. Add real-time donation updates

---

## 🤝 Contributing

This is a private project currently in development. Contributions will be welcome once we reach beta.

---

## 📄 License

Copyright © 2026 Care Bridge Kenya. All rights reserved.

---

## 📞 Contact

- **Email:** support@carebridgekenya.com
- **Phone:** +254 700 000 000
- **Address:** Nairobi, Kenya

---

## 🙏 Acknowledgments

- Inspired by GoFundMe and M-Changa
- Built for the Kenyan community
- Designed with love and hope 💚

---

**Built with ❤️ for Kenya 🇰🇪**
