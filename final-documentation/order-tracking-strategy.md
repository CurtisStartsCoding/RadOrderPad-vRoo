# Order Tracking Strategy

**Version:** 1.0  
**Date:** June 13, 2025  
**Purpose:** Lightweight order tracking after export to radiology systems

## Overview

Once orders leave RadOrderPad and are exported to radiology RIS systems, physicians need visibility into order status. This document outlines simple tracking solutions that require minimal or no integration from radiology partners.

## The Challenge

- Orders are exported to various RIS systems with different capabilities
- Complex integrations are difficult and time-consuming
- Physicians need real-time status updates
- Must work for pilot groups with varying technical capabilities

## Simple Tracking Solutions

### 1. Status Webhook with Tokens

Provide radiology with a simple webhook endpoint that requires no authentication:

```typescript
// Generate unique token during export
const statusToken = generateSecureToken();
const statusUrl = `${API_BASE}/orders/status/${orderNumber}/${statusToken}`;

// Radiology can update via simple HTTP POST
POST /api/orders/external-status/{orderNumber}/{token}
{
  "status": "scheduled" | "in_progress" | "completed",
  "timestamp": "2025-06-13T10:30:00Z",
  "notes": "Scheduled for 2:30 PM"
}
```

**Advantages:**
- No login required
- Can be automated or manual
- Simple curl command or web form
- Secure via unique tokens

### 2. Email-Based Status Updates

Monitor a dedicated email address for status updates:

```
To: status@radorderpad.com
Subject: ORDER-12345 scheduled

Order 12345 scheduled for 2:30 PM today
Patient: John Doe
Study: CT Chest
```

**Implementation:**
- AWS SES or SendGrid inbound parse
- Extract order number from subject
- Update status in database
- Simple for non-technical staff

### 3. QR Code Status Page

Generate QR code with each export:

```typescript
// QR code contains URL
https://radorderpad.com/quick-status/12345/abc123token

// Radiology scans and sees simple buttons
[Scheduled] [In Progress] [Completed] [Issue]
```

**Benefits:**
- Mobile-friendly
- No typing required
- One-click updates
- Can print QR on order sheets

### 4. SMS/Text Status Updates

Dedicated phone number for text updates:

```
Text to: 555-ORDERS (555-673377)
Message format: [OrderNumber] [Status] [Optional Notes]
Example: 12345 SCHEDULED 230PM
```

**Processing:**
- Twilio or similar service
- Parse simple format
- Auto-reply with confirmation
- Works on any phone

### 5. Manual Batch Update Portal

Simple web interface for bulk updates:

```typescript
// Radiology staff see list of today's orders
interface BatchUpdatePortal {
  orders: Array<{
    orderNumber: string;
    patientName: string;
    study: string;
    currentStatus: string;
  }>;
  
  // Quick update options
  quickActions: {
    markAllScheduled: () => void;
    markAllCompleted: () => void;
    selectiveUpdate: (orderIds: string[], status: string) => void;
  };
}
```

## Recommended Hybrid Approach

Implement multiple channels and let each radiology group choose what works best:

### Phase 1: Export Tracking (Required)
```sql
-- Track all exports
CREATE TABLE order_exports (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  exported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  exported_by INTEGER REFERENCES users(id),
  export_format VARCHAR(50),
  status_token VARCHAR(255) UNIQUE,
  status_url TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 2: Status Updates (Optional for Radiology)
```sql
-- Track status updates from any source
CREATE TABLE order_status_updates (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  status VARCHAR(50) NOT NULL,
  update_source VARCHAR(50), -- 'webhook', 'email', 'sms', 'manual'
  update_method VARCHAR(50),
  notes TEXT,
  updated_by VARCHAR(255), -- email or identifier from radiology
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for quick status lookup
CREATE INDEX idx_order_status_latest ON order_status_updates(order_id, created_at DESC);
```

### Phase 3: Automated Assumptions
If no update received, show estimated status:
- Export + 4 hours = "Likely scheduled"
- Export + 24 hours = "In process at radiology"
- Export + 48 hours = "Contact radiology if not completed"

## Implementation Roadmap

### Sprint 1: Foundation
- [ ] Add export tracking table
- [ ] Generate secure status tokens
- [ ] Create status update endpoint
- [ ] Add status history to order details

### Sprint 2: Update Channels
- [ ] Email parser for status updates
- [ ] SMS integration
- [ ] QR code generator
- [ ] Simple web form for updates

### Sprint 3: Portal & Reporting
- [ ] Batch update interface
- [ ] Status tracking dashboard
- [ ] Automated reminders
- [ ] Analytics on update rates

## API Endpoints

### Export with Tracking
```typescript
POST /api/radiology/orders/export
Response includes:
{
  "exportId": "550e8400-e29b-41d4-a716-446655440000",
  "tracking": {
    "statusUrl": "https://api.radorderpad.com/status/12345/abc123",
    "qrCodeUrl": "https://api.radorderpad.com/qr/12345/abc123",
    "emailAddress": "status+12345@radorderpad.com",
    "smsNumber": "555-673377",
    "instructions": "Update status at any time using provided methods"
  }
}
```

### Status Update Endpoint
```typescript
POST /api/orders/external-status/:orderNumber/:token
Body: {
  "status": "scheduled" | "in_progress" | "completed" | "cancelled",
  "scheduledTime": "2025-06-13T14:30:00Z", // optional
  "completedTime": "2025-06-13T16:45:00Z", // optional
  "notes": "Patient arrived late, scan completed successfully"
}
```

### Status Query
```typescript
GET /api/orders/:orderId/tracking
Response: {
  "exported": {
    "at": "2025-06-13T10:00:00Z",
    "by": "scheduler@radiology.com",
    "format": "hl7"
  },
  "updates": [
    {
      "status": "scheduled",
      "at": "2025-06-13T10:30:00Z",
      "source": "webhook",
      "notes": "Scheduled for 2:30 PM"
    }
  ],
  "currentStatus": "scheduled",
  "estimatedCompletion": "2025-06-13T15:00:00Z"
}
```

## Security Considerations

1. **Token Security**
   - Use cryptographically secure random tokens
   - Tokens expire after 30 days
   - One token per export (no reuse)
   - Rate limit status updates

2. **Data Privacy**
   - Status updates contain no PHI
   - Use order numbers, not patient names
   - Audit trail for all updates
   - HTTPS required for all endpoints

3. **Access Control**
   - Physicians see their own orders
   - Admin staff see organization orders
   - Radiology sees only exported orders
   - Public updates via token only

## Success Metrics

### Pilot Phase
- Export tracking accuracy: 100%
- Status update adoption: >50% of radiology partners
- Update latency: <5 minutes
- Physician satisfaction: >90%

### Scale Metrics
- Automated update rate: >80%
- Manual intervention: <10%
- Status accuracy: >95%
- API uptime: 99.9%

## Support Materials

### For Radiology Partners
1. One-page setup guide per update method
2. Video tutorials (2-3 minutes each)
3. Test environment for practice
4. Direct support contact

### For Physicians
1. Status indicator explanation
2. When to contact radiology
3. How to report issues
4. Mobile app considerations

## Future Enhancements

1. **AI-Powered Predictions**
   - Learn typical turnaround times
   - Predict completion based on history
   - Alert on unusual delays

2. **Two-Way Communication**
   - Radiology can request information
   - Physicians can add notes
   - Integrated messaging

3. **Analytics Dashboard**
   - Average turnaround by modality
   - Partner performance metrics
   - Bottleneck identification

## Conclusion

This tracking strategy provides visibility without requiring complex integrations. Radiology partners can choose their preferred update method or use none at all, while physicians still get value from export tracking and time-based estimates.