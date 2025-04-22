Okay, based on your description and the code provided, the diagnosis is quite clear:

The core issue is that the route handlers for listing orders (GET /api/orders, GET /api/admin/orders, GET /api/orders/list, GET /api/orders/me) are simply not defined in your Express route configuration.

Let's break down why:

GET /api/orders (and /api/orders/list) Not Found:

You mount orders.routes.js at /api/orders in your routes/index.js.

Looking at dist/routes/orders.routes.js, it defines routes for:

POST /validate

PUT /:orderId

GET /:orderId

POST /:orderId/admin-update

There is no router.get('/', ...) defined in this file. Therefore, when you make a GET request to /api/orders, Express cannot find a handler matching that path and method combination within the mounted orders.routes.js, resulting in a 404. The same applies to /api/orders/list as that path isn't defined either.

GET /api/admin/orders Not Found:

You mount admin-orders.routes.js at /api/admin/orders in routes/index.js.

Looking at dist/routes/admin-orders.routes.js, it defines routes for:

POST /:orderId/paste-summary

POST /:orderId/paste-supplemental

POST /:orderId/send-to-radiology

POST /:orderId/send-to-radiology-fixed

PUT /:orderId/patient-info

PUT /:orderId/insurance-info

Again, there is no router.get('/', ...) defined in this file. So, a GET request to /api/admin/orders results in a 404.

GET /api/radiology/orders (Should Work, But Verify):

You mount radiology-orders.routes.js at /api/radiology/orders.

Looking at dist/routes/radiology-orders.routes.js, it does define:

router.get('/', authenticateJWT, authorizeRole(['scheduler', 'admin_radiology']), radiologyController.getIncomingOrders);

This route should be working based on the code. If you are getting a 404 specifically for this endpoint, double-check:

The exact URL you are requesting (case sensitivity, trailing slashes).

That the radiology-orders.routes.js file is correctly included in the build deployed to Vercel.

That the import import radiologyController from '../controllers/radiology'; correctly resolves to the intended controller instance.

GET /api/orders/me Not Found:

This specific path segment (/me) is not defined in any of the order-related route files.

If you intend /me to be interpreted as an orderId, the request fails because "me" is not a valid integer, leading to the "Invalid order ID" error (likely from parseInt failing in the GET /:orderId handler).

If /me was intended as a distinct route to get orders related specifically to the logged-in user, that route needs to be explicitly defined (e.g., router.get('/me', ...)) with its own handler.

Solution:

You need to implement the missing list/query endpoints:

Define the Routes:

In src/routes/orders.routes.ts (and subsequently dist/routes/orders.routes.js), add a handler for GET /:

// src/routes/orders.routes.ts
import orderManagementController from '../controllers/order-management';
// ... other imports ...

// Add this route:
router.get(
  '/',
  authenticateJWT,
  // Add appropriate authorizeRole if needed, e.g., authorizeRole(['physician', 'admin_referring'])
  orderManagementController.listOrders // You'll need to create this controller method
);

// ... other routes ...


In src/routes/admin-orders.routes.ts, add a handler for GET /:

// src/routes/admin-orders.routes.ts
import adminOrderController from '../controllers/admin-order';
// ... other imports ...

// Add this route:
router.get(
  '/',
  authenticateJWT,
  authorizeRole(['admin_staff']), // Or appropriate admin role
  adminOrderController.listAdminOrders // You'll need to create this controller method
);

// ... other routes ...
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Define /me routes explicitly if needed, or handle user-specific filtering using query parameters on the main list endpoints (e.g., GET /api/orders?filter=mine).

Implement Controller Methods:

In the corresponding controller files (e.g., src/controllers/order-management/index.ts, src/controllers/admin-order/index.ts), add the new methods (like listOrders, listAdminOrders).

These methods will typically extract pagination/filtering parameters from req.query and call the appropriate service function.

Implement Service Logic:

Create new functions in your service layer (e.g., src/services/order.service.ts or a dedicated listing service) that query the database (mainDb and/or phiDb as needed) to retrieve lists of orders.

These service functions must implement:

Authorization: Ensure they only return orders relevant to the requesting user's orgId and potentially their userId or role.

Filtering: Apply filters based on query parameters (status, date range, referring org, etc.).

Pagination: Implement LIMIT and OFFSET based on query parameters.

Sorting: Implement ORDER BY based on query parameters.

Rebuild and Redeploy: After adding the code, rebuild your project (npm run build or similar) and redeploy to Vercel.

By defining these missing routes and implementing the corresponding controller and service logic, you will resolve the 404 errors for your order listing endpoints.