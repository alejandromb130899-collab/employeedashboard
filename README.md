# HR Management System

A comprehensive HR management system built with Next.js 15, featuring App Router, NextAuth.js authentication, and a complete request management system for vacations, funds, and general requests.

## Features

### 🔐 Authentication & Authorization
- **NextAuth.js** integration with credentials provider
- **Role-based access control** (Admin, HR, Manager, Employee)
- **Secure password hashing** with bcryptjs
- **Session management** with JWT tokens

### 👥 User Management
- **Multi-role support**: Admin, HR, Manager, Employee
- **Employee profiles** with detailed information
- **Department and position management**
- **User creation and management** (Admin/HR only)

### 📋 Request Management
- **Vacation Requests**: Date range selection, automatic day calculation
- **Fund Requests**: Multiple fund types (Travel, Training, Equipment, Medical, Emergency, Other)
- **General Requests**: Flexible request system with priority levels
- **Request approval workflow** for managers and HR
- **Status tracking** (Pending, Approved, Rejected, In Progress, Completed)

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Professional dashboard** layouts for different user roles
- **Interactive components** with Lucide React icons
- **Real-time status updates** and notifications
- **Clean, modern interface** following design best practices

### 🛠 Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma ORM** with SQLite database
- **Server-side API routes** for backend functionality
- **Database seeding** with sample data
- **Production-ready build** configuration

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs
- **Build Tool**: Next.js built-in bundler

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

The system comes with pre-seeded demo accounts for testing:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@company.com | admin123 | Full system access |
| **HR** | hr@company.com | hr123 | HR management access |
| **Manager** | manager@company.com | manager123 | Team management access |
| **Employee** | john.doe@company.com | employee123 | Standard employee access |
| **Employee** | jane.smith@company.com | employee123 | Standard employee access |

## Project Structure

```
hr-management-system/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding script
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── employees/   # Employee management
│   │   │   └── requests/    # Request management
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   ├── providers/      # Context providers
│   │   ├── admin-dashboard.tsx
│   │   ├── employee-dashboard.tsx
│   │   └── navigation.tsx
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── prisma.ts       # Prisma client
│   │   └── api-utils.ts    # API utilities
│   └── types/              # TypeScript types
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Employees
- `GET /api/employees` - List all employees (Admin/HR/Manager)
- `POST /api/employees` - Create new employee (Admin/HR)
- `GET /api/employees/[id]` - Get employee details
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee (Admin only)

### Requests
- `GET /api/requests/vacation` - Get vacation requests
- `POST /api/requests/vacation` - Submit vacation request
- `PUT /api/requests/vacation/[id]` - Approve/reject vacation request
- `GET /api/requests/fund` - Get fund requests
- `POST /api/requests/fund` - Submit fund request
- `GET /api/requests/general` - Get general requests
- `POST /api/requests/general` - Submit general request

## Database Schema

The system uses Prisma with SQLite and includes the following main models:

- **User**: Authentication and basic user info
- **Employee**: Detailed employee information
- **VacationRequest**: Vacation time requests
- **FundRequest**: Financial requests
- **GeneralRequest**: General purpose requests

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run `npm run db:push`
2. **API Routes**: Add new routes in `src/app/api/`
3. **Components**: Create new components in `src/components/`
4. **Types**: Update TypeScript types in `src/types/`

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables for Production

Ensure you set the following environment variables:

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-secret-key
DATABASE_URL="your-production-database-url"
```

## Security Features

- **Password hashing** with bcryptjs
- **JWT-based sessions** with NextAuth.js
- **Role-based access control** throughout the application
- **API route protection** with authentication middleware
- **Input validation** on all forms and API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
