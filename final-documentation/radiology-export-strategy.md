# Radiology Export Strategy

**Version:** 1.0  
**Date:** June 13, 2025  
**Purpose:** Scalable approach for exporting orders to radiology RIS systems

## Overview

This document outlines the phased approach for radiology order exports, starting with pilot groups (50 orders/day) and scaling to enterprise volumes (2000+ orders/day).

## Phase 1: Pilot Program (< 50 orders/day)

### Platform-Based Export Portal

For pilot groups, provide a dedicated export portal within RadOrderPad that radiology staff can access alongside their RIS.

#### Implementation

```javascript
// Scheduler dashboard with export capabilities
const RadiologyExportPortal = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [exportFormat, setExportFormat] = useState('hl7-package');

  return (
    <div className="export-portal">
      <h1>Radiology Order Export</h1>
      
      {/* Quick Actions Bar */}
      <div className="quick-actions">
        <button onClick={exportNewOrders}>
          Export Today's Orders ({todayCount})
        </button>
        <button onClick={exportSelected}>
          Export Selected ({selectedOrders.length})
        </button>
        <button onClick={markBatchExported}>
          Mark as Exported
        </button>
      </div>

      {/* Order List with Multi-Select */}
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={selectAll} /></th>
            <th>Order #</th>
            <th>Patient</th>
            <th>Study</th>
            <th>Priority</th>
            <th>Documents</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <OrderExportRow 
              key={order.id}
              order={order}
              onSelect={handleSelect}
              onQuickExport={quickExportSingle}
            />
          ))}
        </tbody>
      </table>

      {/* Export Options */}
      <div className="export-options">
        <h3>Export Format:</h3>
        <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
          <option value="hl7-package">HL7 + Documents (ZIP)</option>
          <option value="hl7-only">HL7 Message Only</option>
          <option value="pdf-summary">PDF Summary</option>
          <option value="csv">CSV Data</option>
        </select>
      </div>
    </div>
  );
};
```

### Workflow Integration

#### Option 1: Side-by-Side Windows
```
[RIS System Window]          [RadOrderPad Export Portal]
├─ Patient Schedule          ├─ New Orders Queue
├─ Order Entry              ├─ Quick Export Buttons
└─ Worklist                 └─ Batch Operations
```

#### Option 2: Browser Extension
```javascript
// Chrome extension for RIS integration
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "importOrder") {
    // Extract patient info from RIS page
    const patientInfo = extractPatientFromRIS();
    
    // Fetch matching order from RadOrderPad
    fetch(`${RADORDERPAD_API}/orders/match`, {
      method: 'POST',
      body: JSON.stringify(patientInfo)
    })
    .then(response => response.json())
    .then(order => {
      // Auto-fill RIS fields
      fillRISFields(order);
    });
  }
});
```

### Features for Pilot Groups

1. **Smart Clipboard Integration**
```javascript
// One-click copy for RIS paste
const CopyForRIS = ({ order }) => {
  const copyToClipboard = () => {
    const risFormat = formatForRIS(order);
    navigator.clipboard.writeText(risFormat);
    toast.success('Copied! Paste into RIS');
  };
  
  return (
    <button onClick={copyToClipboard}>
      Copy for RIS
    </button>
  );
};
```

2. **Batch Export with Tracking**
```javascript
// Track what's been exported to prevent duplicates
const ExportTracker = {
  async exportBatch(orderIds: number[]) {
    const batch = await this.createBatch(orderIds);
    
    // Generate batch file
    const exportFile = await this.generateExport(batch);
    
    // Mark orders as exported
    await this.markExported(orderIds, {
      exportedAt: new Date(),
      exportBatchId: batch.id,
      exportedBy: currentUser.id
    });
    
    // Download file
    return exportFile;
  },
  
  // Prevent re-export
  async checkExportStatus(orderId: number) {
    const status = await db.query(
      'SELECT exported_at, exported_by FROM order_exports WHERE order_id = $1',
      [orderId]
    );
    return status.rows[0];
  }
};
```

3. **Quick Actions for Common Tasks**
```javascript
// Preset filters for daily workflow
const QuickFilters = () => {
  return (
    <div className="quick-filters">
      <button onClick={() => filterOrders('today-stat')}>
        Today's STAT (3)
      </button>
      <button onClick={() => filterOrders('not-exported')}>
        Not Exported (12)
      </button>
      <button onClick={() => filterOrders('missing-insurance')}>
        Missing Insurance (2)
      </button>
      <button onClick={() => filterOrders('ready-to-export')}>
        Ready to Export (8)
      </button>
    </div>
  );
};
```

## Phase 2: Growing Groups (50-500 orders/day)

### Automated Scheduled Exports

```javascript
// Configure scheduled exports
const ScheduledExportConfig = {
  organizationId: 123,
  schedule: {
    frequency: 'EVERY_30_MINUTES',
    times: ['07:00', '07:30', '08:00', ...], // Every 30 min during business hours
    timezone: 'America/Los_Angeles'
  },
  delivery: {
    method: 'SFTP',
    connection: {
      host: 'sftp.radiologygroup.com',
      username: 'radorderpad',
      folder: '/imports/new_orders/'
    }
  },
  format: {
    type: 'HL7_BATCH',
    includeDocuments: true,
    documentFormat: 'EMBEDDED_BASE64'
  }
};
```

### Hybrid Approach
- Automatic exports every 30 minutes
- Manual export button for urgent cases
- Email notifications for STAT orders

## Phase 3: Enterprise Scale (500+ orders/day)

### Real-Time Integration

```javascript
// Real-time order streaming
export class EnterpriseExporter {
  async initialize(org: Organization) {
    if (org.dailyOrderVolume > 500) {
      // Set up real-time streaming
      this.enableStreaming(org);
      
      // Configure HL7 interface
      this.hl7Interface = new HL7Interface({
        host: org.interfaceEngine.host,
        port: org.interfaceEngine.port,
        protocol: 'MLLP'
      });
      
      // Start order monitor
      this.startOrderMonitor(org);
    }
  }
  
  private startOrderMonitor(org: Organization) {
    // Listen for new orders
    this.orderEmitter.on('order.sent_to_radiology', async (order) => {
      if (order.radiologyOrgId === org.id) {
        // Stream immediately
        await this.streamOrder(order);
      }
    });
  }
}
```

## Implementation Checklist

### For Pilot Launch
- [ ] Export portal page in scheduler dashboard
- [ ] Batch export functionality
- [ ] Export tracking to prevent duplicates
- [ ] Quick copy-paste for manual entry
- [ ] Basic export formats (HL7, PDF, CSV)
- [ ] Simple authentication (existing login)

### Database Schema
```sql
-- Track exports
CREATE TABLE order_exports (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  exported_at TIMESTAMP NOT NULL DEFAULT NOW(),
  exported_by INTEGER REFERENCES users(id),
  export_method VARCHAR(50), -- 'manual', 'scheduled', 'api'
  export_format VARCHAR(50), -- 'hl7', 'pdf', 'csv'
  batch_id UUID,
  destination VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Prevent duplicate exports
CREATE UNIQUE INDEX idx_order_export_active 
ON order_exports(order_id) 
WHERE status = 'completed';
```

### API Endpoints
```typescript
// Get exportable orders
GET /api/radiology/orders/exportable
Query params:
- status: 'not_exported' | 'all'
- date_from: ISO date
- date_to: ISO date
- priority: 'stat' | 'urgent' | 'routine'

// Export single order
POST /api/radiology/orders/:orderId/export
Body: {
  format: 'hl7-package' | 'hl7' | 'pdf' | 'csv',
  markAsExported: boolean
}

// Batch export
POST /api/radiology/orders/export-batch
Body: {
  orderIds: number[],
  format: string,
  delivery: 'download' | 'sftp' | 'email'
}

// Get export history
GET /api/radiology/orders/:orderId/export-history
```

## Security Considerations

1. **Export Permissions**
   - Only schedulers and admin_radiology can export
   - Track all exports for audit trail
   - Implement export limits if needed

2. **Data Protection**
   - Encrypted downloads (ZIP with password)
   - Secure SFTP connections only
   - Temporary download URLs (expire in 1 hour)

3. **HIPAA Compliance**
   - Log all export activities
   - Ensure BAA with radiology groups
   - Encrypt data in transit

## Success Metrics

### Pilot Phase
- Time from order receipt to RIS entry: < 5 minutes
- Export errors: < 1%
- User satisfaction: > 90%

### Scale Metrics
- Orders auto-exported: > 95%
- Manual intervention needed: < 5%
- System uptime: 99.9%

## Future Enhancements

1. **Smart Matching**
   - Auto-match RadOrderPad orders with RIS patients
   - Suggest corrections for mismatches

2. **Two-Way Sync**
   - Pull scheduling updates from RIS
   - Update order status automatically

3. **Mobile App**
   - Export orders from mobile device
   - Barcode scanning for quick matching

## Support Plan

### Pilot Support
- Dedicated Slack channel
- Daily check-ins first week
- On-demand screen sharing
- Quick iteration on feedback

### Documentation
- Video tutorials for common tasks
- RIS-specific guides
- Troubleshooting flowchart

This phased approach ensures pilot groups can start simply with manual exports from the platform, then gradually automate as volume increases.