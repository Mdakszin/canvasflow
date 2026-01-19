# CanvasFlow

A collaborative project management application inspired by Trello, built with modern web technologies.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Authentication**: [Clerk](https://clerk.com/) for user and organization management
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Real-time**: [Liveblocks](https://liveblocks.io/) (planned)

## Features

- 🔐 **Authentication** - Secure login with Clerk
- 🏢 **Organizations** - Multi-tenant support with team workspaces
- 📋 **Boards** - Create and manage project boards
- 📝 **Lists** - Organize tasks into lists
- 🎴 **Cards** - Create cards with descriptions
- 🔄 **Drag & Drop** - Reorder lists and cards (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

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
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   DATABASE_URL=your_postgresql_connection_string
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
│   ├── (auth)/             # Authentication routes
│   ├── (marketing)/        # Public marketing pages
│   └── (platform)/         # Protected application routes
│       ├── (clerk)/        # Clerk organization selection
│       └── (dashboard)/    # Dashboard and boards
├── actions/                # Server actions
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and database client
└── prisma/                 # Database schema
```

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
