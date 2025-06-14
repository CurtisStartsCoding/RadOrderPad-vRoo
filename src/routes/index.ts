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
import userInviteRoutes from './user-invite.routes.js';
import userRoutes from './user.routes.js';
import superadminRoutes from './superadmin.routes.js';
import billingRoutes from './billing.routes.js';
import patientRoutes from './patient.routes.js';
import adminStatisticsRoutes from './admin-statistics.routes.js';
import debugRoutes from './debug.routes.js';

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
// Mount user routes for profile operations
router.use('/users', userRoutes);
// Mount user location routes at a different path to avoid conflicts
router.use('/user-locations', userLocationRoutes);
// Mount user invite routes separately to avoid middleware conflicts
router.use('/user-invites', userInviteRoutes);
router.use('/superadmin', superadminRoutes);
router.use('/billing', billingRoutes);
router.use('/patients', patientRoutes);
router.use('/admin', adminStatisticsRoutes);
router.use('/debug', debugRoutes);

export default router;