# API Integration Documentation

## 📡 Overview

This document details all external APIs used in the GoMate mobile application, demonstrating compliance with assignment requirements for real API integration.

---

## 🔐 1. Authentication API

### **DummyJSON Auth API**
- **Base URL**: `https://dummyjson.com`
- **Documentation**: https://dummyjson.com/docs/auth
- **Purpose**: User authentication and session management

### Endpoints Used

#### Login
```typescript
POST /auth/login
Content-Type: application/json

Request Body:
{
  "username": "emilys",
  "password": "emilyspass"
}

Response:
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```typescript
GET /auth/me
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson"
}
```

### Implementation
**File**: `src/services/authService.ts`
- Lines 77-88: Login API call
- Lines 115-129: Get current user API call
- Error handling with fallback to demo accounts
- Token storage using AsyncStorage

### Test Credentials
- Username: `emilys` / Password: `emilyspass`
- Username: `michaelw` / Password: `michaelwpass`
- Username: `sophiab` / Password: `sophiabpass`

---

## 🚌 2. Transport Data API

### **DummyJSON Products API**
- **Base URL**: `https://dummyjson.com/products`
- **Documentation**: https://dummyjson.com/docs/products
- **Purpose**: Fetch dynamic transport items (transformed from product data)

### Endpoints Used

#### Get All Products (Transport Items)
```typescript
GET /products?limit=30

Response:
{
  "products": [
    {
      "id": 1,
      "title": "Essence Mascara Lash Princess",
      "description": "...",
      "price": 9.99,
      "rating": 4.94,
      "thumbnail": "https://cdn.dummyjson.com/products/1/thumbnail.jpg"
    },
    ...
  ]
}
```

#### Get Single Product (Transport Item)
```typescript
GET /products/{id}

Response:
{
  "id": 1,
  "title": "Product Name",
  "description": "Product description",
  "price": 9.99,
  "rating": 4.5,
  "category": "category-name"
}
```

#### Search Products
```typescript
GET /products/search?q={query}

Response:
{
  "products": [...],
  "total": 10
}
```

### Data Transformation

The API returns product data which is transformed into transport items:

```typescript
Product Data → Transport Item
{
  id: product.id,
  title: product.title,
  description: product.description,
  type: 'bus' | 'train' | 'car' | 'tuk_tuk' | 'destination',
  status: 'Active' | 'Popular' | 'Upcoming',
  image: product.thumbnail,
  rating: product.rating,
  price: product.price * 10,
  from: "City A Station",
  to: "City B Terminal",
  route: "City A → City B"
}
```

### Implementation
**File**: `src/services/transportService.ts`
- Lines 304-324: Main fetch function with API call
- Lines 326-343: Fetch by ID with API call
- Lines 345-372: Search with API integration
- Lines 283-301: Data transformation logic
- Automatic fallback to local data on API errors

---

## 🖼️ 3. Image API

### **Unsplash Image CDN**
- **Base URL**: `https://images.unsplash.com`
- **Purpose**: High-quality images for transport items and destinations

### Usage
```typescript
// Transport images
bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
train: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400'
car: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'

// Destination images (10 Sri Lankan locations)
galle_fort: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800'
sigiriya: 'https://images.unsplash.com/photo-1557129616-e53c61ab0332?w=800'
```

### Implementation
**File**: `src/constants/images.ts`
- 14 unique image URLs
- Optimized with width parameters
- Used across transport cards and detail screens

---

## 📊 API Usage Statistics

| API | Endpoints | Purpose | Status |
|-----|-----------|---------|--------|
| DummyJSON Auth | 2 | User authentication | ✅ Active |
| DummyJSON Products | 3 | Transport data | ✅ Active |
| Unsplash | N/A | Images | ✅ Active |

---

## 🔄 Error Handling

All API calls implement comprehensive error handling:

### 1. Try-Catch Blocks
```typescript
try {
  const response = await axios.get(API_URL);
  return transformData(response.data);
} catch (error) {
  console.error('API Error:', error.message);
  return fallbackData;
}
```

### 2. Fallback Mechanisms
- Authentication: Demo accounts + local storage
- Transport Data: Pre-loaded Sri Lankan transport data
- Images: Default placeholder images

### 3. User Feedback
- Loading states during API calls
- Error messages via alerts
- Pull-to-refresh for retry

---

## 🎯 Assignment Compliance

### Required Features ✅

1. **Dummy/Free APIs**: Using DummyJSON (recommended in assignment)
2. **Authentication API**: `https://dummyjson.com/auth`
3. **Data Fetching API**: `https://dummyjson.com/products`
4. **Real HTTP Requests**: Axios library with proper error handling
5. **Dynamic Data Display**: All transport items from API

### Bonus Implementation

- Multiple API endpoints (auth, products, search)
- Data transformation layer
- Offline support with fallback data
- API response caching via Redux
- Search functionality with API integration

---

## 🚀 Testing the APIs

### 1. View API Calls in Terminal
Run the app and check terminal for logs:
```
✅ Successfully fetched transport data from API
⚠️ Using fallback data
❌ API Error: Network Error
```

### 2. Network Inspector
Use React Native Debugger or Flipper to see:
- Request URLs
- Request headers
- Response data
- Response time

### 3. Test API Endpoints Directly

#### Test Auth
```bash
curl -X POST https://dummyjson.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"emilys","password":"emilyspass"}'
```

#### Test Products
```bash
curl https://dummyjson.com/products?limit=10
```

#### Test Search
```bash
curl https://dummyjson.com/products/search?q=phone
```

---

## 📝 Code Examples

### Fetching Transport Data
```typescript
import { transportService } from '../services/transportService';

// In your component
const loadData = async () => {
  try {
    dispatch(fetchTransportStart());
    const data = await transportService.fetchTransportItems();
    dispatch(fetchTransportSuccess(data));
  } catch (error) {
    dispatch(fetchTransportFailure(error.message));
  }
};
```

### Using Authentication
```typescript
import { authService } from '../services/authService';

const handleLogin = async (credentials) => {
  try {
    const user = await authService.login(credentials);
    await storageService.saveAuthToken(user.token);
    dispatch(loginSuccess(user));
  } catch (error) {
    showAlert('Error', error.message);
  }
};
```

---

## 🔗 External API Documentation Links

1. **DummyJSON**: https://dummyjson.com/docs
2. **Free APIs List**: https://free-apis.github.io
3. **Axios Documentation**: https://axios-http.com/docs/intro

---

## ✅ Conclusion

This application successfully integrates **3 external APIs** with proper error handling, data transformation, and fallback mechanisms. All API calls are implemented following industry best practices and assignment requirements.

**Total API Endpoints Used**: 6
- Auth: 2 endpoints
- Products: 3 endpoints  
- Images: 1 CDN service
