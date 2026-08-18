# Development Setup

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) / Android Studio (for Android)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

## Environment Variables

Create a `.env` file (not committed) for local configuration:

```env
API_URL=http://localhost:3000
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run lint` | Run linter |
| `npm test` | Run tests |
| `npm run build` | Build for production |

## Debugging

- Press `j` in terminal to open debugger
- Use React Native DevTools
- Enable "Debug JS Remotely" in Expo app