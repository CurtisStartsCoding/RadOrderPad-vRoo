Okay, here is the combined Markdown file containing the modified component code, helper file content, and a Readme section explaining how to use it.

```markdown
# Radiology Order Interface - Combined Code Package

This file contains the source code for the React components and essential configuration/helper files required to replicate the described radiology order dictation, validation, and signature workflow.

## Structure

The code for each file is enclosed within delimiters:

```
--- START OF FILE path/to/FileName.extension ---
[Code for the file]
--- END OF FILE path/to/FileName.extension ---
```

## Prerequisites

To use this code and achieve the intended appearance and functionality, you need the following set up in your project:

1.  **Project Environment:** A standard React project environment, likely built with Next.js (due to the `@/` alias usage).
2.  **Node.js & Package Manager:** Node.js and npm/yarn installed.
3.  **Required Libraries:** Install the necessary libraries via npm/yarn:
    ```bash
    npm install react react-dom @tanstack/react-query lucide-react wouter class-variance-authority clsx tailwind-merge tailwindcss-animate @radix-ui/react-icons @tailwindcss/typography
    # or
    yarn add react react-dom @tanstack/react-query lucide-react wouter class-variance-authority clsx tailwind-merge tailwindcss-animate @radix-ui/react-icons @tailwindcss/typography
    ```
4.  **Tailwind CSS:** Tailwind CSS must be installed and configured in your project. Use the content provided in the `tailwind.config.js` section below for your project's configuration file.
5.  **Global CSS:** Apply the styles provided in the `globals.css` section below to your project's main global CSS file.
6.  **Shadcn/ui Components:** This project heavily relies on Shadcn/ui. You **must** generate the required components into your project using the Shadcn/ui CLI. Run the following commands (adjust based on your setup):
    ```bash
    npx shadcn-ui@latest init
    npx shadcn-ui@latest add button card input label badge select toast textarea separator tabs dialog
    ```
7.  **Helper Files:** Place the code provided for `types.ts`, `utils.ts`, `useAuth.tsx`, `use-toast.ts`, and `queryClient.ts` into the corresponding file paths within your project structure (e.g., `src/lib/types.ts`, `src/hooks/useAuth.tsx`, etc.).
8.  **Backend API:** A functioning backend API is required that matches the endpoints and data structures used/expected by the components (especially `/api/orders`, `/api/orders/validate`, `/api/auth/*`, `/api/patients/*`) and includes the necessary database schema updates for `overridden` and `override_justification` fields in the orders table.
9.  **Web Speech API:** Voice input features rely on the browser's native Web Speech API, which is primarily supported in Chrome, Safari, and Edge.

## File Contents

--- START OF FILE tailwind.config.js ---

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  // Adjust the content path based on your project structure
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Example path, update if needed
  theme: {
    extend: {
      // Shadcn/ui variables - ensure these match your CSS variable definitions
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Example chart colors (if used, ensure CSS variables are defined)
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
         // Example sidebar colors (if used, ensure CSS variables are defined)
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

--- END OF FILE tailwind.config.js ---

--- START OF FILE src/app/globals.css ---

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Define your CSS variables for colors used in tailwind.config.js */
    /* Example using blue - REPLACE WITH YOUR ACTUAL COLORS */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem; /* Example border radius */
  }

  .dark {
    /* Define dark mode colors if needed */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark mode variables ... */
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Global scrolling fix */
html, body {
  /* Consider if !important is truly needed, might override intended behavior */
  /* overflow-y: auto !important; */
  height: 100%;
}

/* Ensure root element allows scrolling if content overflows */
#root, body, html {
   min-height: 100vh;
}

/* Consider removing this if not necessary, might force scrollbars */
/* .overflow-scroll-fix {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
} */

/* Style for signature pad */
.signature-pad {
  touch-action: none; /* Prevent default touch actions like scrolling */
  cursor: crosshair;
  border: 1px dashed hsl(var(--border)); /* Example border */
  background-color: hsl(var(--muted) / 0.5); /* Slightly different background */
}


--- END OF FILE src/app/globals.css ---

--- START OF FILE src/lib/types.ts ---

// Custom types for the application

// Patient types
export interface Patient {
  id: number;
  name: string;
  dob: string; // Should ideally be Date or ISO string, handle parsing carefully
  mrn?: string;
  pidn?: string;  // Patient Identification Number
  radiologyGroupId: number | null;
  referringPracticeId: number | null;
  externalPatientId: string | null;
  demographics?: string; // Consider a structured object if possible
  encryptedData: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  gender: string; // Consider specific values: 'male', 'female', 'other', 'unknown'
}

// Medical code interfaces
export interface MedicalCode {
  code: string;
  description: string;
}

// Processed dictation result - Ensure alignment with backend response
export interface ProcessedDictation {
  validationStatus: 'valid' | 'invalid' | 'warning' | string; // Allow string for flexibility if backend sends other statuses
  feedback: string; // Feedback should always be present
  complianceScore?: number; // e.g., 0-9
  clinicalInformation?: string; // Extracted clinical info
  diagnosisCodes?: MedicalCode[];
  procedureCodes?: MedicalCode[];
  // Flags indicating override status
  overridden?: boolean; // True if an override was applied
  overrideJustification?: string; // The justification text provided by the user
  // Other potential fields from validation
  patientContext?: any;
  cptCode?: string; // Consider removing if covered by procedureCodes
  icd10Code?: string; // Consider removing if covered by diagnosisCodes
  orderNotes?: string;
  procedureDescription?: string; // Consider removing if covered by procedureCodes
  clinicalHistory?: string;
  confidence?: number;
  modality?: string;
  procedureType?: string;
  priority?: string;
  bodyPart?: string;
  keywords?: string[];
}

// User types
export interface User {
  id: number;
  email: string;
  name: string; // Consider splitting into firstName, lastName
  firstName?: string; // Added for consistency
  lastName?: string; // Added for consistency
  role: 'admin' | 'physician' | 'medical_assistant' | 'scheduler' | 'radiologist' | string; // Allow string for flexibility
  organizationId: number | null;
  lastLoginAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  photoUrl?: string;
  isDeveloperMode?: boolean;
}

// Organization types
export interface Organization {
  id: number;
  name: string;
  type: 'referringPractice' | 'radiologyGroup' | 'healthSystem' | string; // Allow string for flexibility
  address?: string;
  phone?: string;
  email?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Order types - Align closely with database schema and API response
export interface Order {
  id: number;
  orderNumber: string;
  patientId: number;
  patientPidn?: string;
  // Fields expected by the backend API /api/orders endpoint
  referringOrganizationId?: number;
  radiologyOrganizationId?: number; // Target radiology group
  createdByUserId?: number;
  updatedByUserId?: number;
  signedByUserId?: number; // Set after signing
  status: 'draft' | 'submitted' | 'approved' | 'completed' | 'cancelled' | 'pending_patient_info' | 'complete' | 'scheduled' | 'performed' | 'delivered' | 'rejected' | string;
  priority: 'routine' | 'urgent' | 'stat' | 'expedited' | string;
  originalDictation?: string; // The full dictation text
  clinicalIndication?: string; // Potentially extracted/validated indication
  validationStatus?: string; // Status from validation ('valid', 'invalid', etc.)
  complianceScore?: number;
  overridden?: boolean; // From validation result
  overrideJustification?: string; // From validation result
  modality?: string; // Extracted/validated modality
  bodyPart?: string; // Extracted/validated body part
  cptCode?: string; // Primary CPT code
  cptDescription?: string; // Description for primary CPT
  icd10Codes?: string; // Comma-separated list of ICD codes
  icd10Descriptions?: Record<string, string>; // Object mapping ICD code to description
  // Timestamps
  submittedAt?: Date | string | null;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  signatureDate?: Date | string | null; // Set after signing
  // Other potential fields
  patientMrn?: string; // Often used alongside pidn
  referringPhysicianId?: number; // May be needed
  radiologyGroupId?: number | null; // May be needed
  icd10Code?: string | null; // Legacy single code field?
  orderNotes?: string | null;
  procedureDescription?: string | null; // Legacy field?
  scheduledDate?: Date | string | null;
  isContrastIndicated?: boolean;
  authorizationNumber?: string | null;
  // Relations (populated by backend/join queries for display, not usually for creation)
  patient?: Patient;
  referringPhysician?: User;
  referringOrganization?: Organization;
  // Client-side convenience properties (can be added if needed)
  // patientName?: string;
  // patientDOB?: string;
  // patientGender?: string;
  // referringPhysicianName?: string;
}

// Clinical History Item Type (for ClinicalContextPanel)
export interface ClinicalHistoryItem {
  id: number | string; // Allow string if IDs aren't numbers
  type: 'imaging' | 'diagnosis' | 'lab' | 'medication' | string; // Allow string
  date: string; // Keep as string for display flexibility
  code?: string;
  description: string;
  value?: string;
  reference?: string; // e.g., lab reference range
}


--- END OF FILE src/lib/types.ts ---

--- START OF FILE src/lib/utils.ts ---

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Function provided by Shadcn/ui for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a human-readable format (e.g., "Jan 1, 2024, 3:45 PM")
 * @param date Date object, ISO string, or timestamp number.
 * @param includeTime Whether to include the time part. Defaults to true.
 * @returns Formatted date string, or "Not specified" / "Invalid date".
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  includeTime = true
): string {
  if (date === null || typeof date === 'undefined') return "Not specified";

  let dateObj: Date;
  try {
    dateObj = date instanceof Date ? date : new Date(date);
    // Check if the date is valid after conversion
    if (isNaN(dateObj.getTime())) {
      // Handle potential non-standard date strings if necessary
      // For example, try parsing "MM/DD/YYYY" if needed, but prefer ISO 8601
      return "Invalid date";
    }
  } catch (e) {
    return "Invalid date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", // "2024"
    month: "short",  // "Jan"
    day: "numeric",   // "1"
  };

  if (includeTime) {
    options.hour = "numeric"; // "3"
    options.minute = "2-digit"; // "45"
    options.hour12 = true; // Use AM/PM
  }

  try {
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
  } catch (e) {
    // Fallback or error handling if formatting fails
    return "Formatting error";
  }
}

/**
 * Calculate age in years from a date of birth.
 * @param dob Date object or a string parseable by new Date().
 * @returns Age in years, or null if DOB is invalid/missing.
 */
export function calculateAge(dob: Date | string | null | undefined): number | null {
  if (!dob) return null;

  let dobDate: Date;
  try {
    dobDate = dob instanceof Date ? dob : new Date(dob);
    if (isNaN(dobDate.getTime())) {
      // Attempt to parse common non-ISO formats if needed, e.g., MM/DD/YYYY
      // Be cautious with this, as Date parsing is inconsistent across browsers
      // Example basic MM/DD/YYYY parse (use a library like date-fns for robustness):
      if (typeof dob === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
         const parts = dob.split('/');
         // Note: Month is 0-indexed in Date constructor (0 = Jan)
         dobDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
         if (isNaN(dobDate.getTime())) return null; // Still invalid after attempt
      } else {
          return null; // Could not parse
      }
    }
  } catch (e) {
    return null;
  }

  // Ensure DOB is not in the future
  const today = new Date();
  if (dobDate > today) return null;

  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  // Return age, ensuring it's not negative (though future date check should prevent this)
  return Math.max(0, age);
}


--- END OF FILE src/lib/utils.ts ---

--- START OF FILE src/lib/queryClient.ts ---

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Custom error handling for API responses.
 * Attempts to parse JSON error messages, falls back to text.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;
    try {
      // Try to parse the error as JSON first
      const errorData = await res.json();
      // Use a specific error field or stringify the whole object
      errorMessage = `${res.status}: ${errorData.error || errorData.message || JSON.stringify(errorData)}`;
    } catch (e) {
      // If JSON parsing fails, fall back to text
      try {
        const text = await res.text();
        errorMessage = `${res.status}: ${text || res.statusText}`;
      } catch (textError) {
         errorMessage = `${res.status}: ${res.statusText || 'Failed to get error details'}`;
      }
    }
    console.error("API Response Error:", errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Centralized API request function.
 * Handles method, URL, data serialization, headers (including Auth),
 * and basic response/error handling.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {

  // Prepare headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    // Prevent caching for non-GET requests or specific endpoints if needed
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  // Add Content-Type for requests with data
  if (data !== undefined && data !== null) {
    headers['Content-Type'] = 'application/json';
  }

  // Get auth token from localStorage - Ensure this key is correct
  const accessToken = localStorage.getItem('rad_order_pad_access_token');

  // Add Authorization header if token exists and it's not a login request
  if (accessToken && !url.includes('/api/auth/login')) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else if (!url.includes('/api/auth/login')) {
    console.warn(`No auth token available for request to ${url}`);
    // Depending on app logic, you might want to redirect to login or throw an error here
  }

  console.log(`API Request: ${method} ${url}`, { hasData: data !== undefined, hasToken: !!accessToken });

  try {
    const res = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: (data !== undefined && data !== null) ? JSON.stringify(data) : undefined,
      // credentials: "include", // Include cookies if needed for session management/CSRF
    });

    console.log(`API Response: ${method} ${url} - Status: ${res.status}`);

    // Check for token refresh header (adjust header name if different)
    const refreshTokenHeader = res.headers.get('X-Refresh-Token');
    if (refreshTokenHeader) {
      console.log('Received X-Refresh-Token header, updating token');
      localStorage.setItem('rad_order_pad_access_token', refreshTokenHeader);
      // Optionally update expiry if backend provides it or use a default duration
      const expiryTime = Date.now() + 15 * 60 * 1000; // Example: 15 minutes
      localStorage.setItem('rad_order_pad_token_expiry', expiryTime.toString());
    }

    // Throw error for non-ok responses (e.g., 4xx, 5xx)
    await throwIfResNotOk(res);

    return res; // Return the raw Response object

  } catch (error) {
    console.error(`API request failed: ${method} ${url}`, error);
    // Re-throw the error to be caught by calling function or React Query
    throw error;
  }
}

/**
 * Type for handling unauthorized responses in queries.
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Default query function for React Query.
 * Uses apiRequest internally and handles JSON parsing.
 * Allows configuring behavior on 401 Unauthorized errors.
 */
export const getQueryFn = <T>(options?: {
  on401?: UnauthorizedBehavior;
}): QueryFunction<T | null> => // Allow null return type for on401: "returnNull"
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const unauthorizedBehavior = options?.on401 ?? "throw"; // Default to throwing

    try {
      const res = await apiRequest('GET', url); // Use apiRequest for consistency

      // Handle 401 based on configuration
      if (res.status === 401 && unauthorizedBehavior === "returnNull") {
        console.warn(`Authentication required for: ${url} - Returning null.`);
        return null;
      }

      // If we didn't return null for 401, let throwIfResNotOk handle it (or other errors)
      // Note: apiRequest already calls throwIfResNotOk, so we might not need it here again
      // unless we want specific handling *before* parsing JSON.
      // await throwIfResNotOk(res); // Potentially redundant if apiRequest handles it

      // Handle 204 No Content specifically - return null or an empty object/array
      if (res.status === 204) {
        return null; // Or appropriate empty value based on expected type T
      }

      // Parse the successful response as JSON
      const data = await res.json();
      return data as T;

    } catch (error) {
      // Handle 401 specifically if it wasn't caught above and we need to throw
      if (error instanceof Error && error.message.startsWith('401:') && unauthorizedBehavior === "throw") {
         console.error(`Authentication error during query: ${url}`, error);
         // Potentially trigger logout or redirect here
      } else {
        console.error(`Query failed: ${url}`, error);
      }
      // Re-throw the error for React Query to handle (e.g., setting query status to 'error')
      throw error;
    }
  };

/**
 * React Query Client instance with default options.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(), // Use the default query function
      refetchOnWindowFocus: true, // Consider disabling if causing too many refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Do not retry on 4xx client errors (like 401, 403, 404)
        if (error instanceof Error && /^(401|403|404):/.test(error.message)) {
          return false;
        }
        // Allow up to 1 retry for other errors
        return failureCount < 1;
      },
      retryDelay: 1000, // Wait 1 second before retry
    },
    mutations: {
       retry: (failureCount, error: any) => {
        // Do not retry mutations on 4xx client errors
        if (error instanceof Error && /^(401|403|404):/.test(error.message)) {
          return false;
        }
        return failureCount < 1; // Allow 1 retry for other errors
      },
      retryDelay: 1000,
    },
  },
});


--- END OF FILE src/lib/queryClient.ts ---

--- START OF FILE src/hooks/useAuth.tsx ---

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient'; // Use the centralized apiRequest
import { User } from '@/lib/types';

// Local storage keys
const ACCESS_TOKEN_KEY = 'rad_order_pad_access_token';
const REFRESH_TOKEN_KEY = 'rad_order_pad_refresh_token'; // If using refresh tokens
const TOKEN_EXPIRY_KEY = 'rad_order_pad_token_expiry'; // If tracking expiry client-side

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean; // True while checking initial session
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  // Add any other auth-related state or functions needed
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.reject(new Error('AuthContext not initialized')),
  logout: () => Promise.reject(new Error('AuthContext not initialized')),
});

interface AuthProviderProps {
  children: ReactNode;
}

// Define the expected shape of the session API response
interface SessionResponse {
  authenticated: boolean;
  user?: User;
}

// Define the expected shape of the login API response
interface LoginResponse {
    success: boolean;
    user?: User;
    accessToken?: string;
    refreshToken?: string; // If used
    expiresIn?: number; // If used
    message?: string; // For error messages
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClientHook = useQueryClient(); // Use hook within the provider
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Tracks initial session load

  // Function to save auth tokens (if used)
  const saveTokens = useCallback((accessToken: string, refreshToken?: string, expiresIn?: number) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
    console.log("Auth tokens saved.");
  }, []);

  // Function to clear auth tokens
  const clearTokens = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    console.log("Auth tokens cleared.");
  }, []);

  // --- Session Management ---
  const { data: sessionData, isLoading: isSessionLoading, error: sessionError } = useQuery<SessionResponse | null>({
    queryKey: ['/api/auth/session'], // Unique key for the session query
    queryFn: async () => {
        // Use apiRequest to fetch session, handle potential 401s gracefully
        try {
            const response = await apiRequest('GET', '/api/auth/session');
            // apiRequest throws on non-ok status, so if we get here, it's likely ok or handled
            return await response.json();
        } catch (error: any) {
             if (error instanceof Error && error.message.startsWith('401:')) {
                 console.warn("Session check returned 401, user is not authenticated.");
                 return { authenticated: false }; // Treat 401 as not authenticated
             }
             // For other errors, let React Query handle it
             console.error("Failed to fetch session:", error);
             throw error; // Re-throw for React Query error state
        }
    },
    enabled: !user, // Only run if we don't have a user state yet
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error: any) => {
        // Don't retry on 401 errors during session check
        if (error instanceof Error && error.message.startsWith('401:')) {
          return false;
        }
        return failureCount < 1; // Retry once for other errors
      },
  });

  // Update user state based on session data
  useEffect(() => {
    // Only update state if the session query is done loading
    if (!isSessionLoading) {
        console.log("Session fetch complete:", sessionData);
        if (sessionData?.authenticated && sessionData.user) {
            setUser(sessionData.user);
            // Ensure token exists if session says authenticated
            if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
                console.warn("Session is authenticated but no token found in storage. Logging out.");
                // This state is inconsistent, might need logout or token refresh
                clearTokens();
                setUser(null);
            }
        } else {
            // If session is not authenticated, ensure user state and tokens are cleared
            if (user !== null) { // Only clear if state is currently logged in
                 console.log("Session not authenticated or user data missing, clearing local state.");
                 setUser(null);
                 clearTokens();
            }
        }
        setIsLoading(false); // Initial loading is complete
    }
  }, [isSessionLoading, sessionData, clearTokens, user]);


  // --- Login ---
  const loginMutation = useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      // apiRequest throws on non-ok, so we parse the JSON directly
      return await response.json();
    },
    onSuccess: (data) => {
      console.log("Login response:", data);
      if (data.success && data.user && data.accessToken) {
        setUser(data.user);
        saveTokens(data.accessToken, data.refreshToken, data.expiresIn);
        // Invalidate session query to reflect new state, but don't need to await
        queryClientHook.invalidateQueries({ queryKey: ['/api/auth/session'] });
        console.log("Login successful, user state updated.");
      } else {
         // Throw an error if login wasn't successful according to the response body
         throw new Error(data.message || 'Login failed: Invalid response data.');
      }
    },
    onError: (error) => {
        console.error("Login mutation error:", error);
        // Clear any potentially stale tokens on login failure
        clearTokens();
        setUser(null);
    }
  });

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      // Clear previous state before attempting login
      setUser(null);
      clearTokens();
      const result = await loginMutation.mutateAsync({ email, password });
      // The onSuccess handler already sets the user state
      if (!result.user) throw new Error("Login failed: No user data returned."); // Should be caught by onSuccess check
      return result.user;
    } catch (error) {
      console.error("Login function error:", error);
      // Ensure state is cleared on error
      setUser(null);
      clearTokens();
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  }, [loginMutation, saveTokens, clearTokens, queryClientHook]);


  // --- Logout ---
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        try {
            // Attempt server-side logout, but don't fail if it errors
            await apiRequest('POST', '/api/auth/logout', refreshToken ? { refreshToken } : undefined);
            console.log("Server logout successful or attempted.");
        } catch (error) {
            console.warn("Server logout failed (this might be ok if token was already invalid):", error);
        } finally {
            // Always clear local state and tokens regardless of server response
            clearTokens();
        }
    },
    onSuccess: () => {
      setUser(null);
      // Clear the entire query cache on logout for a clean state
      queryClientHook.clear();
      console.log("Logout successful, user state and query cache cleared.");
    },
     onError: (error) => {
        console.error("Logout mutation error:", error);
        // Still ensure local state is cleared even if mutation fails
         setUser(null);
         clearTokens();
         queryClientHook.clear();
    }
  });

  const logout = useCallback(async (): Promise<void> => {
     console.log("Initiating logout...");
     await logoutMutation.mutateAsync();
  }, [logoutMutation]);


  // Provide the context value
  const contextValue: AuthContextType = {
    user,
    isLoading, // Represents initial session loading state
    isAuthenticated: !!user, // True if user object is not null
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


--- END OF FILE src/hooks/useAuth.tsx ---

--- START OF FILE src/hooks/use-toast.ts ---

// This file configures the behavior of the toast system.
// It uses a reducer pattern to manage the state of toasts.
// Based on the Shadcn/ui example, likely doesn't need modification
// unless you want to change toast limits or removal delays.

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast" // Adjust path if your ui components are elsewhere

const TOAST_LIMIT = 3 // Allow up to 3 toasts visible at once
const TOAST_REMOVE_DELAY = 5000 // Auto-remove toast after 5 seconds (5000ms)

// Type for the toast object managed by the state
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Action types for the reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

// Generates unique IDs for toasts
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

// Possible actions to dispatch
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast> // Allows updating parts of a toast
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"] // Optional ID to dismiss a specific toast
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"] // Optional ID to remove a specific toast
    }

// Shape of the toast state
interface State {
  toasts: ToasterToast[]
}

// Map to keep track of removal timeouts for each toast
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Schedules a toast for removal after the delay
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    // Clear existing timeout if queueing again (e.g., user dismisses manually)
    clearTimeout(toastTimeouts.get(toastId))
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    // Dispatch action to remove the toast from state
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Reducer function to handle state updates based on actions
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Add a new toast to the beginning of the array, respecting the limit
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    // Update an existing toast by its ID
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    // Mark a toast (or all toasts) as not open and schedule for removal
    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        // If no ID, dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Set open to false to trigger exit animation
              }
            : t
        ),
      }
    }
    // Remove a toast (or all toasts) from the state entirely
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Remove all toasts
        return {
          ...state,
          toasts: [],
        }
      }
      // Remove a specific toast by ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Listeners array to notify components of state changes
const listeners: Array<(state: State) => void> = []

// In-memory state for toasts
let memoryState: State = { toasts: [] }

// Dispatch function to update state and notify listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Type for the toast function parameters (omit id)
type Toast = Omit<ToasterToast, "id">

// Function to create and dispatch a new toast
function toast({ ...props }: Toast) {
  const id = genId()

  // Function to update this specific toast later
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  // Function to dismiss this specific toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Add the new toast to the state
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Toasts start open
      // When the toast's open state changes (e.g., user clicks close), dismiss it
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Schedule the toast for automatic removal
  addToRemoveQueue(id);

  // Return controls for the created toast
  return {
    id: id,
    dismiss,
    update,
  }
}

// Hook for components to access toast state and dispatch function
function useToast() {
  // Get the current state
  const [state, setState] = React.useState<State>(memoryState)

  // Subscribe to state changes on mount, unsubscribe on unmount
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state]) // Dependency array ensures effect runs only if state reference changes

  // Return the current state and the toast/dismiss functions
  return {
    ...state,
    toast, // Function to create new toasts
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }), // Function to dismiss toasts
  }
}

// Export the hook and the standalone toast function
export { useToast, toast }


--- END OF FILE src/hooks/use-toast.ts ---