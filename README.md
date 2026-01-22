# CanvasFlow

A powerful, collaborative project management application inspired by Trello, built with modern web technologies and a focus on productivity.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router, Server Actions, and Turbopack
- **Authentication**: [Clerk](https://clerk.com/) for user and organization management
- **Real-Time**: [Liveblocks](https://liveblocks.io/) for collaboration, presence, and status synchronization
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

## Features

- 🔐 **Authentication** - Secure login and sign-up with Clerk
- 🏢 **Multi-Tenancy** - Create and manage multiple organizations/workspaces
- 👥 **Real-Time Collaboration** - See live cursors and active collaborators on every board powered by Liveblocks
- 🔄 **Real-Time Sync** - Drag-and-drop actions are synchronized instantly across all users in the room
- 🤝 **Presence Awareness** - Visual indicators show when other users are dragging lists or cards
- 📋 **Board Management** - Create, rename, and delete boards with custom backgrounds
- 🖼️ **Unsplash Integration** - Select beautiful high-quality images for board backgrounds
- 🔄 **Stability** - Robust drag-and-drop logic with hydration fixes and reordering persistence
- 🎨 **Modern UI** - Dark-themed navbars, background overlays, and glassmorphism for maximum readability


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

   # Liveblocks (Real-time)
   LIVEBLOCKS_SECRET_KEY=sk_prod_...

   # Database
   DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

   # Unsplash (Optional)
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
canvasflow/
├── app/                    # Next.js App Router
│   ├── (platform)/         # Protected application routes
│   │   └── (dashboard)/    # Board pages & Cursor tracking
│   ├── api/                # API routes (Liveblocks Auth)
│   └── layout.tsx          # Root layout with Providers
├── actions/                # Server actions (Safe Action pattern)
├── components/             # UI & Real-time components
│   ├── liveblocks/         # Cursors, Collaborators, etc.
│   └── providers/          # Liveblocks & Room providers
├── hooks/                  # use-action, use-card-modal, etc.
├── lib/                    # Liveblocks client, DB, etc.
├── prisma/                 # Database schema
├── proxy.ts                # Next.js 16 Network Boundary
└── liveblocks.config.ts    # Liveblocks type definitions
```


## License

MIT
