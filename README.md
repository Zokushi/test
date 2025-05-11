# Cursed Compass 🧭👻

A horror-themed vacation and travel website for spooky enthusiasts! Find haunted hotels, cryptid sightings, and supernatural attractions across the United States.

## Project Structure

```
cursed-compass/
├── frontend/      # React + TypeScript frontend application
├── backend/       # Node.js + Express backend API
└── shared/        # Shared types and utilities
```

## Tech Stack

- **Frontend**: React, TypeScript, Bootstrap
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions (planned)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cursed-compass.git
   cd cursed-compass
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables as needed

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## Development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ../frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Proprietary Notice

© 2025 Cursed Compass. All rights reserved. This project and its contents are confidential and proprietary. Unauthorized copying, distribution, or use of any files in this repository is strictly prohibited. 