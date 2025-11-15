# GoMate - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your computer
- Expo Go app installed on your phone (iOS or Android)
- The project is already set up in: `c:\Users\UPEKSHA\MoMate\GoMate`

## 📱 Running the App

### Step 1: Navigate to Project Directory
```bash
cd "c:\Users\UPEKSHA\MoMate\GoMate"
```

### Step 2: Start the Development Server
```bash
npm start
```
or
```bash
npx expo start
```

### Step 3: Open on Your Phone
1. A QR code will appear in your terminal
2. Open the **Expo Go** app on your phone
3. Scan the QR code:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app's built-in scanner
4. The app will load and run on your device

## 🔐 Testing the App

### Demo Login Credentials
Use these working credentials from DummyJSON API:

**User 1:**
- Username: `emilys`
- Password: `emilyspass`

**User 2:**
- Username: `michaelw`
- Password: `michaelwpass`

**User 3:**
- Username: `sophiab`
- Password: `sophiabpass`

### Testing Registration
The registration form is fully functional with validation. You can register with any data, and it will create a simulated user account.

## ✅ Features to Test

### 1. Authentication
- ✅ Login with demo credentials
- ✅ Try invalid credentials (should show error)
- ✅ Register a new account
- ✅ Form validation (try submitting empty fields)
- ✅ Password requirements validation

### 2. Home Screen
- ✅ View transport items (bus, train, flight, destination)
- ✅ Search for items using the search bar
- ✅ Pull down to refresh the list
- ✅ Tap on any card to view details

### 3. Details Screen
- ✅ View full transport information
- ✅ See departure/arrival times
- ✅ Check pricing and ratings
- ✅ Add to favourites using the heart icon
- ✅ Navigate back

### 4. Favourites
- ✅ Mark items as favourites from Home or Details
- ✅ View all favourites in the Favourites tab
- ✅ See favourite count badge on tab
- ✅ Remove from favourites

### 5. Profile
- ✅ View user information
- ✅ Toggle dark mode
- ✅ Clear favourites
- ✅ Logout

### 6. Dark Mode (Bonus Feature)
- ✅ Toggle dark mode in Profile
- ✅ See theme persist after closing app
- ✅ All screens adapt to dark theme

### 7. Data Persistence
- ✅ Close and reopen the app
- ✅ User stays logged in
- ✅ Favourites are preserved
- ✅ Theme preference is saved

## 🎯 Testing Checklist

- [ ] Login with demo credentials
- [ ] View transport list on home screen
- [ ] Search for items
- [ ] Tap item to view details
- [ ] Add items to favourites
- [ ] View favourites tab
- [ ] Toggle dark mode
- [ ] Logout and login again
- [ ] Register new account
- [ ] Test form validations
- [ ] Pull to refresh
- [ ] Clear favourites from profile

## 🐛 Common Issues & Solutions

### Issue: Metro bundler won't start
**Solution:** Clear cache and restart
```bash
npx expo start -c
```

### Issue: Can't connect to development server
**Solution:** 
1. Ensure phone and computer are on the same WiFi network
2. Try tunnel mode: `npx expo start --tunnel`

### Issue: App shows blank screen
**Solution:** 
1. Reload the app in Expo Go
2. Check terminal for error messages
3. Restart the development server

### Issue: TypeScript errors
**Solution:** The project is properly configured with TypeScript. If you see errors, try:
```bash
npm install
```

## 📊 App Flow

```
1. Launch App
   ↓
2. Login/Register Screen
   ↓
3. Main App (Bottom Tabs)
   ├── Home Tab
   │   ├── Transport List
   │   └── Details Screen
   ├── Favourites Tab
   │   └── Favourite Items
   └── Profile Tab
       └── Settings & Logout
```

## 🎨 UI Components

### Screens
- **Login Screen**: Username/password authentication
- **Register Screen**: Full registration form with validation
- **Home Screen**: Scrollable list of transport cards with search
- **Details Screen**: Full information about selected transport
- **Favourites Screen**: List of favourite items
- **Profile Screen**: User info and app settings

### Components
- **Button**: Primary, secondary, outline variants with loading states
- **Input**: Text input with icons, labels, and error messages
- **TransportCard**: Reusable card component for transport items
- **Loading**: Loading indicator

## 📝 Notes

- All data is fetched from DummyJSON API
- Transport items are generated from product data
- Images are from Unsplash
- Authentication tokens are stored securely
- App follows React Native best practices
- TypeScript provides type safety
- Redux Toolkit manages global state
- AsyncStorage handles data persistence

## 🎓 Assignment Requirements Coverage

✅ **User Authentication**: Login & Register with validation  
✅ **Navigation**: Stack + Bottom Tab navigators  
✅ **Dynamic List**: API-fetched transport items  
✅ **Item Cards**: Image, title, description, status  
✅ **Details Screen**: Full item information  
✅ **State Management**: Redux Toolkit  
✅ **Favourites**: Add/remove with persistence  
✅ **Styling**: Consistent, clean UI  
✅ **Icons**: Feather Icons throughout  
✅ **Responsive**: Works on various screen sizes  
✅ **Dark Mode**: Bonus feature implemented  
✅ **TypeScript**: Full type safety  

## 💡 Tips

1. **Test on physical device** for best experience (already using Expo Go)
2. **Try dark mode** to see theme switching
3. **Add multiple favourites** to see badge count
4. **Use search** to filter transport items
5. **Pull to refresh** to reload data
6. **Test validations** by submitting invalid forms

---

**Ready to test?** Run `npm start` in the GoMate directory and scan the QR code!
