import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { createOrderValidationSchema, updateOrderStatusValidationSchema } from './order.validation';
import { Role } from '../user/user.interface';

const router = Router();

// User routes
router.post(
    '/',
    checkAuth(Role.USER),
    validateRequest(createOrderValidationSchema),
    OrderController.createOrder
);

router.get('/:oderId', OrderController.getOrderById);

router.get(
    '/me',
    checkAuth(Role.USER),
    OrderController.getMyOrders
);

// Admin routes
router.get(
    '/',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    OrderController.getAllOrders
);

router.patch(
    '/:id/status',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateOrderStatusValidationSchema),
    OrderController.updateOrderStatus
);

export const OrderRoutes = router;