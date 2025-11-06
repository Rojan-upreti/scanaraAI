# Scanara AI - Frontend

A beautiful, Apple-inspired UI prototype for Scanara AI - an AI-powered compliance scanning web application. This is a fully functional frontend with all features mocked (no real backend required).

## Features

- 🎨 **Apple-inspired UI Design** - Clean, modern interface with smooth animations
- 🔐 **Authentication** - Mock Google OAuth flow with localStorage persistence
- 📊 **Dashboard** - Welcome banner, API key management, and quick start guide
- 🔍 **Run Audit Modal** - Complete audit flow with progress stages
- 📄 **Audit Reports** - Detailed findings with severity levels and fix suggestions
- ⚙️ **Settings** - API key management and account settings
- 🌙 **Dark Mode** - Full dark mode support with smooth transitions
- 📱 **Responsive** - Works beautifully on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Layout.tsx    # Main layout wrapper
│   ├── Navbar.tsx    # Navigation bar with dark mode
│   └── RunAuditModal.tsx  # Audit submission modal
├── contexts/         # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Dark mode state
├── pages/           # Page components
│   ├── LandingPage.tsx    # Landing/marketing page
│   ├── Dashboard.tsx      # Main dashboard
│   ├── AuditReport.tsx    # Audit results page
│   └── Settings.tsx       # Settings page
├── App.tsx          # Main app component with routing
└── main.tsx         # Entry point
```

## Mocked Features

All features are fully functional on the frontend but use mocked data:

- **Authentication**: Simulated Google OAuth (stores user in localStorage)
- **API Keys**: Mock API keys with show/hide and copy functionality
- **Audit Reports**: Pre-populated mock findings with different severity levels
- **Download PDF**: Shows alert (would normally download PDF)
- **Generate Keys**: Shows alert (would normally generate new key)

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme. The app uses a blue/purple gradient theme.

### Dark Mode

Dark mode is automatically persisted in localStorage and can be toggled via the navbar.

## License

MIT

