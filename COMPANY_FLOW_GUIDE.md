# RishadNet Company Registration & Login Flow Guide

## Overview
This document outlines the complete user flow for company registration, login, and device management in RishadNet.

## User Journey

### 1. New Company Registration
**Path**: Home Page → "Register Your Company" → Multi-step Form → Verification Email

**Steps**:
- User clicks "Register Your Company" button on hero section
- **Step 1: Company Information**
  - Enter: Company Name*, Industry, Email*, Website, Phone*
  - Visual feedback with progress indicator
  - All fields properly labeled with required indicators

- **Step 2: Admin Account**
  - Create admin credentials (Name, Email, Password)
  - Password validation (minimum 8 chars, uppercase, lowercase, numbers)
  - Confirm password field
  - Optional phone number

- **Step 3: Review & Confirm**
  - Summary of all entered information
  - Terms & conditions acknowledgment
  - Completion button

**Success State**:
- Displays verification email sent message
- Shows verification email address
- Links to login and home page
- Data stored in localStorage (companies + users arrays)

**Data Storage Structure**:
```javascript
// localStorage.setItem("companies", JSON.stringify([{
//   id: "unique-id",
//   companyName: "...",
//   industry: "...",
//   companyEmail: "...",
//   website: "...",
//   phone: "...",
//   createdAt: "2024-..."
// }]))

// localStorage.setItem("users", JSON.stringify([{
//   id: "unique-id",
//   companyId: "...",
//   fullName: "...",
//   email: "...",
//   password: "...",
//   phone: "...",
//   role: "admin",
//   createdAt: "2024-..."
// }]))
```

### 2. Admin Login
**Path**: Home Page → "Admin Login" OR Login Page → Select Company → Enter Credentials

**Features**:
- Company Selector Dropdown
  - Shows all registered companies
  - Visual indicator of selected company
  - Easy switching between companies

- Email Input
  - Validation for format
  - Icon indicator
  - Placeholder guidance

- Password Input
  - Toggle show/hide password
  - Minimum security hints
  - Input validation

**Login Flow**:
1. Select company from dropdown (if multiple companies registered)
2. Enter email address
3. Enter password
4. System validates against localStorage
5. On success:
   - Store session: `localStorage.setItem("currentUser", JSON.stringify({...}))`
   - Redirect to `/admin` dashboard
   - Display success toast

**Error Handling**:
- Invalid email or password → "Invalid email or password"
- No company selected → "Please select a company"
- Empty fields → "Please enter email and password"
- No companies registered → Prompt to register

### 3. Admin Dashboard
**Path**: `/admin` (Protected - requires currentUser in localStorage)

**Features**:
- **Sidebar** (Desktop) / **Mobile Menu**:
  - Company Selector (with visual dropdown)
  - Navigation to: Dashboard, Devices, Alerts, Settings
  - Quick action: "Register Device" button
  - User profile section with current user info
  - Sign out button

- **Top Bar**:
  - Mobile: Menu button, logo, theme toggle, notifications
  - Desktop: Breadcrumb navigation, company context, user info
  - Theme toggle available on all screens

- **Mobile Bottom Navigation**:
  - Quick access to main sections
  - Active state indicators
  - Responsive touch targets (48px minimum)

**Dashboard Content**:
- Stats cards (Devices, Users, SSIDs, Alerts)
- Device management interface
- Real-time monitoring
- Alerts and notifications

### 4. Company Switching
**In Admin Dashboard**:
1. Click on company selector in sidebar (mobile shows icon, desktop shows company name)
2. Dropdown appears showing all companies the user belongs to
3. Select different company
4. Current user context updates
5. All dashboard data refreshes for new company context
6. Success toast displayed: "Switched to [Company Name]"

### 5. Device Registration
**Path**: Admin → "Register Device" OR Home → "Register Your Device"

**Features** (from existing flow):
- Personal Information section
- Device Information with type selector
- MAC address, IP addresses, SSID input
- Additional notes
- Form validation and submission

**Success State**:
- Confirmation message
- Option to register another device or return home

## Navigation Structure

```
Home (Public)
├── Hero Section (with networking graphics)
├── Nav: "Register Your Company" → /register/company
├── Nav: "Admin Login" → /admin
└── Features, Demo, Security sections

Register Company (/register/company)
└── 3-step form → Verification email sent screen

Login (/login)
├── Company selector (if multiple companies)
└── Email + Password → Dashboard redirect

Admin Dashboard (/admin)
├── Sidebar/Mobile Menu
│   ├── Company Selector (switch between companies)
│   ├── Dashboard
│   ├── Devices
│   ├── Alerts
│   ├── Settings
│   └── User Profile + Sign Out
├── Main Content Area
│   └── Dashboard stats and charts
└── Bottom Nav (Mobile)
    └── Quick navigation links

Device Registration (/register)
└── Device form submission

Device Management (/admin/devices)
├── Device list/cards
├── Individual device actions
│   ├── Copy MAC/IP/SSID
│   ├── Share via WhatsApp
│   ├── View QR Code
│   └── Download QR Code
└── Bulk actions
```

## Key Design Principles

### User Experience
- **Clear progression**: Each step has clear instructions and next/previous navigation
- **Validation feedback**: Real-time validation with helpful error messages
- **Progress indication**: Multi-step forms show progress visually
- **Mobile-first**: All flows optimized for touch (48px+ buttons)
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Company Management
- **Multi-company support**: Admins can switch between companies seamlessly
- **Company context**: Always visible which company is active
- **Data isolation**: Each company's data stored separately in localStorage
- **Easy identification**: Company name displayed prominently

### Data Flow
- **localStorage-based**: All data persists in browser
- **Session management**: Current user stored during active session
- **Security considerations**: Passwords stored (note: in production use secure backend)
- **Clean logout**: Session cleared on sign out

## Error Handling & Edge Cases

### Registration
- Duplicate email validation (check existing users)
- Password mismatch detection
- Required field validation
- Email format validation

### Login
- Invalid credentials handling
- No company selected
- Expired session (check on dashboard load)
- Multiple companies available (dropdown required)

### Company Switching
- Refresh data for new company context
- Maintain user session
- Clear previous company's cached data if needed
- Notify user of successful switch

## Testing Checklist

### Registration Flow
- [ ] All required fields validated
- [ ] Progress indicator works
- [ ] Back button navigates between steps
- [ ] Review step shows correct data
- [ ] Success screen displays verification email
- [ ] Data persisted in localStorage

### Login Flow
- [ ] Company dropdown shows all registered companies
- [ ] Invalid credentials rejected with error message
- [ ] Valid credentials redirect to dashboard
- [ ] Session created in localStorage
- [ ] Email/password validation works
- [ ] Password show/hide toggle works

### Dashboard
- [ ] Current user displays correctly
- [ ] Company selector functional
- [ ] Company switching updates context
- [ ] Sign out clears session and redirects
- [ ] All navigation links work
- [ ] Mobile menu opens/closes properly
- [ ] Bottom nav visible on mobile

### Device Management
- [ ] Register device flow works
- [ ] Device list displays correctly
- [ ] Copy actions work (MAC, IP, SSID)
- [ ] QR code generation and download
- [ ] WhatsApp share functionality
- [ ] Mobile card layout responsive
- [ ] Desktop table layout functional

## Future Enhancements

1. **Backend Integration**
   - Move from localStorage to secure database (Supabase, Firebase, etc.)
   - Implement proper password hashing (bcrypt)
   - Add email verification system
   - Session tokens with expiration

2. **Advanced Features**
   - Multi-role support (Admin, Manager, User)
   - Device assignment to users
   - Bulk device operations
   - Device location tracking
   - Historical logs and analytics
   - Automated compliance reports

3. **Security**
   - Two-factor authentication
   - IP whitelisting
   - Audit logs
   - Rate limiting
   - HTTPS enforcement

4. **User Management**
   - User invitations
   - Role-based permissions
   - Department organization
   - Activity tracking

5. **Integrations**
   - LDAP/Active Directory sync
   - API for third-party integrations
   - Webhook support for events
   - Export to CSV/Excel

## Local Development Notes

### File Structure
```
app/
├── page.tsx (Home with networking graphics)
├── layout.tsx (Root layout with providers)
├── globals.css (Design tokens)
├── register/
│   ├── company/page.tsx (Company registration)
│   └── page.tsx (Device registration)
├── login/page.tsx (Login with company selector)
└── admin/
    ├── layout.tsx (Admin layout with company switcher)
    ├── page.tsx (Dashboard)
    ├── devices/page.tsx (Device management)
    ├── alerts/page.tsx
    └── settings/page.tsx
```

### localStorage Keys
- `companies`: Array of company objects
- `users`: Array of user objects
- `currentUser`: Currently logged-in user session object

### Testing with Mock Data
Add to browser console to populate test data:
```javascript
localStorage.setItem("companies", JSON.stringify([{
  id: "comp-1",
  companyName: "Tech Corp",
  industry: "Technology",
  companyEmail: "admin@techcorp.com",
  website: "https://techcorp.com",
  phone: "+966 5XX XXX XXXX",
  createdAt: new Date().toISOString()
}]));

localStorage.setItem("users", JSON.stringify([{
  id: "user-1",
  companyId: "comp-1",
  fullName: "John Admin",
  email: "john@techcorp.com",
  password: "Password123",
  phone: "+966 5XX XXX XXXX",
  role: "admin",
  createdAt: new Date().toISOString()
}]));
```

Then login with: john@techcorp.com / Password123
