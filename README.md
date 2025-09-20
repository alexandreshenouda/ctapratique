# Stéphane App

A cross-platform React Native application built with Expo that runs on Android, iOS, and web browsers. The app is inspired by the professional structure of [ctapratique.com](https://www.ctapratique.com/) and focuses on professional training and formation content.

## Features

- **Cross-Platform**: Runs on Android, iOS, and web browsers
- **Professional Layout**: Inspired by ctapratique.com structure
- **Home Screen**: Hero section with statistics and professional presentation
- **Formation**: Detailed training programs and workshops
- **Contact**: Complete contact form and information
- **Profile**: Personal professional information
- **Modern UI**: Clean, professional design with platform-specific styling

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stephane-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Running on Different Platforms

- **Web**: `npm run web` or press `w` in the terminal
- **Android**: `npm run android` or press `a` in the terminal (requires Android emulator or device)
- **iOS**: `npm run ios` or press `i` in the terminal (requires iOS simulator or device, macOS only)

## Project Structure

```
stephane-app/
├── src/
│   └── screens/
│       ├── ProfileScreen.tsx
│       ├── PersonalInfoScreen.tsx
│       └── DocumentsScreen.tsx
├── App.tsx
├── package.json
├── app.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── README.md
```

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type safety and better development experience
- **React Navigation**: Navigation between screens
- **Expo Vector Icons**: Icon library
- **React Native Safe Area Context**: Safe area handling

## Features Overview

### Home Screen (Accueil)
- Hero section with professional logo and title
- Key statistics (30+ years experience, 305+ professionals trained, 97% satisfaction)
- Services overview with formation details
- Workshop sections (Pré-désinfection, Nettoyage, Conditionnement, etc.)
- Professional quote and testimonials

### Formation Screen
- Available training programs (URPS Normandie, PACA, Océan Indien)
- Detailed program objectives and content
- Practical information and modalities
- Legal references and compliance information

### Contact Screen
- Complete contact information with interactive elements
- Professional contact form with validation
- Available training cities across France
- Quick statistics reminder section

## Development

The app is built with TypeScript for better type safety and development experience. All screens are responsive and work across different screen sizes.

## Platform-Specific Features

- **iOS**: Native shadow effects
- **Android**: Material Design elevation
- **Web**: CSS box shadows and responsive design

## Future Enhancements

- Document upload and management
- Search functionality
- Document preview
- Cloud synchronization
- Authentication system
- Settings screen

## License

This project is private and proprietary.
