# Vendor-Sync Frontend

A modern React application for managing vendors, users, requirements, quotes, and orders with full CRUD operations and role-based access control. Developed by Maureen, Wayne, and Jackson as a capstone project.

## Live Demo

 **[View Live Application](https://chic-kashata-589433.netlify.app/)**

## Features

- JWT Authentication with login/register flow
- Role-Based Access Control (Admin, Manager, Vendor, Staff roles)
- Protected routes and context-based auth state management
- Complete CRUD operations for all entities (Users, Vendors, Orders, Quotes, Requirements)
- Cloudinary image upload and document management
- Form validation with React Hook Form
- Pagination for all list views
- Algolia-powered search across vendors, orders, and quotes
- Date formatting with Day.js throughout the application
- Responsive design with Tailwind CSS aligned with Figma designs

## Tech Stack

- React 18 + Vite
- React Router v6 for routing
- React Hook Form for form handling and validation
- Context API for auth state management
- Axios for API calls
- Tailwind CSS for styling
- Day.js for date formatting
- Cloudinary for image handling
- Algolia for search functionality

## Project Structure

```
Vendor-Sync-Frontend/
├─ public/
│  └─ index.html
├─ src/
│  ├─ api/
│  │  ├─ axios.js
│  │  └─ axiosInstance.js
│  ├─ components/
│  │  ├─ ui/
│  │  │  └─ Button.js
│  │  ├─ CloudinaryUpload.js
│  │  ├─ Dashboard.js
│  │  ├─ LoginForm.js
│  │  ├─ OrderForm.js
│  │  ├─ OrderList.js
│  │  ├─ ProtectedRoute.js
│  │  ├─ QuoteForm.js
│  │  ├─ RegisterForm.js
│  │  ├─ RequirementForm.js
│  │  ├─ RequirementList.js
│  │  ├─ SearchBar.js
│  │  ├─ UserForm.js
│  │  ├─ UserList.js
│  │  ├─ VendorCategoryForm.js
│  │  ├─ VendorCategoryList.js
│  │  ├─ VendorForm.js
│  │  └─ VendorList.js
│  ├─ context/
│  │  └─ AuthContext.js
│  ├─ hooks/
│  │  └─ useAuth.js
│  ├─ pages/
│  │  ├─ Dashboard.js
│  │  ├─ HomePage.js
│  │  ├─ Login.js
│  │  ├─ NewOrder.js
│  │  ├─ Orders.js
│  │  ├─ Quotes.js
│  │  ├─ Register.js
│  │  ├─ Requirements.js
│  │  ├─ Search.js
│  │  ├─ Users.js
│  │  ├─ VendorCategories.js
│  │  └─ Vendors.js
│  ├─ utils/
│  │  ├─ dateFormatter.js
│  │  └─ validators.js
│  ├─ App.js
│  ├─ index.css
│  └─ index.js
├─ .env.example
├─ netlify.toml
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ README.md
```

## Team Contributions

### Jackson
- Authentication System: JWT implementation, login/logout functionality
- User Management: User CRUD operations, role-based access
- Dashboard: Role-based dashboard components and data fetching
- Routing: React Router v6 setup and protected routes
- Auth Context: Global authentication state management

### Wayne
- Order Management: Full CRUD operations for purchase orders
- Order Assignments: Staff assignment functionality
- Status Updates: Order status workflow management
- Pagination: List pagination implementation
- Form Validation: Order forms with React Hook Form

### Maureen
- Vendor Management: Vendor registration and management
- Quote System: Quote submission and acceptance workflow
- Search Functionality: Algolia integration for real-time search
- Document Upload: Cloudinary integration for file management
- Email Notifications: SendGrid integration for quote and order notifications
- Date Formatting: Day.js implementation throughout application
- Swagger UI: API documentation setup

## Prerequisites

- Node.js (version specified in .nvmrc)
- npm or yarn

## Installation

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment variables
   ```bash
   cp .env.example .env
   ```
   Fill in the environment variables:
   ```
   VITE_API_BASE_URL=your_backend_api_url
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   VITE_ALGOLIA_APP_ID=your_algolia_app_id
   VITE_ALGOLIA_SEARCH_KEY=your_algolia_search_key
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Routing

The application uses React Router v6 with the following routes:

### Public Routes
- `/` - Homepage
- `/login` - Login page
- `/register` - Registration page
- `/search` - Search page

### Protected Routes
- `/dashboard` - User dashboard (role-based content)
- `/users` - User management (Admin only)
- `/vendors` - Vendor management
- `/vendor-categories` - Vendor category management
- `/requirements` - Requirements management
- `/quotes` - Quotes management
- `/orders` - Orders management
- `/new-order` - Create new orders (Manager only)

## Authentication & Authorization

- JWT-based authentication with secure token storage
- Role-Based Access Control (RBAC) with four roles: Admin, Manager, Vendor, Staff
- Protected routes using ProtectedRoute component
- Auth state management via React Context
- Automatic token refresh and session management

## Form Handling

All forms use React Hook Form for:
- Form state management
- Validation with custom rules using Yup schemas
- Error handling and user-friendly error display
- Form submission handling with loading states
- Field-level validation and dirty state tracking

## Date Formatting

The application uses Day.js for consistent date formatting:
- All dates displayed in human-readable format (MMM DD, YYYY)
- Relative time formatting (e.g., "2 days ago")
- Timezone handling and localization
- Date validation in forms

## API Integration

Axios is configured with:
- Base URL from environment variables
- Request/response interceptors for automatic JWT token attachment
- Error handling and user-friendly error messages
- Response parsing and data transformation
- Loading state management

## Search Functionality

- Algolia-powered real-time search across vendors, orders, and quotes
- Typo-tolerant search with fuzzy matching
- Faceted search and filtering capabilities
- Instant results with debounced input
- Search analytics and performance monitoring

## Image & Document Management

- Cloudinary integration for secure file uploads
- Image optimization and responsive images
- Document type validation (PDF, images, documents)
- Progress indicators for uploads
- File preview and management

## Styling

- Tailwind CSS for utility-first styling
- Responsive design patterns for mobile and desktop
- Custom component library with consistent design system
- Figma design alignment with professional UI/UX
- Dark mode support (if implemented)

## Deployment

Deployed on Netlify with configuration in netlify.toml:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset
- `VITE_ALGOLIA_APP_ID` - Algolia application ID
- `VITE_ALGOLIA_SEARCH_KEY` - Algolia search-only API key

## Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run test coverage
npm run test:coverage
```

## Contributing

1. Create a feature branch from develop
2. Make changes with descriptive commit messages following Conventional Commits
3. Write tests for new functionality
4. Submit a pull request for review
5. Ensure all checks pass before merging

## Capstone Requirements Compliance

 React with React Router v6 - Implemented with protected routes
 React Hook Form - Used for all forms with validation
 Tailwind CSS - Exclusive styling framework
 Context API - Auth state management
 JWT Authentication - Secure token-based auth
 Role-Based Access Control - Four distinct user roles
 CRUD Operations - Complete for all main entities
 Pagination - Implemented on all list views
 Error Handling - User-friendly error messages
 Date Formatting - Day.js throughout application
 Cloudinary Integration - Image and document uploads
 Netlify Deployment - Production deployment

## License

This project is licensed under the MIT License.
