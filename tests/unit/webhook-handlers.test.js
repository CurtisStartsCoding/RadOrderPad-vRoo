/**
 * Unit Tests for Stripe Webhook Handlers
 * 
 * These tests verify that the webhook handlers correctly process Stripe events
 * and update the database accordingly.
 */

// Add Jest environment configuration
/** @jest-environment node */

// Import dependencies using CommonJS require
const { Pool } = require('pg');
require('dotenv').config();

// Add ESLint disable comments for the specific rules that are causing issues
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

// Import webhook handlers
const {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted
} = require('../../dist/services/billing/stripe/webhooks');

// Mock database client
jest.mock('../../src/config/db', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  };
  
  mockClient.query.mockImplementation(async (query, params) => {
    // Mock different query responses based on the query
    if (query === 'BEGIN' || query === 'COMMIT' || query === 'ROLLBACK') {
      return { rowCount: 0 };
    }
    
    if (query.includes('UPDATE organizations')) {
      return { rowCount: 1, rows: [{ credit_balance: 600 }] };
    }
    
    if (query.includes('SELECT') && query.includes('FROM organizations')) {
      return { 
        rowCount: 1, 
        rows: [{ 
          id: 1, 
          name: 'Test Organization', 
          type: 'referring_practice', 
          status: 'active', 
          subscription_tier: 'tier_1',
          credit_balance: 100
        }] 
      };
    }
    
    if (query.includes('INSERT INTO billing_events')) {
      return { rowCount: 1 };
    }
    
    if (query.includes('INSERT INTO purgatory_events')) {
      return { rowCount: 1 };
    }
    
    if (query.includes('UPDATE purgatory_events')) {
      return { rowCount: 1 };
    }
    
    if (query.includes('UPDATE organization_relationships')) {
      return { rowCount: 1 };
    }
    
    if (query.includes('SELECT') && query.includes('FROM users')) {
      return { 
        rowCount: 1, 
        rows: [{ 
          email: 'test.admin@example.com', 
          first_name: 'Test', 
          last_name: 'Admin' 
        }] 
      };
    }
    
    return { rowCount: 0, rows: [] };
  });
  
  return {
    getMainDbClient: jest.fn().mockResolvedValue(mockClient)
  };
});

// Mock notification service
jest.mock('../../src/services/notification/services', () => ({
  generalNotifications: {
    sendNotificationEmail: jest.fn().mockResolvedValue(true)
  }
}));

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

// Mock the shouldEnterPurgatory function
jest.mock('../../src/services/billing/stripe/webhooks/handle-invoice-payment-failed/should-enter-purgatory', () => ({
  shouldEnterPurgatory: jest.fn().mockReturnValue(true)
}));

describe('Stripe Webhook Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('handleCheckoutSessionCompleted', () => {
    it('should process checkout.session.completed event and update credit balance', async () => {
      // Mock Stripe event
      const mockEvent = {
        id: 'evt_test123',
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {
              radorderpad_org_id: '1',
              credit_bundle_price_id: 'price_credits_medium'
            },
            amount_total: 5000,
            currency: 'usd'
          }
        }
      };
      
      // Call handler
      await handleCheckoutSessionCompleted(mockEvent);
      
      // Get mock DB client
      const { getMainDbClient } = require('../../src/config/db');
      const mockClient = await getMainDbClient();
      
      // Verify transaction was started and committed
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      
      // Verify organization credit balance was updated
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE organizations'),
        expect.arrayContaining([500, 1]) // 500 credits added to org ID 1
      );
      
      // Verify billing event was logged
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO billing_events'),
        expect.arrayContaining([
          1, // org ID
          'top_up', // event type
          5000, // amount in cents
          'usd', // currency
          'evt_test123', // event ID
          expect.stringContaining('Credit bundle purchase') // description
        ])
      );
      
      // Verify client was released
      expect(mockClient.release).toHaveBeenCalled();
    });
    
    it('should throw error if organization ID is missing', async () => {
      // Mock Stripe event without org ID
      const mockEvent = {
        id: 'evt_test123',
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {},
            amount_total: 5000,
            currency: 'usd'
          }
        }
      };
      
      // Call handler and expect error
      await expect(handleCheckoutSessionCompleted(mockEvent)).rejects.toThrow('Missing organization ID');
    });
  });
  
  describe('handleInvoicePaymentSucceeded', () => {
    it('should process invoice.payment_succeeded event for active organization', async () => {
      // Mock Stripe event
      const mockEvent = {
        id: 'evt_test456',
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            customer: 'cus_TEST123456',
            amount_paid: 2000,
            currency: 'usd',
            subscription: 'sub_123456'
          }
        }
      };
      
      // Call handler
      await handleInvoicePaymentSucceeded(mockEvent);
      
      // Get mock DB client
      const { getMainDbClient } = require('../../src/config/db');
      const mockClient = await getMainDbClient();
      
      // Verify transaction was started and committed
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      
      // Verify billing event was logged
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO billing_events'),
        expect.arrayContaining([
          1, // org ID
          'subscription_payment', // event type
          2000, // amount in cents
          'usd', // currency
          'evt_test456' // event ID
        ])
      );
      
      // Verify client was released
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  
  // Additional tests for other webhook handlers can be added here
});