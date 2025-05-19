const axios = require('axios');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { queryMainDb } = require('../dist/config/db-utils');

// Mock data
const testTrialUser = {
  email: 'trial-test@example.com',
  password: 'password123',
  firstName: 'Trial',
  lastName: 'User',
  specialty: 'Cardiology'
};

// Base URL for API requests
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

describe('Physician Trial Sandbox Feature', () => {
  // Clean up test data before tests
  before(async () => {
    try {
      // Delete test user if it exists
      await queryMainDb('DELETE FROM trial_users WHERE email = $1', [testTrialUser.email]);
      console.log('Test environment prepared');
    } catch (error) {
      console.error('Error preparing test environment:', error);
    }
  });

  // Clean up test data after tests
  after(async () => {
    try {
      // Delete test user
      await queryMainDb('DELETE FROM trial_users WHERE email = $1', [testTrialUser.email]);
      console.log('Test environment cleaned up');
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  });

  describe('Trial User Registration', () => {
    it('should register a new trial user', async () => {
      const response = await axios.post(`${API_URL}/api/auth/trial/register`, testTrialUser);
      
      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('success', true);
      expect(response.data).to.have.property('message', 'Trial account created.');
      expect(response.data).to.have.property('token');
      
      // Check for trialInfo property
      expect(response.data).to.have.property('trialInfo');
      expect(response.data.trialInfo).to.have.property('validationsUsed', 0);
      expect(response.data.trialInfo).to.have.property('maxValidations', 100);
      expect(response.data.trialInfo).to.have.property('validationsRemaining', 100);
      
      // Verify user was created in database
      const result = await queryMainDb('SELECT * FROM trial_users WHERE email = $1', [testTrialUser.email]);
      expect(result.rows.length).to.equal(1);
      expect(result.rows[0].email).to.equal(testTrialUser.email);
      expect(result.rows[0].first_name).to.equal(testTrialUser.firstName);
      expect(result.rows[0].last_name).to.equal(testTrialUser.lastName);
      expect(result.rows[0].specialty).to.equal(testTrialUser.specialty);
      expect(result.rows[0].validation_count).to.equal(0);
      expect(result.rows[0].max_validations).to.equal(100);
      
      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(testTrialUser.password, result.rows[0].password_hash);
      expect(isPasswordValid).to.be.true;
    });
    
    it('should reject registration with duplicate email', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/register`, testTrialUser);
        // Should not reach here
        expect.fail('Should have thrown an error for duplicate email');
      } catch (error) {
        expect(error.response.status).to.equal(409);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('already registered');
      }
    });
    
    it('should reject registration with invalid email', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/register`, {
          ...testTrialUser,
          email: 'invalid-email'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for invalid email');
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Invalid email');
      }
    });
    
    it('should reject registration with short password', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/register`, {
          ...testTrialUser,
          email: 'another-trial@example.com',
          password: '123'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for short password');
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Password must be at least 8 characters');
      }
    });
  });
  
  describe('Trial User Login', () => {
    it('should login a trial user with valid credentials', async () => {
      const response = await axios.post(`${API_URL}/api/auth/trial/login`, {
        email: testTrialUser.email,
        password: testTrialUser.password
      });
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(response.data).to.have.property('token');
      
      // Check for trialInfo property
      expect(response.data).to.have.property('trialInfo');
      expect(response.data.trialInfo).to.have.property('validationsUsed');
      expect(response.data.trialInfo).to.have.property('maxValidations');
      expect(response.data.trialInfo).to.have.property('validationsRemaining');
      
      // Verify validationsRemaining calculation
      const { validationsUsed, maxValidations, validationsRemaining } = response.data.trialInfo;
      expect(validationsRemaining).to.equal(Math.max(0, maxValidations - validationsUsed));
      
      // Verify token structure
      const token = response.data.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
      expect(decoded).to.have.property('isTrial', true);
      expect(decoded).to.have.property('email', testTrialUser.email);
      expect(decoded).to.have.property('specialty', testTrialUser.specialty);
      expect(decoded).to.have.property('role', 'trial_physician');
    });
    
    it('should reject login with invalid credentials', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/login`, {
          email: testTrialUser.email,
          password: 'wrongpassword'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for invalid credentials');
      } catch (error) {
        expect(error.response.status).to.equal(401);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Invalid email or password');
      }
    });
    
    it('should reject login for non-existent user', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/login`, {
          email: 'nonexistent@example.com',
          password: 'password123'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for non-existent user');
      } catch (error) {
        expect(error.response.status).to.equal(401);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Invalid email or password');
      }
    });
  });
  
  describe('Trial Password Update', () => {
    it('should update a trial user password with valid credentials', async () => {
      const newPassword = 'newPassword456';
      
      // Update password
      const response = await axios.post(`${API_URL}/api/auth/trial/update-password`, {
        email: testTrialUser.email,
        newPassword: newPassword
      });
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(response.data).to.have.property('message', 'Trial user password updated successfully.');
      
      // Verify password was updated in database
      const result = await queryMainDb('SELECT password_hash FROM trial_users WHERE email = $1', [testTrialUser.email]);
      expect(result.rows.length).to.equal(1);
      
      // Verify new password works
      const isNewPasswordValid = await bcrypt.compare(newPassword, result.rows[0].password_hash);
      expect(isNewPasswordValid).to.be.true;
      
      // Verify old password no longer works
      const isOldPasswordValid = await bcrypt.compare(testTrialUser.password, result.rows[0].password_hash);
      expect(isOldPasswordValid).to.be.false;
      
      // Update test user object to use new password for subsequent tests
      testTrialUser.password = newPassword;
    });
    
    it('should reject password update with missing email', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/update-password`, {
          newPassword: 'somePassword789'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for missing email');
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Email and new password are required');
      }
    });
    
    it('should reject password update with missing new password', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/update-password`, {
          email: testTrialUser.email
        });
        // Should not reach here
        expect.fail('Should have thrown an error for missing new password');
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Email and new password are required');
      }
    });
    
    it('should reject password update with short password', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/update-password`, {
          email: testTrialUser.email,
          newPassword: '123'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for short password');
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Password must be at least 8 characters');
      }
    });
    
    it('should reject password update for non-existent user', async () => {
      try {
        await axios.post(`${API_URL}/api/auth/trial/update-password`, {
          email: 'nonexistent@example.com',
          newPassword: 'validPassword123'
        });
        // Should not reach here
        expect.fail('Should have thrown an error for non-existent user');
      } catch (error) {
        expect(error.response.status).to.equal(404);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Trial account with this email not found');
      }
    });
  });
  
  describe('Trial Validation', () => {
    let trialToken;
    
    before(async () => {
      // Login to get a trial token
      const response = await axios.post(`${API_URL}/api/auth/trial/login`, {
        email: testTrialUser.email,
        password: testTrialUser.password
      });
      trialToken = response.data.token;
    });
    
    it('should validate dictation for trial user', async () => {
      const response = await axios.post(
        `${API_URL}/api/orders/validate/trial`,
        {
          dictationText: 'Patient with chest pain, shortness of breath. History of hypertension. Please evaluate for possible coronary artery disease.'
        },
        {
          headers: { Authorization: `Bearer ${trialToken}` }
        }
      );
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(response.data).to.have.property('validationResult');
      expect(response.data.validationResult).to.have.property('validationStatus');
      expect(response.data.validationResult).to.have.property('complianceScore');
      expect(response.data.validationResult).to.have.property('feedback');
      
      // Check for trialInfo property
      expect(response.data).to.have.property('trialInfo');
      expect(response.data.trialInfo).to.have.property('validationsUsed', 1); // Should be incremented to 1
      expect(response.data.trialInfo).to.have.property('maxValidations');
      expect(response.data.trialInfo).to.have.property('validationsRemaining');
      
      // Verify validationsRemaining calculation
      const { validationsUsed, maxValidations, validationsRemaining } = response.data.trialInfo;
      expect(validationsRemaining).to.equal(Math.max(0, maxValidations - validationsUsed));
      
      // Verify validation count was incremented
      const result = await queryMainDb('SELECT validation_count FROM trial_users WHERE email = $1', [testTrialUser.email]);
      expect(result.rows[0].validation_count).to.equal(1);
    });
    
    it('should reject validation for non-trial user', async () => {
      // Create a fake regular user token
      const regularToken = jwt.sign(
        { userId: 999, orgId: 1, role: 'physician', email: 'regular@example.com', isTrial: false },
        process.env.JWT_SECRET || 'default_jwt_secret'
      );
      
      try {
        await axios.post(
          `${API_URL}/api/orders/validate/trial`,
          {
            dictationText: 'Patient with chest pain, shortness of breath.'
          },
          {
            headers: { Authorization: `Bearer ${regularToken}` }
          }
        );
        // Should not reach here
        expect.fail('Should have thrown an error for non-trial user');
      } catch (error) {
        expect(error.response.status).to.equal(403);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Trial account required');
      }
    });
    
    it('should enforce validation limit', async () => {
      // Set validation count to max
      await queryMainDb(
        'UPDATE trial_users SET validation_count = max_validations WHERE email = $1',
        [testTrialUser.email]
      );
      
      try {
        await axios.post(
          `${API_URL}/api/orders/validate/trial`,
          {
            dictationText: 'Patient with chest pain, shortness of breath.'
          },
          {
            headers: { Authorization: `Bearer ${trialToken}` }
          }
        );
        // Should not reach here
        expect.fail('Should have thrown an error for validation limit');
      } catch (error) {
        expect(error.response.status).to.equal(403);
        expect(error.response.data).to.have.property('success', false);
        expect(error.response.data.message).to.include('Validation limit reached');
        
        // Check for trialInfo property in error response
        expect(error.response.data).to.have.property('trialInfo');
        expect(error.response.data.trialInfo).to.have.property('validationsUsed');
        expect(error.response.data.trialInfo).to.have.property('maxValidations');
        expect(error.response.data.trialInfo).to.have.property('validationsRemaining', 0); // Should be 0 when limit reached
      }
    });
  });
});