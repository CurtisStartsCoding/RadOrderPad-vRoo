/**
 * Test script for the order finalization endpoint
 * 
 * This script tests the POST /api/orders endpoint for creating and finalizing orders
 * after validation and signature.
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN = process.env.PHYSICIAN_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('Error: PHYSICIAN_AUTH_TOKEN environment variable is required');
  process.exit(1);
}

// Test data
const testPayload = {
  patientInfo: {
    // For testing with a new patient
    firstName: 'Test',
    lastName: 'Patient',
    dateOfBirth: '1980-01-01',
    gender: 'male',
    mrn: 'TEST-MRN-123'
    
    // For testing with an existing patient, uncomment and use a valid patient ID
    // id: 123
  },
  dictationText: 'Patient presents with lower back pain radiating to the left leg. History of disc herniation. Request MRI of lumbar spine.',
  finalValidationResult: {
    validationStatus: 'appropriate',
    complianceScore: 0.92,
    feedback: 'This request for an MRI of the lumbar spine is appropriate based on the clinical indication of lower back pain with radiation to the left leg and history of disc herniation.',
    suggestedICD10Codes: [
      {
        code: 'M54.5',
        description: 'Low back pain',
        isPrimary: true
      },
      {
        code: 'M51.16',
        description: 'Intervertebral disc disorders with radiculopathy, lumbar region',
        isPrimary: false
      }
    ],
    suggestedCPTCodes: [
      {
        code: '72148',
        description: 'MRI lumbar spine without contrast',
        isPrimary: true
      }
    ],
    internalReasoning: 'Patient has symptoms consistent with disc herniation requiring imaging.'
  },
  isOverride: false,
  signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
  signerFullName: 'Dr. Test Physician',
  radiologyOrganizationId: 456 // Optional
};

/**
 * Run the test
 */
async function runTest() {
  try {
    console.log('Testing POST /api/orders endpoint...');
    
    const response = await axios.post(`${API_URL}/orders`, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201 && response.data.success && response.data.orderId) {
      console.log('\n✅ Test passed! Order created successfully with ID:', response.data.orderId);
    } else {
      console.log('\n❌ Test failed! Unexpected response.');
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
runTest();