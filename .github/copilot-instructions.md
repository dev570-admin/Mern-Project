# Copilot Instructions for MERN Project

## Architecture Overview
This is a full-stack MERN application with separated frontend and backend:
- **Backend**: Express.js server running on `localhost:5000` with MongoDB (ES modules)
- **Frontend**: React 19 + TypeScript + Vite, running on `localhost:5173`
- **Authentication**: JWT-based with cookies, verified via `verifyToken` middleware
- **Database**: MongoDB with Mongoose ODM, storing Users and Products

## Key Data Flows

### User Authentication Flow
1. **Signup** (`POST /api/auth/signup`): Validate input → hash password with bcryptjs → save user → issue JWT token
2. **Login** (`POST /api/auth/login`): Find user → verify password → store token in cookies → store email in localStorage
3. **Frontend Protection**: `ProtectedRoute` component checks `localStorage.getItem("email")` to gate /home, /addproducts, /edit-product routes
4. **Token Verification**: Protected API calls verified by `verifyToken` middleware extracting token from `req.cookies.token`

### Product Data Flow
- **Add Product**: Frontend form → Formik/Yup validation → axios POST to `/api/addproduct` → MongoDB save
- **Fetch Products**: Frontend → axios GET to `/api/getallproducts` or `/api/products` → Mongoose query
- **Edit Product**: Dynamic route `/edit-product/:id` → fetch product → update → save

## Development Setup

### Backend
- **Start**: `npm start` from `backend/` directory (runs `nodemon index.js`)
- **Key files**: 
  - [backend/index.js](backend/index.js) - Express setup, middleware, routes
  - [backend/Controllers/authcontroller.js](backend/Controllers/authcontroller.js) - Auth logic
  - [backend/Routes/](backend/Routes/) - API endpoints
  - [backend/Middleware/AuthValidation.js](backend/Middleware/AuthValidation.js) - Input validation using express-validator

### Frontend
- **Start**: `npm run dev` from `frontend/` directory (Vite dev server)
- **Build**: `npm run build` (TypeScript compile + Vite build)
- **Key files**:
  - [frontend/src/App.tsx](frontend/src/App.tsx) - Route definitions
  - [frontend/src/axios.js](frontend/src/axios.js) - Axios instance with baseURL
  - [frontend/src/components/ProtectedRoutes.tsx](frontend/src/components/ProtectedRoutes.tsx) - Auth guard
  - [frontend/src/pages/](frontend/src/pages/) - Page components

## Project-Specific Patterns

### Authentication State Management
- **Token Storage**: JWT stored in HTTP-only cookies (backend sets) AND email in localStorage (frontend, for quick auth checks)
- **Auth Guard**: Simple localStorage check in `ProtectedRoute`, not a full context API (no Redux/Zustand)
- **Logout**: Removes token cookie and localStorage email

### Validation Strategy
- **Backend**: Uses `express-validator` with middleware in [backend/Middleware/AuthValidation.js](backend/Middleware/AuthValidation.js)
- **Frontend**: Uses Formik + Yup for form validation (see AddProducts, SignUp, Login components)

### API Communication
- **Axios Instance**: Centralized in [frontend/src/axios.js](frontend/src/axios.js) with baseURL
- **CORS**: Backend configured for `http://localhost:5173` with credentials: true
- **Error Handling**: Responses use `{ message, success }` pattern with HTTP status codes

### Database Models
- [User.js](backend/Models/User.js) - Simple schema: name, email (unique, lowercase), password (hashed)
- [Product.js](backend/Models/Product.js) - Product catalog with counters
- [Counter.js](backend/Models/Counter.js) - Auto-increment helper for product IDs

## Critical Conventions

1. **ES Modules**: Backend uses `import/export` (type: "module" in package.json), NOT CommonJS
2. **Environment Variables**: Backend loads from `.env` via dotenv (MONGO_URI, JWT_SECRET, PORT)
3. **Bootstrap UI**: Frontend uses Bootstrap 5.3.6 + Bootstrap Icons for styling
4. **File Organization**: Controllers/Routes/Models/Middleware separation in backend; Pages/Components in frontend
5. **HTTP-Only Cookies**: Don't manually set token in localStorage; let backend set httpOnly cookies and frontend read email field only

## Common Debugging Steps

- **Auth Fails**: Check `MONGO_URI`, `JWT_SECRET` env vars, cookie parser middleware is registered
- **CORS Errors**: Verify backend cors origin matches frontend URL and credentials: true
- **Routes Not Found**: Confirm route prefix paths in [backend/index.js](backend/index.js) (e.g., `/api/auth`, `/api/products`)
- **Validation Errors**: Check [backend/Middleware/AuthValidation.js](backend/Middleware/AuthValidation.js) rules match frontend form structure
