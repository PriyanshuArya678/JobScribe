# JobScribe Frontend

A React + TypeScript + Vite frontend application for the JobScribe email generation service.

## Features

- **User Authentication**: Register and login functionality
- **Resume Upload**: Upload PDF resumes for analysis
- **Email Generation**: Generate personalized emails based on job postings
- **Responsive Design**: Built with Tailwind CSS for mobile-first design

## Prerequisites

- Node.js version 20.19+ or 22.12+
- npm or yarn package manager

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend/job-scribe-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Backend Configuration

Make sure your backend API is running on `http://localhost:8000`. If your backend runs on a different port, update the `baseURL` in `src/services/api.ts`.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard with tabs
│   ├── EmailGenerator.tsx # Email generation component
│   ├── Login.tsx        # Login form
│   ├── Register.tsx     # Registration form
│   ├── ResumeUpload.tsx # Resume upload component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── services/            # API services
│   └── api.ts          # API client
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## API Endpoints

The frontend connects to the following backend endpoints:

- `POST /user/register` - User registration
- `POST /user/token` - User login
- `POST /resume/upload` - Resume upload
- `POST /email/generate-email` - Email generation

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Resume**: Upload your PDF resume to populate your profile
3. **Generate Email**: Enter a job posting URL to generate a personalized email

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Environment Variables

Create a `.env` file in the root directory if you need to customize the API URL:

```
VITE_API_URL=http://localhost:8000
```

Then update the API client to use this environment variable.
