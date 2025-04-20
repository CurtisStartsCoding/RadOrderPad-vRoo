import { Router } from 'express';
import authRoutes from './auth.routes';
import orderRoutes from './orders.routes';
import adminOrderRoutes from './admin-orders.routes';
import radiologyOrderRoutes from './radiology-orders.routes';
import uploadsRoutes from './uploads.routes';
import connectionRoutes from './connection.routes';
import webhooksRoutes from './webhooks.routes';
import organizationRoutes from './organization.routes';
import userLocationRoutes from './user-location.routes';
import superadminRoutes from './superadmin.routes';
import billingRoutes from './billing.routes';
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