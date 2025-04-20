import { Router } from 'express';
import authRoutes from './auth.routes.js';
import orderRoutes from './orders.routes.js';
import adminOrderRoutes from './admin-orders.routes.js';
import radiologyOrderRoutes from './radiology-orders.routes.js';
import uploadsRoutes from './uploads.routes.js';
import connectionRoutes from './connection.routes.js';
import webhooksRoutes from './webhooks.routes.js';
import organizationRoutes from './organization.routes.js';
import userLocationRoutes from './user-location.routes.js';
import superadminRoutes from './superadmin.routes.js';
import billingRoutes from './billing.routes.js';
const router = Router();
// Mount routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/admin/orders', adminOrderRoutes);
router.use('/radiology/orders', radiologyOrderRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/webhooks', webhooksRoutes);
router.use('/connections', connectionRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users', userLocationRoutes);
router.use('/superadmin', superadminRoutes);
router.use('/billing', billingRoutes);
export default router;
//# sourceMappingURL=index.js.map