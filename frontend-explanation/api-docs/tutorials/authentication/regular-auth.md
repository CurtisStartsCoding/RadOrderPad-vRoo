# Regular Authentication

This guide covers the standard authentication process for RadOrderPad API.

## Prerequisites

- You must have a registered user account
- Your organization must be active
- You must know your username and password

## Authentication Flow

The authentication flow consists of these steps:

1. Submit login credentials
2. Receive JWT token
3. Use token for authenticated requests
4. Refresh token when needed

## Step 1: Submit Login Credentials

Submit your username and password to the authentication endpoint:

```javascript
const login = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to authenticate:', error);
    throw error;
  }
};
```

The response will include:
- `token`: The JWT token for authentication
- `refreshToken`: The refresh token for obtaining a new JWT token
- `expiresIn`: The token expiration time in seconds
- `user`: User information including roles and permissions

## Step 2: Store Authentication Tokens

Store the tokens securely for future use:

```javascript
const storeAuthTokens = (authData) => {
  // Store in secure HTTP-only cookies (preferred)
  // Or use localStorage with caution
  localStorage.setItem('token', authData.token);
  localStorage.setItem('refreshToken', authData.refreshToken);
  localStorage.setItem('tokenExpiry', Date.now() + (authData.expiresIn * 1000));
  
  // Store user info
  localStorage.setItem('user', JSON.stringify(authData.user));
};
```

## Step 3: Use Token for Authenticated Requests

Include the token in the Authorization header for all authenticated requests:

```javascript
const makeAuthenticatedRequest = async (url, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const options = {
    method,
    headers
  };
  
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    
    // Handle 401 Unauthorized (token expired)
    if (response.status === 401) {
      // Attempt to refresh token
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // Retry the request with new token
        return makeAuthenticatedRequest(url, method, body);
      } else {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};
```

## Step 4: Refresh Token When Needed

Implement token refresh functionality:

```javascript
const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken
      })
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    
    // Update stored tokens
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('tokenExpiry', Date.now() + (data.data.expiresIn * 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};
```

## Step 5: Implement Auto-Refresh

Implement automatic token refresh before expiration:

```javascript
const setupTokenRefresh = () => {
  const checkTokenExpiry = () => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!tokenExpiry) {
      return;
    }
    
    const expiryTime = parseInt(tokenExpiry);
    const currentTime = Date.now();
    
    // Refresh token 5 minutes before expiry
    if (expiryTime - currentTime < 300000) {
      refreshAuthToken();
    }
  };
  
  // Check token expiry every minute
  setInterval(checkTokenExpiry, 60000);
};
```

## Step 6: Implement Logout

Implement logout functionality:

```javascript
const logout = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Notify server about logout (optional)
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout notification failed:', error);
    }
  }
  
  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = '/login';
};
```

## Error Handling

When working with authentication endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid credentials format
- 401 Unauthorized: Invalid username or password
- 403 Forbidden: Account disabled or organization inactive
- 429 Too Many Requests: Too many failed login attempts

## Best Practices

1. Always use HTTPS for all API requests
2. Store tokens in HTTP-only cookies when possible
3. Implement automatic token refresh
4. Clear tokens on logout
5. Use a loading state during authentication
6. Implement proper error handling and user feedback
7. Consider implementing multi-factor authentication for sensitive operations
8. Set reasonable token expiration times (typically 15-60 minutes)
9. Implement rate limiting for failed login attempts