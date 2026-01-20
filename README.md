# CanvasFlow

A powerful, collaborative project management application inspired by Trello, built with modern web technologies and a focus on productivity.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and Server Actions
- **Authentication**: [Clerk](https://clerk.com/) for user and organization management
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

## Features

- 🔐 **Authentication** - Secure login and sign-up with Clerk
- 🏢 **Multi-Tenancy** - Create and manage multiple organizations/workspaces
- 📋 **Board Management** - Create, rename, and delete boards with custom backgrounds
- 🖼️ **Unsplash Integration** - Select beautiful high-quality images for board backgrounds (or use default mock images)
- 📝 **Task Management** - Create lists and cards with rich descriptions
- 🔄 **Drag & Drop** - Smoothly reorder lists and cards across columns
- 📝 **Activity Log** - Track all changes (creation, updates, deletion, moves) with a detailed audit log
- 🎨 **Modern UI** - "Productivity & Calm" theme with glassmorphism and optimistic updates
- ⚡ **Server Actions** - Type-safe, efficient server-side mutations using `zod` validation

## Upcoming Features

- 💳 **Subscriptions** - Stripe integration for Pro plans (Unlimited boards)
- 📊 **Rate Limiting** - Usage limits for free tier users
- 🌐 **Landing Page** - Comprehensive marketing landing page
- 🚀 **Deployment** - Production deployment optimization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (e.g., NeonDB)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd canvasflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:

   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/select-org
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-org

   # Database
   DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

   # Unsplash (Optional - for real images)
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev --turbopack
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
canvasflow/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (marketing)/        # Public marketing pages & 404
│   └── (platform)/         # Protected application routes
│       ├── (clerk)/        # Clerk organization selection
│       └── (dashboard)/    # Dashboard, boards, and organization layout
├── actions/                # Server actions (Safe Action pattern)
├── components/             # Reusable UI components (form, modals, etc.)
├── constants/              # Static data (mock images)
├── hooks/                  # Custom React hooks (use-action, use-card-modal)
├── lib/                    # Utilities (db, unsplash, audit-log)
└── prisma/                 # Database schema
```

## License

MIT
