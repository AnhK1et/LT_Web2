# AKStore Frontend

Frontend application for AKStore e-commerce platform built with React 19, Vite, and Tailwind CSS.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **SweetAlert2** - Alerts
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── api/           # API endpoints
├── assets/        # Static assets
├── components/    # React components
│   ├── common/    # Shared components
│   ├── layout/    # Layout components
│   └── ui/        # UI components
├── hooks/         # Custom hooks
├── pages/         # Page components
├── routes/        # Route configuration
├── services/      # Business services
├── store/         # Zustand stores
├── types/         # TypeScript types
├── utils/         # Utility functions
├── constants/     # Constants
└── styles/        # Global styles
```

## Features

### User Features
- Product browsing
- Shopping cart
- Checkout
- Order history
- User profile

### Admin Features
- Dashboard with analytics
- Product management
- Category management
- Brand management
- Order management
- User management

## Environment Variables

Create `.env` files:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## API Connection

The frontend connects to the Spring Boot backend at `http://localhost:8080/api`. 
Make sure the backend server is running before starting the frontend.

## License

MIT
