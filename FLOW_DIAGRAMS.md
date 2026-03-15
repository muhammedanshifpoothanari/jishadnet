# RishadNet User Flow Diagrams

## 1. Complete Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     RISHADNET PLATFORM                           │
└─────────────────────────────────────────────────────────────────┘

                        PUBLIC PAGES
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    [HOME PAGE]      [REGISTER COMPANY]    [LOGIN]
        │                   │                   │
    • Hero Section      • 3-Step Form      • Company Selector
    • Networking        • Validation       • Email & Password
      Graphics          • Progress Bar     • Session Creation
    • Features          • Success Screen   • Error Handling
    • CTAs              • Email Verify     • Redirect to Admin

        └───────────────────┼───────────────────┘
                            │
                      [AUTHENTICATION]
                            │
                    ┌───────┴────────┐
                    │                │
            LOGIN SUCCESS       LOGIN FAILED
                    │                │
            Create Session      Show Error
                    │                │
                    ↓                ↓
            [REDIRECT TO         [STAY ON LOGIN]
             /admin]

            
                PROTECTED DASHBOARD
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    [DASHBOARD]   [DEVICES]       [OTHER]
        │               │
    • Overview       • List View
    • Stats          • Device Cards
    • Company        • Actions:
      Context          - Copy MAC
    • Alerts           - Copy IP
    • Quick Stats      - Copy SSID
                        - Share WhatsApp
                        - QR Code
                        - Download QR
```

## 2. Registration Flow (Detailed)

```
START
  │
  ├─→ [STEP 1: Company Info]
  │   ├─ Input: Company Name*
  │   ├─ Input: Industry
  │   ├─ Input: Company Email*
  │   ├─ Input: Website
  │   ├─ Input: Phone*
  │   └─ Validation ──→ Next Button
  │       │
  │       ├─→ [VALID] ──→ Continue
  │       └─→ [INVALID] ──→ Show Error
  │
  ├─→ [STEP 2: Admin Account]
  │   ├─ Input: Full Name*
  │   ├─ Input: Email*
  │   ├─ Input: Password* (8+ chars, mixed case, numbers)
  │   ├─ Input: Confirm Password*
  │   ├─ Input: Phone
  │   └─ Validation ──→ Next Button
  │       │
  │       ├─→ [VALID] ──→ Continue
  │       └─→ [INVALID] ──→ Show Error
  │
  ├─→ [STEP 3: Review & Confirm]
  │   ├─ Display: Company Info Summary
  │   ├─ Display: Admin Info Summary
  │   ├─ Checkbox: Terms & Conditions
  │   └─ Submit Button
  │       │
  │       ├─→ [SUBMIT]
  │       │   ├─ Save to localStorage['companies']
  │       │   ├─ Save to localStorage['users']
  │       │   └─ Show Loading
  │       │
  │       └─→ [SUCCESS]
  │           ├─ Display: Verification Email Screen
  │           ├─ Show: Email Address
  │           └─ Links: [Go to Login] [Back to Home]
  │
  └─→ END
```

## 3. Login Flow (Detailed)

```
START: /login
  │
  ├─→ Load Companies from localStorage
  │   │
  │   ├─→ [COMPANIES FOUND]
  │   │   └─ Populate Dropdown
  │   │
  │   └─→ [NO COMPANIES]
  │       └─ Show "Register Your Company" message
  │
  ├─→ [FORM INPUT]
  │   ├─ Select Company from Dropdown
  │   ├─ Enter Email
  │   ├─ Enter Password (with show/hide toggle)
  │   └─ Click "Login"
  │
  ├─→ [VALIDATION]
  │   ├─ Check: Company Selected?
  │   │   └─→ [NO] ──→ Show Error "Select Company"
  │   │
  │   ├─ Check: Email Format Valid?
  │   │   └─→ [NO] ──→ Show Error "Invalid Email"
  │   │
  │   ├─ Check: Password Not Empty?
  │   │   └─→ [NO] ──→ Show Error "Enter Password"
  │   │
  │   └─ Check: Credentials Match localStorage?
  │       ├─→ [YES]
  │       │   ├─ Create Session
  │       │   ├─ localStorage.setItem('currentUser', {...})
  │       │   ├─ Show Success Toast
  │       │   └─ Redirect to /admin
  │       │
  │       └─→ [NO]
  │           └─ Show Error "Invalid Credentials"
  │
  └─→ END
```

## 4. Dashboard Session Flow

```
LOAD: /admin
  │
  ├─→ Check localStorage['currentUser']
  │   ├─→ [EXISTS]
  │   │   ├─ Load User Data
  │   │   ├─ Load Company Data
  │   │   ├─ Render Dashboard
  │   │   │
  │   │   └─→ USER CAN:
  │   │       ├─ View Dashboard
  │   │       ├─ Access Devices
  │   │       ├─ View Alerts
  │   │       ├─ Change Settings
  │   │       ├─ Switch Companies (in sidebar)
  │   │       └─ Sign Out
  │   │
  │   └─→ [NOT EXISTS]
  │       ├─ No valid session
  │       ├─ Redirect to /login
  │       └─ Show "Please login" message
  │
  ├─→ [COMPANY SWITCHER]
  │   ├─ Load all companies from localStorage
  │   ├─ Show current company highlighted
  │   │
  │   ├─→ User Selects New Company
  │   │   ├─ Update currentUser.companyId
  │   │   ├─ localStorage.setItem('currentUser', {...})
  │   │   ├─ Show "Switched to [Company]" toast
  │   │   └─ Refresh Dashboard Data
  │   │
  │   └─ Display checked icon next to active company
  │
  ├─→ [SIGN OUT]
  │   ├─ localStorage.removeItem('currentUser')
  │   ├─ Clear session data
  │   ├─ Show Success Toast
  │   └─ Redirect to /login
  │
  └─→ END
```

## 5. Data State Management

```
LOCAL STORAGE STRUCTURE
│
├─ "companies" (JSON Array)
│  └─ [{
│     ├─ id: "unique-hash"
│     ├─ companyName: "Company Name"
│     ├─ industry: "Tech/Finance/etc"
│     ├─ companyEmail: "admin@company.com"
│     ├─ website: "https://company.com"
│     ├─ phone: "+966 500 000 000"
│     └─ createdAt: "ISO-timestamp"
│  }]
│
├─ "users" (JSON Array)
│  └─ [{
│     ├─ id: "unique-hash"
│     ├─ companyId: "matches-company-id"
│     ├─ fullName: "Admin Name"
│     ├─ email: "admin@company.com"
│     ├─ password: "raw-password-string"
│     ├─ phone: "+966 500 000 000"
│     ├─ role: "admin" | "user"
│     └─ createdAt: "ISO-timestamp"
│  }]
│
└─ "currentUser" (JSON Object - Active Session)
   ├─ id: "user-id"
   ├─ email: "admin@company.com"
   ├─ companyId: "company-id"
   ├─ fullName: "Admin Name"
   └─ role: "admin"
```

## 6. Component Hierarchy

```
RootLayout
│
├─ page.tsx (Home)
│  ├─ Navigation (with CTAs)
│  ├─ Hero Section
│  │  └─ SVG Network Graphics (animated)
│  ├─ Features Section
│  ├─ Demo Section
│  └─ Security Section
│
├─ /register/company/page.tsx (Company Registration)
│  ├─ Header
│  ├─ Progress Indicator
│  ├─ Step 1 Form (conditional)
│  ├─ Step 2 Form (conditional)
│  ├─ Step 3 Review (conditional)
│  ├─ Success Screen (conditional)
│  └─ Navigation Buttons
│
├─ /login/page.tsx (Admin Login)
│  ├─ Header
│  ├─ Login Form
│  ├─ Company Selector Dropdown
│  ├─ Email Input
│  ├─ Password Input (with toggle)
│  └─ Login Button
│
└─ /admin/layout.tsx (Protected Dashboard)
   ├─ Sidebar
   │  ├─ Logo & Branding
   │  ├─ Company Selector (with dropdown)
   │  ├─ Navigation Menu
   │  ├─ User Profile Section
   │  └─ Sign Out Button
   ├─ Top Bar
   │  ├─ Menu Button (mobile)
   │  ├─ Breadcrumb (desktop)
   │  ├─ Notifications
   │  ├─ Theme Toggle
   │  └─ User Info
   ├─ Main Content
   │  └─ Page-specific content
   └─ Bottom Nav (mobile)
      └─ Quick navigation
```

## 7. Error Handling Flow

```
USER ACTION (Form Submit)
  │
  ├─→ VALIDATION LAYER
  │   ├─ Required fields empty?
  │   ├─ Email format invalid?
  │   ├─ Password too short?
  │   ├─ Passwords don't match?
  │   └─ Credentials don't exist?
  │
  ├─→ [VALIDATION FAILS]
  │   ├─ Identify Error Type
  │   ├─ Generate Error Message
  │   ├─ Highlight Invalid Field
  │   ├─ Show Toast Notification
  │   └─ Keep Form Values (except password)
  │
  ├─→ [VALIDATION PASSES]
  │   ├─ Proceed with Action
  │   ├─ Save Data
  │   ├─ Create Session
  │   ├─ Show Success Toast
  │   └─ Redirect if needed
  │
  └─→ END
```

## 8. Responsive Design Breakpoints

```
MOBILE (< 768px)
├─ Single column layouts
├─ Full-width cards
├─ Bottom navigation for main nav
├─ Sidebar hidden (shown on menu click)
├─ Larger touch targets (48px+)
├─ Font sizes optimized for readability
└─ Swipe gestures supported

TABLET (768px - 1024px)
├─ Multi-column support
├─ Side-by-side layouts
├─ Collapsible sidebar
├─ Larger cards with more spacing
├─ Grid layouts for content
└─ Both sidebar and bottom nav available

DESKTOP (> 1024px)
├─ Multi-column layouts
├─ Full sidebar always visible
├─ Detailed table views
├─ Side-by-side comparisons
├─ Hover states on interactive elements
└─ Max-width containers
```

## 9. Authentication State Machine

```
┌─────────────────────────────────────────────┐
│         AUTHENTICATION STATES               │
└─────────────────────────────────────────────┘

        [NO SESSION]
             │
    ┌────────┴────────┐
    │                 │
   VISIT          VISIT
   /login         /admin
    │                 │
    ↓                 ↓
  SHOW LOGIN    REDIRECT TO /login
   FORM              │
    │                ↓
    └────────→ [REDIRECT STATE]
               │
    ┌──────────┴──────────┐
    │                     │
[VALID CREDS]         [INVALID CREDS]
    │                     │
    ↓                     ↓
CREATE SESSION        SHOW ERROR
    │                     │
    ↓                     ↓
[ACTIVE SESSION]    [STAY ON /login]
    │
    ├─→ User in /admin ✅
    ├─→ Can switch companies ✅
    ├─→ Can access all pages ✅
    │
    └─→ Click Sign Out
        │
        ├─ Clear Session
        ├─ Remove currentUser
        └─→ [NO SESSION]
            Redirect to /login
```

## 10. Feature Comparison: Before vs After

```
BEFORE IMPLEMENTATION:
├─ Home page generic hero
├─ Device registration as primary action
├─ No company context
├─ Admin dashboard with mock data
├─ No login flow
└─ No multi-company support

AFTER IMPLEMENTATION:
├─ Animated hero with networking graphics ✨
├─ Company registration as primary action ✨
├─ Full company management system ✨
├─ Company context throughout app ✨
├─ Multi-step registration flow ✨
├─ Proper login with company selector ✨
├─ Session management ✨
├─ Company switching in dashboard ✨
├─ User profile display ✨
└─ Protected dashboard routes ✨
```

---

These diagrams provide a complete visual reference for:
- User journeys and flows
- Component structure and hierarchy
- Data state management
- Error handling logic
- Responsive design considerations
- Authentication state machine
- Feature implementation overview
