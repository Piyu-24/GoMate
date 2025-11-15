# GoMate - Travel & Transport Mobile App

A cross-platform mobile application built with React Native and TypeScript for viewing public transport schedules and exploring destinations.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Login & Registration with form validation (Yup)
- ✅ **Dynamic Transport List** - Fetches data from API and displays as cards
- ✅ **Detailed View** - Tap items to see full information
- ✅ **Favourites** - Mark and persist favourite items
- ✅ **State Management** - Redux Toolkit for global state
- ✅ **Data Persistence** - AsyncStorage for secure local storage
- ✅ **Navigation** - Stack + Bottom Tab navigation
- ✅ **Responsive UI** - Clean, consistent design with Feather Icons

### Bonus Features
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **Search** - Search transport items in real-time
- ✅ **Pull to Refresh** - Refresh transport data
- ✅ **User Profile** - View and manage user information

## 📱 Screenshots

The app includes:
- Login/Register screens with validation
- Home screen with transport cards
- Detail view with comprehensive information
- Favourites management
- Profile with settings and dark mode toggle

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Redux Toolkit
- **Form Management**: Formik
- **Validation**: Yup
- **Storage**: AsyncStorage
- **Icons**: Feather Icons (@expo/vector-icons)
- **API**: DummyJSON API

## 📦 Installation

1. **Navigate to the project directory**:
   ```bash
   cd GoMate
   ```

2. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

4. **Run on your device**:
   - Install **Expo Go** app on your phone
   - Scan the QR code from the terminal
   - The app will load on your device

## 🔐 Demo Credentials

Use these credentials to test the login:
- **Username**: `emilys`
- **Password**: `emilyspass`

Other test users from DummyJSON:
- Username: `michaelw` / Password: `michaelwpass`
- Username: `sophiab` / Password: `sophiabpass`

## 📁 Project Structure

```
GoMate/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── TransportCard.tsx
│   │       └── Loading.tsx
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── HomeNavigator.tsx
│   ├── redux/             # State management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── transportSlice.ts
│   │   │   ├── favouritesSlice.ts
│   │   │   └── themeSlice.ts
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── screens/           # App screens
│   │   ├── auth/          # Login & Register
│   │   ├── home/          # Home screen
│   │   ├── details/       # Detail view
│   │   ├── favourites/    # Favourites list
│   │   └── profile/       # User profile
│   ├── services/          # API services
│   │   ├── authService.ts
│   │   └── transportService.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── storage.ts
│   │   └── validation.ts
│   ├── theme/             # Theme configuration
│   │   ├── colors.ts
│   │   └── index.ts
│   └── constants/         # App constants
│       └── images.ts
├── App.tsx               # Root component
└── package.json

```

## 🎨 Design Patterns

- **Feature-based folder structure** for scalability
- **Separation of concerns** (UI, Business Logic, Data)
- **Reusable components** for consistency
- **Type safety** with TypeScript
- **Centralized state management** with Redux Toolkit
- **Secure storage** with AsyncStorage

## 📝 API Integration

The app uses **DummyJSON API** for:
- User authentication: `https://dummyjson.com/auth/login`
- Transport data: `https://dummyjson.com/products` (transformed to transport items)

## ✨ Key Features Implementation

### 1. Authentication
- Form validation with Yup schemas
- Secure token storage
- Persistent login state
- User data management

### 2. Navigation
- Stack Navigator for auth flow
- Bottom Tab Navigator for main app
- Nested Stack Navigator for home flow
- Type-safe navigation with TypeScript

### 3. State Management
- Redux Toolkit slices for modular state
- Typed hooks for type safety
- Async actions for API calls
- Persistent state with AsyncStorage

### 4. Favourites
- Toggle favourites with visual feedback
- Persist favourites locally
- Separate favourites screen
- Badge count on tab

### 5. Dark Mode
- Theme toggle in profile
- Persistent theme preference
- Consistent theming across all screens
- Dynamic color schemes

## 🚦 Running the App

### Development Mode
```bash
npm start
```

### Specific Platform
```bash
npm run android   # Android
npm run ios       # iOS (Mac only)
npm run web       # Web browser
```

## 📊 Best Practices Followed

✅ TypeScript for type safety  
✅ Modular component architecture  
✅ Proper error handling  
✅ Input validation  
✅ Responsive design  
✅ Accessibility considerations  
✅ Clean code structure  
✅ Consistent naming conventions  
✅ Reusable utilities  
✅ Proper state management  
✅ Secure data storage  
✅ Performance optimization  

## 🔄 Git Commits

The project follows feature-based commits:
- `feat: initial project setup`
- `feat: add authentication system`
- `feat: implement redux store`
- `feat: create navigation structure`
- `feat: add home screen with transport list`
- `feat: implement favourites functionality`
- `feat: add dark mode support`
- etc.

## 📄 Assignment Requirements Checklist

- ✅ User Authentication (Login & Register)
- ✅ React Hooks for form handling
- ✅ Form validation (Yup)
- ✅ Navigation (Stack + Bottom Tab)
- ✅ Dynamic item list from API
- ✅ Item cards with image, title, description, status
- ✅ Detail screen on item tap
- ✅ Redux Toolkit state management
- ✅ Favourites functionality
- ✅ Data persistence
- ✅ Consistent styling
- ✅ Feather Icons
- ✅ Responsive design
- ✅ Dark mode (Bonus)
- ✅ TypeScript
- ✅ Best practices & standards

## 👨‍💻 Developer

Developed as part of IN3210 Mobile Applications Development assignment.

## 📞 Support

For issues or questions, please refer to the course materials or contact your instructor.

---

**Note**: This app uses dummy APIs for demonstration purposes. In a production environment, connect to real transport APIs for live data.
