# Cursed Compass Development Roadmap

## Current Progress
- ✅ Set up basic application structure (React frontend, Express backend)
- ✅ Implemented Sequelize ORM for database management
- ✅ Created basic location viewing functionality
- ✅ Pushed to GitHub repository
- ✅ Simplified database schema and set up migration system
- ✅ Created seed data with 15 haunted locations

## Immediate Next Steps:

### 1. Database Migration & Cleanup (COMPLETED ✅)
- [x] Set up proper Sequelize migrations folder structure
- [x] Create migration to drop existing tables with old schema
- [x] Create migration to recreate location table with simplified schema (removing features, amenities, pricePerNight, maxGuests)
- [x] Add seed file for initial location data
- [x] Test database reset process
- [x] Update Location model to match new schema

### 2. UI Refinements & Styling Improvements (CURRENT PRIORITY)
- [ ] Create consistent theme file with color variables
- [ ] Add atmospheric effects (fog overlay, subtle animations)
- [ ] Improve typography and spacing
- [ ] Enhance location cards with better hover states
- [ ] Create loading skeletons for better UX

### 3. Hosting Configuration
- [ ] Set up hosting environment (Vercel, Netlify, or custom)
- [ ] Create "Coming Soon" page for public access
- [ ] Implement developer access toggle
- [ ] Configure environment variables for different environments
- [ ] Set up proper domain with Porkbun

### 4. API Integration & Functionality 
- [ ] Implement user authentication system
- [ ] Create booking form functionality
- [ ] Add location filtering capability 
- [ ] Implement search functionality

### 5. Component Organization & State Management
- [ ] Reorganize components for better reusability
- [ ] Implement proper state management (Context API or Redux)
- [ ] Create custom hooks for repeated functionality
- [ ] Add error boundaries for better error handling

## Future Enhancements:

### 1. Optimize Your Data Loading Strategy
- **Don't store images in the database**. Instead:
  - Create an organized `/public/images/locations` directory structure
  - Use a consistent naming convention (e.g., `location-{id}.jpg` or categorized folders)
  - Store just the image paths/references in your database
  - This approach is more scalable and performant

```
/public/images/locations/
├── lighthouses/
│   ├── deserted-lighthouse-inn.jpg
│   └── phantom-beacon.jpg
├── cabins/
│   ├── haunted-cabin.jpg
│   └── cryptid-cabin.jpg
└── hotels/
    └── haunted-hotel.jpg
```

### 2. Build a Data Management System
Instead of writing individual scripts or using DBeaver for each location:

```typescript
// Create an admin panel at /admin/locations
// Basic implementation: 
export function LocationsAdmin() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: '', description: '', ...
  });

  // Add form, bulk upload option, edit/delete capabilities
}
```

### 3. Authentication & User Management
```typescript
// Option 1: Build your own auth (simplest implementation)
// Option 2: Auth0 integration (recommended for production)
import { Auth0Provider } from '@auth0/auth0-react';

// Set up protected routes for booking/user features
```

### 4. Booking System Implementation
```typescript
// Create a booking service with:
// - Date selection with availability checking
// - Guest information collection
// - Payment processing (or placeholder)
// - Confirmation emails
```

### 5. Infrastructure & CI/CD
- Set up CI/CD (GitHub Actions)
- Configure proper environment variables
- Plan for image hosting (AWS S3/Cloudinary for production)

### 6. Security Enhancements
- **Database Security**:
  - Create restricted database users with limited permissions (not postgres superuser)
  - Use randomly generated strong passwords for database access
  - Implement IP restriction for database access in production

- **User Authentication & Authorization**:
  - Implement role-based access control (admin, user, moderator)
  - Strong password policies for user accounts
  - Use secure authentication methods (OAuth, JWT with proper expiration)

- **Environment Security**:
  - Use a secrets manager for production credentials (AWS Secrets Manager, HashiCorp Vault)
  - Ensure .env files are never committed to version control
  - Implement proper CORS policies for API endpoints

### 7. Code Quality & Testing
```typescript
// Add tests for critical paths
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('location details renders correctly', () => {
  render(<LocationDetails location={mockLocation} />);
  expect(screen.getByText('Haunted Cabin')).toBeInTheDocument();
});
```

### 8. Design Improvements
- Implement a design system (Tailwind, Chakra UI, or MUI)
- Focus on responsive design for mobile users
- Add subtle animations/transitions for better UX
