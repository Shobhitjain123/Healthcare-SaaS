# Healthcare SaaS Platform

A modern, full-featured healthcare management application built with React, TypeScript, and Firebase. This platform provides healthcare providers with tools to manage patients, track appointments, monitor vitals, analyze lab results, and receive real-time notifications.

## 🚀 Features

- **Authentication System**: Firebase-based authentication with email/password and Google OAuth
- **Patient Management**: Comprehensive patient records with demographics, insurance, and medical history
- **Dashboard**: Overview of clinic statistics, upcoming appointments, and active alerts
- **Analytics**: Data visualization with charts for patient trends, appointment metrics, and health indicators
- **Patient Details**: Detailed view of patient information including vitals, labs, medications, and encounters
- **Real-time Notifications**: Service worker-based push notifications for important events
- **Mock Data System**: Deterministic mock database with realistic healthcare data
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and shadcn/ui components

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Authentication Mechanism](#authentication-mechanism)
- [Pages and Routes](#pages-and-routes)
- [Mock Data System](#mock-data-system)
- [Service Workers & Notifications](#service-workers--notifications)
- [State Management](#state-management)
- [Thinking Approach & Architecture](#thinking-approach--architecture)
- [Running the Application](#running-the-application)

## 🛠 Tech Stack

### Core Framework
- **React 19.2.5** - UI library with latest features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 8.0.10** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS 4.2.4** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible UI components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **@fontsource-variable/geist** - Variable font for modern typography

### State Management
- **Zustand 5.0.12** - Lightweight state management

### Authentication
- **Firebase 12.12.1** - Authentication backend
- **Firebase Auth** - Email/password and Google OAuth providers

### Routing
- **React Router 7.14.2** - Client-side routing with lazy loading

### Data Visualization
- **Recharts 3.8.1** - Chart library for analytics

### Notifications
- **Service Worker API** - Background notification handling
- **Web Notifications API** - Browser push notifications

### Utilities
- **react-hot-toast 2.6.0** - Toast notifications
- **clsx & tailwind-merge** - Conditional class utilities
- **class-variance-authority** - Component variant management

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- A Firebase project with Authentication enabled

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shobhitjain123/Healthcare-SaaS.git
cd healthcare-saas
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Firebase
1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication in your Firebase project
3. Enable Email/Password sign-in method
4. Enable Google sign-in method
5. Add your app (Web) to get Firebase configuration
6. Copy the Firebase configuration values

### Step 4: Configure Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 5: Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
healthcare-saas/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── service-worker.js          # Service worker for notifications
├── src/
│   ├── app/                        # App directory (future use)
│   ├── assets/                     # Static assets
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── skeleton.tsx
│   │   ├── AddPatientModal.tsx     # Patient creation modal
│   │   ├── AuthProvider.tsx        # Firebase auth context
│   │   ├── Card.tsx                # Reusable card component
│   │   ├── FormFieldError.tsx      # Form error display
│   │   ├── GridView.tsx            # Grid view for patients
│   │   ├── ListView.tsx            # List view for patients
│   │   ├── LoadingSkeleton.tsx     # Loading states
│   │   ├── LoginForm.tsx           # Login form component
│   │   ├── PageHeader.tsx          # Page header component
│   │   ├── ProtectedRoute.tsx      # Route protection wrapper
│   │   ├── SignUpForm.tsx          # Registration form component
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── StatCard.tsx            # Statistics card
│   ├── hooks/                      # Custom React hooks
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── main.tsx                    # Application entry point
│   ├── mock/
│   │   ├── clinicDb.ts             # Mock database generator
│   │   ├── types.ts                # TypeScript type definitions
│   │   └── selectors/              # Data selectors
│   │       ├── analytics.ts        # Analytics data selectors
│   │       ├── dashboard.ts        # Dashboard data selectors
│   │       ├── date.ts             # Date utilities
│   │       └── patient.ts          # Patient data selectors
│   ├── modules/                    # Feature modules
│   │   ├── analytics/              # Analytics page
│   │   ├── auth/                   # Authentication pages
│   │   ├── dashboard/              # Dashboard page
│   │   ├── home/                   # Home layout
│   │   ├── patient-details/        # Patient details page
│   │   └── patients/               # Patients list page
│   ├── services/
│   │   └── firebaseAuth.ts         # Firebase authentication service
│   ├── store/
│   │   ├── useAuthStore.tsx        # Authentication state
│   │   └── usePatientStore.tsx     # Patient data state
│   ├── types/                      # Type definitions
│   ├── utils/
│   │   ├── authValidation.ts       # Form validation
│   │   ├── errorConstants.ts       # Error messages
│   │   └── notification.ts          # Notification utilities
│   ├── App.tsx                     # Main app component with routing
│   ├── App.css                     # Global styles
│   └── index.css                   # Tailwind imports
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── components.json                 # shadcn/ui configuration
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # App TypeScript config
├── tsconfig.node.json              # Node TypeScript config
└── vite.config.ts                  # Vite configuration
```

## 🔐 Authentication Mechanism

### Firebase Authentication Integration

The application uses Firebase Authentication for secure user management with the following methods:

#### 1. Email/Password Authentication
- **Sign Up**: `signUpWithEmail()` - Creates new user accounts with email and password
- **Login**: `loginWithEmail()` - Authenticates existing users
- **Persistence**: Uses `browserLocalPersistence` to keep users logged in across browser sessions

#### 2. Google OAuth
- **Google Sign-In**: `signInWithGoogle()` - Allows users to authenticate with their Google account
- **Provider**: Uses `GoogleAuthProvider` for OAuth flow

#### 3. Authentication State Management
- **Listener**: `initializeAuthListener()` - Sets up Firebase auth state observer
- **State Store**: Zustand store (`useAuthStore`) manages authentication state globally
- **Loading State**: `isAuthChecking` prevents route access during auth verification

#### 4. Error Handling
- Custom error mapping function translates Firebase error codes to user-friendly messages
- Error types handled:
  - User not found
  - Incorrect password
  - Invalid credentials
  - Email already registered
  - Too many requests
  - Unauthorized domain (for Google auth)

#### 5. Form Validation
- Email validation with regex pattern
- Password validation (minimum 8 characters, uppercase, lowercase, number, special character)
- Real-time validation feedback on form fields

#### 6. Route Protection
- `ProtectedRoute` component wraps authenticated routes
- Redirects unauthenticated users to login page
- Shows loading skeleton during auth check

### Authentication Flow

1. User navigates to application
2. `AuthProvider` initializes Firebase auth listener
3. Auth state is stored in Zustand store
4. If user is authenticated, they can access protected routes
5. If not authenticated, redirected to login/register pages
6. On logout, user is redirected to login page

## 📄 Pages and Routes

### Route Structure

The application uses React Router with lazy loading for optimal performance:

```
/ (Protected)
├── /                    → Dashboard (default)
├── /patients            → Patients list
├── /patients/:patientId → Patient details
└── /analytics           → Analytics dashboard

/login (Public)
/register (Public)
```

### Page Descriptions

#### 1. Dashboard (`/`)
- **Purpose**: Overview of clinic operations and key metrics
- **Features**:
  - Statistics cards (total patients, appointments, alerts)
  - Upcoming appointments list
  - Active alerts display
  - Quick access to patient management
- **Data Source**: Dashboard selectors from mock database

#### 2. Patients (`/patients`)
- **Purpose**: Patient directory and management
- **Features**:
  - Grid view and list view toggle
  - Search functionality
  - Add new patient modal
  - Patient cards with key information
  - Risk level indicators
- **Data Source**: Patient store with mock database

#### 3. Patient Details (`/patients/:patientId`)
- **Purpose**: Comprehensive patient information view
- **Features**:
  - Patient demographics and contact info
  - Insurance details
  - Vitals history with charts
  - Lab results with flag indicators
  - Current medications
  - Appointment history
  - Encounter records
  - Active tasks
  - Alerts specific to patient
- **Data Source**: Patient selectors from mock database

#### 4. Analytics (`/analytics`)
- **Purpose**: Data visualization and trend analysis
- **Features**:
  - Patient demographics charts
  - Appointment trends over time
  - Risk level distribution
  - Lab result analysis
  - Provider performance metrics
- **Data Source**: Analytics selectors with Recharts

#### 5. Login (`/login`)
- **Purpose**: User authentication
- **Features**:
  - Email/password login form
  - Google OAuth sign-in button
  - Form validation
  - Error display
  - Link to registration page

#### 6. Register (`/register`)
- **Purpose**: New user registration
- **Features**:
  - Email/password registration form
  - Form validation
  - Error display
  - Link to login page

## 🗄 Mock Data System

### Overview

The application uses a sophisticated mock database system (`clinicDb`) that generates realistic healthcare data for development and testing purposes.

### Data Generation Strategy

#### Deterministic Randomness
- Uses `mulberry32` seeded random number generator (seed: 42)
- Ensures consistent data across application restarts
- Charts and analytics remain stable between runs

#### Mock Clock
- Fixed timestamp: `2026-04-29T10:00:00.000Z`
- Prevents data drift in time-based visualizations

### Data Models

#### 1. Clinic
- Clinic information with multiple locations
- Provider assignments to locations

#### 2. Providers (6 providers)
- Names: Dr. Asha Mehta, Dr. Rohan Kapoor, Dr. Sara Iqbal, Dr. Vikram Nair, Dr. Neel Banerjee, Dr. Isha Sen
- Specialties: Family Medicine, Internal Medicine, Cardiology
- Location assignments

#### 3. Patients (25 patients)
- Demographics: Indian names, realistic addresses
- Age range: 19-81 years (born 1940-2006)
- Insurance: BlueCross, Aetna, United, Cigna
- Risk levels: low, medium, high
- Status: active, inactive

#### 4. Appointments (~300 appointments)
- Time range: Last 90 days from mock clock
- Types: Annual, Follow-up, Urgent, Lab Review, New Patient
- Status distribution: scheduled, completed, cancelled, no_show
- Weekend appointment reduction

#### 5. Encounters (~100 encounters)
- Generated from completed appointments (35% conversion rate)
- Duration: 30-90 minutes
- Diagnoses: Hypertension, Type 2 Diabetes, Hyperlipidemia, Asthma, Anxiety, Obesity, Hypothyroidism, GERD
- Notes summaries

#### 6. Vitals (~200 vital records)
- Recorded during encounters
- Backfilled for patients without encounters
- Metrics: heart rate, blood pressure, SpO2, weight, temperature
- Risk-based adjustments (e.g., higher BP for hypertension patients)

#### 7. Labs (~150 lab results)
- Tests: HbA1c, LDL, TSH, Creatinine, Potassium, Hemoglobin
- Flag levels: normal, high, low, critical
- Reference ranges included
- Ordered and resulted timestamps

#### 8. Medications (~40 medications)
- Drugs: Metformin, Atorvastatin, Lisinopril, Albuterol, Levothyroxine, Omeprazole
- Doses and frequencies
- Active and stopped statuses
- Start and end dates

#### 9. Tasks (~30 tasks)
- Types: Schedule follow-up, Repeat labs, Annual wellness visit, Medication refill, Care plan review
- Priorities: low, medium, high
- Status: open, done
- Due dates (some overdue, some upcoming)

#### 10. Alerts (~20 alerts)
- Generated from critical labs, elevated vitals, overdue tasks
- Severity: low, medium, high
- Categories: lab, vitals, task
- Status: active, resolved

### Data Selectors

The `mock/selectors/` directory provides optimized data access:

- **dashboard.ts**: Dashboard statistics and recent data
- **analytics.ts**: Aggregated analytics data
- **patient.ts**: Patient-specific data retrieval
- **date.ts**: Date formatting and utilities

### Type Safety

All data models are strongly typed with TypeScript interfaces in `mock/types.ts`, ensuring type safety throughout the application.

## 🔔 Service Workers & Notifications

### Service Worker Implementation

#### Registration
- Registered in `main.tsx` on application startup
- Checks for Service Worker support in browser
- Logs registration status

#### Service Worker Features (`public/service-worker.js`)

1. **Install Event**
   - Logs when service worker is installed
   - Can be extended for asset caching

2. **Activate Event**
   - Logs when service worker is activated
   - Can be extended for cache cleanup

3. **Notification Click Handler**
   - Intercepts notification clicks
   - Closes the notification
   - Opens the application to root route
   - Provides seamless user experience

### Notification System

#### Notification Utility (`utils/notification.ts`)

The `showNotification()` function handles browser notifications:

1. **Permission Check**
   - Checks if Notification API is supported
   - Verifies current permission status
   - Requests permission if not granted

2. **Service Worker Display (Preferred)**
   - Uses `navigator.serviceWorker.ready`
   - Displays notification through service worker
   - Includes title, body, icon, and badge
   - Fallback to direct notification if service worker fails

3. **Fallback Mode**
   - Direct `new Notification()` if service worker unavailable
   - Ensures notifications work in all scenarios

#### Usage in Application

Notifications are triggered for:
- Patient addition success
- Authentication events (via toast notifications)
- Can be extended for:
  - Appointment reminders
  - Critical lab alerts
  - Task due notifications

### Benefits

- **Background Operation**: Notifications work even when app is minimized
- **Cross-Tab Consistency**: Service worker ensures consistent behavior
- **User Engagement**: Keeps users informed of important events
- **Offline Capability**: Can be extended for offline notifications

## 📊 State Management

### Zustand Stores

The application uses Zustand for lightweight, performant state management.

#### 1. Authentication Store (`store/useAuthStore.tsx`)

**State**:
- `authUser`: boolean | null - User authentication status
- `isLoggingIn`: boolean - Login loading state
- `isSigningUp`: boolean - Registration loading state
- `isSendingEmail`: boolean - Email sending state
- `sentEmailData`: EmailData | null - Email verification data
- `isAuthChecking`: boolean - Auth check in progress

**Actions**:
- `setIsLogginIn`: Set login loading state
- `setIsSigningUp`: Set registration loading state
- `setAuthUser`: Set authentication status
- `setIsAuthChecking`: Set auth check status

**Usage**:
```typescript
const { authUser, isAuthChecking } = useAuthStore();
```

#### 2. Patient Store (`store/usePatientStore.tsx`)

**State**:
- `patients`: Patient[] - Array of patient data

**Actions**:
- `addPatient`: Add new patient to store

**Usage**:
```typescript
const { patients, addPatient } = usePatientStore();
```

### Store Benefits

- **No Context Provider**: Direct access without wrapper components
- **Type Safety**: Full TypeScript support
- **Performance**: Minimal re-renders with selectors
- **Simplicity**: Easy to understand and maintain
- **DevTools**: Zustand dev tools integration available

## 🧠 Thinking Approach & Architecture

### Design Philosophy

The project follows a modular, scalable architecture with these principles:

#### 1. Separation of Concerns
- **Modules**: Each feature (dashboard, patients, analytics) is a separate module
- **Services**: Business logic separated from UI (Firebase auth service)
- **Data Layer**: Mock database isolated from components
- **Selectors**: Data access logic centralized

#### 2. Type Safety First
- Comprehensive TypeScript interfaces for all data models
- Strict type checking enabled
- No `any` types in production code
- Type-safe state management with Zustand

#### 3. Performance Optimization
- **Code Splitting**: Lazy loading for all route components
- **Suspense**: Loading states during component fetch
- **Memoization**: Selectors prevent unnecessary recalculations
- **Efficient Rendering**: Zustand's selective subscriptions

#### 4. Developer Experience
- **Hot Module Replacement**: Vite for instant updates
- **ESLint**: Code quality enforcement
- **Path Aliases**: `@` alias for clean imports
- **Component Reusability**: shadcn/ui for consistent UI

#### 5. User Experience
- **Loading States**: Skeleton screens during data fetch
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time feedback
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

### Architecture Patterns

#### 1. Feature-Based Module Structure
```
modules/
├── analytics/
├── auth/
├── dashboard/
├── home/
├── patient-details/
└── patients/
```

Each module is self-contained with its own component, making it easy to:
- Add new features
- Maintain existing features
- Test individual modules
- Scale the application

#### 2. Service Layer Pattern
```
services/
└── firebaseAuth.ts
```

Business logic (authentication) is separated from UI components:
- Easy to swap Firebase for another auth provider
- Testable without UI dependencies
- Reusable across components

#### 3. Data Layer Abstraction
```
mock/
├── clinicDb.ts          # Data generation
├── types.ts             # Type definitions
└── selectors/           # Data access
```

Benefits:
- Easy to replace mock with real API
- Centralized data logic
- Type-safe data access
- Optimized queries with selectors

#### 4. Component Composition
```
components/
├── ui/                  # Base UI components
└── [Feature]Components # Feature-specific components
```

Layered component architecture:
- Reusable base components (shadcn/ui)
- Business components (AddPatientModal, LoginForm)
- Page components (Dashboard, Patients)

#### 5. State Management Strategy
- **Global State**: Zustand for auth and patient data
- **Local State**: React useState for component-specific state
- **Server State**: Mock database (can be replaced with React Query)
- **Form State**: Controlled components with validation

### Scalability Considerations

The architecture supports future growth:

1. **API Integration**: Mock selectors can be replaced with API calls
2. **Real-time Updates**: Firebase real-time listeners can be added
3. **Authentication**: Easy to add more auth providers
4. **Internationalization**: Component structure supports i18n
5. **Testing**: Modular design enables unit and integration tests
6. **Analytics**: Event tracking can be added at service layer

### Code Quality Practices

- **Consistent Naming**: Clear, descriptive variable and function names
- **Error Handling**: Comprehensive error catching and user feedback
- **Validation**: Input validation at multiple layers
- **Comments**: Inline documentation for complex logic
- **Type Safety**: Leverage TypeScript for compile-time checks

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
- Starts Vite dev server
- Hot module replacement enabled
- Available at http://localhost:5173

### Production Build
```bash
npm run build
```
- Creates optimized production build
- Outputs to `dist/` directory
- TypeScript compilation included

### Preview Production Build
```bash
npm run preview
```
- Serves production build locally
- Tests production behavior

### Linting
```bash
npm run lint
```
- Runs ESLint on codebase
- Checks for code quality issues

## 📝 Future Enhancements

Potential improvements for the application:

- **Real Backend**: Replace mock database with real API
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: More sophisticated charts and insights
- **File Upload**: Document management for patients
- **Calendar Integration**: Full calendar view for appointments
- **Messaging**: In-app communication system
- **Mobile App**: React Native or PWA
- **EHR Integration**: Connect with external EHR systems
- **Reporting**: PDF report generation
- **Audit Logs**: Track all user actions
- **Multi-tenancy**: Support multiple clinics

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open an issue on the repository.
