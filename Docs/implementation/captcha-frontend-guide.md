# CAPTCHA Frontend Integration Guide

This document explains how to use the reCAPTCHA site key in the frontend application.

## Site Key vs. Secret Key

When setting up reCAPTCHA, you receive two keys:

1. **Site Key**: Used in the frontend (client-side) to render the reCAPTCHA widget
2. **Secret Key**: Used in the backend (server-side) to verify the CAPTCHA token

## Using the Site Key in the Frontend

The site key (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`) needs to be integrated into your frontend application. Here's how to do it:

### 1. Add the reCAPTCHA Script to Your HTML

Add the following script tag to your HTML file, typically in the `<head>` section:

```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

### 2. Add the reCAPTCHA Widget to Your Form

For reCAPTCHA v2 (Checkbox):

```html
<form action="submit-form" method="POST">
  <!-- Your form fields -->
  
  <!-- reCAPTCHA widget -->
  <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
  
  <button type="submit">Submit</button>
</form>
```

For reCAPTCHA v3 (Invisible):

```html
<script src="https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></script>
<script>
  function onSubmit(event) {
    event.preventDefault();
    grecaptcha.ready(function() {
      grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', {action: 'register'})
        .then(function(token) {
          // Add the token to your form
          document.getElementById('captchaToken').value = token;
          // Submit the form
          document.getElementById('registration-form').submit();
        });
    });
  }
</script>

<form id="registration-form" action="submit-form" method="POST" onsubmit="onSubmit(event)">
  <!-- Your form fields -->
  
  <!-- Hidden field for the CAPTCHA token -->
  <input type="hidden" id="captchaToken" name="captchaToken">
  
  <button type="submit">Submit</button>
</form>
```

### 3. Send the CAPTCHA Token to the Backend

When the form is submitted, the CAPTCHA token needs to be sent to the backend along with the form data. The backend will then verify the token using the secret key.

For a React application, you might do something like this:

```jsx
import React, { useState, useEffect } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    // Your form fields
  });
  const [captchaToken, setCaptchaToken] = useState('');

  useEffect(() => {
    // Load the reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the CAPTCHA token
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'register' })
        .then(async (token) => {
          // Send the form data and CAPTCHA token to the backend
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              organization: formData.organization,
              user: formData.user,
              captchaToken: token,
            }),
          });

          const data = await response.json();
          // Handle the response
        });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
```

## Environment Variables in the Frontend

In a production environment, you should store the site key in an environment variable:

```
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key_here
```

Then use it in your code:

```jsx
window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, { action: 'register' })
```

## Testing with the Test Site Key

The test site key (`6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`) will always pass verification when used with the test secret key on the backend. This allows you to test the entire registration flow without having to solve CAPTCHA challenges.