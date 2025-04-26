# Trial Authentication

This guide covers the authentication process for trial users of the RadOrderPad API.

## Prerequisites

- You must have received a trial invitation
- You must have completed the trial registration process
- You must know your trial credentials

## Trial Authentication Flow

The trial authentication flow consists of these steps:

1. Register using trial invitation
2. Submit trial login credentials
3. Receive limited-scope JWT token
4. Use token for authenticated requests within trial limitations

## Step 1: Register Using Trial Invitation

When you receive a trial invitation, you'll need to complete the registration process:

```javascript
const registerTrialUser = async (invitationToken, userData) => {
  try {
    const response = await fetch('/api/auth/trial/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invitationToken,
        ...userData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to register trial user:', error);
    throw error;
  }
};
```

Required user data includes:
- `email`: Your email address
- `password`: Your chosen password
- `firstName`: Your first name
- `lastName`: Your last name
- `specialty`: Your medical specialty

## Step 2: Submit Trial Login Credentials

After registration, you can log in using your credentials:

```javascript
const trialLogin = async (email, password) => {
  try {
    const response = await fetch('/api/auth/trial/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to authenticate trial user:', error);
    throw error;
  }
};
```

The response will include:
- `token`: The JWT token for authentication
- `refreshToken`: The refresh token for obtaining a new JWT token
- `expiresIn`: The token expiration time in seconds
- `user`: User information including trial-specific permissions
- `trialInfo`: Information about the trial period and limitations

## Step 3: Store Trial Authentication Tokens

Store the tokens securely for future use:

```javascript
const storeTrialAuthTokens = (authData) => {
  // Store in secure HTTP-only cookies (preferred)
  // Or use localStorage with caution
  localStorage.setItem('token', authData.token);
  localStorage.setItem('refreshToken', authData.refreshToken);
  localStorage.setItem('tokenExpiry', Date.now() + (authData.expiresIn * 1000));
  
  // Store user and trial info
  localStorage.setItem('user', JSON.stringify(authData.user));
  localStorage.setItem('trialInfo', JSON.stringify(authData.trialInfo));
};
```

## Step 4: Use Token for Authenticated Requests

Include the token in the Authorization header for all authenticated requests:

```javascript
const makeTrialAuthenticatedRequest = async (url, method = 'GET', body = null) => {
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
      const refreshed = await refreshTrialAuthToken();
      if (refreshed) {
        // Retry the request with new token
        return makeTrialAuthenticatedRequest(url, method, body);
      } else {
        // Redirect to login if refresh fails
        window.location.href = '/trial/login';
        throw new Error('Authentication failed');
      }
    }
    
    // Handle 403 Forbidden (trial limitation)
    if (response.status === 403) {
      const errorData = await response.json();
      if (errorData.error === 'trial_limit_exceeded') {
        // Handle trial limitation
        showTrialLimitExceededMessage(errorData.message);
        throw new Error('Trial limit exceeded');
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

## Step 5: Refresh Trial Token When Needed

Implement token refresh functionality:

```javascript
const refreshTrialAuthToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch('/api/auth/trial/refresh', {
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
    
    // Update trial info if provided
    if (data.data.trialInfo) {
      localStorage.setItem('trialInfo', JSON.stringify(data.data.trialInfo));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to refresh trial token:', error);
    return false;
  }
};
```

## Step 6: Check Trial Status and Limitations

Implement trial status checking:

```javascript
const checkTrialStatus = () => {
  const trialInfoStr = localStorage.getItem('trialInfo');
  
  if (!trialInfoStr) {
    return null;
  }
  
  try {
    const trialInfo = JSON.parse(trialInfoStr);
    
    // Calculate remaining days
    const endDate = new Date(trialInfo.endDate);
    const currentDate = new Date();
    const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
    
    // Check if trial has expired
    if (remainingDays <= 0) {
      return {
        active: false,
        remainingDays: 0,
        usageCount: trialInfo.usageCount,
        usageLimit: trialInfo.usageLimit,
        message: 'Your trial period has expired'
      };
    }
    
    // Check if usage limit is reached
    if (trialInfo.usageCount >= trialInfo.usageLimit) {
      return {
        active: false,
        remainingDays,
        usageCount: trialInfo.usageCount,
        usageLimit: trialInfo.usageLimit,
        message: 'You have reached your trial usage limit'
      };
    }
    
    // Trial is active
    return {
      active: true,
      remainingDays,
      usageCount: trialInfo.usageCount,
      usageLimit: trialInfo.usageLimit,
      message: `Your trial is active with ${remainingDays} days remaining`
    };
  } catch (error) {
    console.error('Failed to parse trial info:', error);
    return null;
  }
};
```

## Step 7: Display Trial Information

Display trial information to the user:

```javascript
const displayTrialInfo = () => {
  const trialStatus = checkTrialStatus();
  
  if (!trialStatus) {
    return;
  }
  
  const trialInfoElement = document.getElementById('trial-info');
  
  if (!trialInfoElement) {
    return;
  }
  
  if (!trialStatus.active) {
    trialInfoElement.innerHTML = `
      <div class="trial-expired">
        <h3>Trial Status: Expired</h3>
        <p>${trialStatus.message}</p>
        <button onclick="upgradeToPaidPlan()">Upgrade to Paid Plan</button>
      </div>
    `;
  } else {
    trialInfoElement.innerHTML = `
      <div class="trial-active">
        <h3>Trial Status: Active</h3>
        <p>${trialStatus.message}</p>
        <p>Usage: ${trialStatus.usageCount} / ${trialStatus.usageLimit}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${(trialStatus.usageCount / trialStatus.usageLimit) * 100}%"></div>
        </div>
        <button onclick="upgradeToPaidPlan()">Upgrade to Paid Plan</button>
      </div>
    `;
  }
};
```

## Trial Limitations

Trial accounts have the following limitations:

1. Limited number of validation requests (typically 10-20)
2. Limited trial period (typically 14-30 days)
3. No access to administrative features
4. No ability to connect with other organizations
5. Limited to sandbox environment (no production data)
6. Watermarked outputs

## Converting to a Full Account

To convert a trial account to a full account:

```javascript
const upgradeToPaidPlan = async () => {
  try {
    const response = await fetch('/api/auth/trial/upgrade', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Redirect to payment page
    window.location.href = data.data.paymentUrl;
  } catch (error) {
    console.error('Failed to initiate upgrade:', error);
    throw error;
  }
};
```

## Error Handling

When working with trial authentication endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid credentials format
- 401 Unauthorized: Invalid username or password
- 403 Forbidden: Trial expired or usage limit reached
- 404 Not Found: Invalid trial invitation
- 409 Conflict: Email already registered

## Best Practices

1. Always check trial status before making requests
2. Display clear trial limitations to users
3. Provide easy upgrade paths
4. Handle trial expiration gracefully
5. Store trial usage information locally for a better user experience
6. Implement proper error handling with user-friendly messages
7. Consider implementing a countdown or usage meter